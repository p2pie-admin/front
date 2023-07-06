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
  addPm,
  setCurrencyConverterRate,
  setPm,
  triggerModal,
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
import SideContext from "../../../../../shared/contexts/SideContext";

const PmGroup = ({ pm_group }: { pm_group: IPmGroup }) => {
  const isP2P = useContext(P2PContext);
  const dispatch = useAppDispatch();
  const side = useContext(SideContext) as "give" | "get";
  const possiblePairs = useAppSelector((state) =>
    side
      ? state.main[`${side === "give" ? "get" : "give"}Pm`]?.possible_pairs
      : undefined
  );
  const router = useRouter();

  const [givePm, getPm] = useAppSelector((state) => [
    state.main.givePm,
    state.main.getPm,
  ]);

  const choosePmP2P = (selectedPm: IPm, shaded: boolean) => {
    const oppositePm = side === "give" ? getPm : givePm;
    batch(() => {
      dispatch(addPm({ pm: selectedPm, side }));
      dispatch(triggerModal(side));

      if (oppositePm?.code) {
      }
      //   const dir =
      //     side === "get"
      //       ? `${oppositePm.currency.code}_${selectedPm.currency.code}`
      //       : `${selectedPm.currency.code}_${oppositePm.currency.code}`;
      //   const fetcher = initCurrencyConverterFetcher();
      //   fetcher(dir)
      //     .then((rate: ICurrencyConverterRate) =>
      //       dispatch(setCurrencyConverterRate(rate))
      //     )
      //     .catch((e) => console.log(e));
      //   return;
      // }
    });
  };

  const choosePm = (selectedPm: IPm, shaded: boolean) => {
    const oppositePm = side === "give" ? getPm : givePm;
    batch(() => {
      dispatch(fetchPossiblePairs({ code: selectedPm.code, side }));
      dispatch(triggerModal(side));
      dispatch(setPm({ pm: selectedPm, side }));

      if (oppositePm?.code) {
        if (shaded) {
          // clear opposite Pm is no pair possible anyway
          dispatch(
            setPm({
              side: side === "give" ? "get" : "give",
            })
          );
        } else {
          const dir =
            side === "get"
              ? `${oppositePm.code}_${selectedPm.code}`
              : `${selectedPm.code}_${oppositePm.code}`;
          const pmGroups =
            side === "get"
              ? `${oppositePm.pm_group_id}_${selectedPm.pm_group_id}`
              : `${selectedPm.pm_group_id}_${oppositePm.pm_group_id}`;
          router.push(`/?dir=${dir}&pm_groups=${pmGroups}`, undefined, {
            shallow: true,
          });
          //dispatch(fetchCurrencyConverterRate(rate))
          dispatch(fetchDirRates({ code: selectedPm.code, side }));
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
        choosePm={isP2P ? choosePmP2P : choosePm}
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
      handleToggle={
        isP2P
          ? () => choosePmP2P(pms[0], shadedPm)
          : () => choosePm(pms[0], shadedPm)
      }
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
