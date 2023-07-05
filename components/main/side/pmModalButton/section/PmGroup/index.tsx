import Subitems from "./Subitems";
import PmButton from "./PmButton";
import PmName from "./PmName";
import { getPmsFromPmGroup, singlePmHasUnmetPairs } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/hooks";
import { batch } from "react-redux";
import {
  fetchDirRates,
  fetchAllDirRates,
  fetchFiatByCurrencyCode,
  fetchPossiblePairs,
} from "../../../../../../redux/thunks";
import { IPmGroup, IPm } from "../../../../../../types/selector";
import {
  setActiveSide,
  setCurrencyConverterRate,
  setPm,
} from "../../../../../../redux/mainReducer";
import { useRouter } from "next/router";
import { useContext } from "react";
import P2PContext from "../../../../../shared/contexts/p2pContext";
import { init } from "next/dist/compiled/@vercel/og/satori";
import {
  initCurrencyConverterFetcher,
  initParserFetcher,
} from "../../../../../../services/fetchers";
import { ICurrencyConverterRate } from "../../../../../../types/rates";

const PmGroup = ({ pm_group }: { pm_group: IPmGroup }) => {
  const isP2P = useContext(P2PContext);
  const dispatch = useAppDispatch();
  const activeSide = useAppSelector((state) => state.main.activeSide);
  const possiblePairs = useAppSelector((state) =>
    activeSide
      ? state.main[`${activeSide === "give" ? "get" : "give"}Pm`]
          ?.possible_pairs
      : undefined
  );
  const router = useRouter();

  const [givePm, getPm] = useAppSelector((state) => [
    state.main.givePm,
    state.main.getPm,
  ]);

  const choosePm = (selectedPm: IPm, shaded: boolean) => {
    if (!activeSide) return;
    const oppositePm = activeSide === "give" ? getPm : givePm;
    batch(() => {
      dispatch(
        fetchFiatByCurrencyCode({
          code: selectedPm.currency.code,
          side: activeSide,
        })
      ); // нужен только код валюты,  reducer сам запишет куда надо

      dispatch(setActiveSide(null));
      // for p2p
      dispatch(setPm({ pm: selectedPm, side: activeSide }));
      if (oppositePm?.code && isP2P) {
        const dir =
          activeSide === "get"
            ? `${oppositePm.currency.code}_${selectedPm.currency.code}`
            : `${selectedPm.currency.code}_${oppositePm.currency.code}`;
        const fetcher = initCurrencyConverterFetcher();
        fetcher(dir)
          .then((rate: ICurrencyConverterRate) =>
            dispatch(setCurrencyConverterRate(rate))
          )
          .catch((e) => console.log(e));
        return;
      }
      // for exchangers
      dispatch(fetchPossiblePairs({ code: selectedPm.code, side: activeSide }));
      dispatch(setPm({ pm: selectedPm, side: activeSide }));
      if (oppositePm?.code && !isP2P) {
        if (shaded) {
          // clear opposite Pm is no pair possible anyway
          dispatch(
            setPm({
              side: activeSide === "give" ? "get" : "give",
            })
          );
        } else {
          const dir =
            activeSide === "get"
              ? `${oppositePm.code}_${selectedPm.code}`
              : `${selectedPm.code}_${oppositePm.code}`;
          const pmGroups =
            activeSide === "get"
              ? `${oppositePm.pm_group_id}_${selectedPm.pm_group_id}`
              : `${selectedPm.pm_group_id}_${oppositePm.pm_group_id}`;
          router.push(`/?dir=${dir}&pm_groups=${pmGroups}`, undefined, {
            shallow: true,
          });
          dispatch(fetchDirRates({ code: selectedPm.code, side: activeSide }));
        }
      }
    });
  };

  const pms = getPmsFromPmGroup(pm_group);
  const name = pm_group.en_name;

  if (!pms.length) {
    return <></>;
  }

  if (pms.length > 1) {
    return (
      <Subitems
        pmGroupName={name}
        pms={pms}
        color={pm_group.color}
        choosePm={choosePm}
        possiblePairs={possiblePairs}
      />
    ); // pm_id from pm_group_short_name + currency or subitem
  }

  const shadedPm = singlePmHasUnmetPairs(pms[0], possiblePairs);

  return (
    // pm_id from pm_group_short_name or currency
    <PmButton
      color={pm_group.color}
      icon={pm_group.icon}
      handleToggle={() => choosePm(pms[0], shadedPm)}
      shaded={shadedPm}
    >
      <PmName
        name={name}
        code={pms[0].currency?.code} // for crypto
      />
    </PmButton>
  );
};

export default PmGroup;
