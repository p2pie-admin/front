import Subitems from "./Subitems";
import PmButton from "./PmButton";
import PmName from "./PmName";
import { getPmsFromPmGroup, singlePmHasUnmetPairs } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/hooks";
import { batch } from "react-redux";
import {
  fetchDirRates,
  fetchPossiblePairs,
  fetchCurrencyConverterRate,
} from "../../../../../../redux/thunks";
import { IPmGroup, IPm } from "../../../../../../types/selector";
import {
  addPm,
  setPm,
  triggerModal,
} from "../../../../../../redux/mainReducer";
import { useRouter } from "next/router";
import { useContext } from "react";
import P2PContext from "../../../../../shared/contexts/p2pContext";

import SideContext from "../../../../../shared/contexts/SideContext";

const PmGroup = ({ pm_group }: { pm_group: IPmGroup }) => {
  const p2pIndex = useContext(P2PContext);
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

  const [p2pGivePm, p2pGetPm] = useAppSelector((state) => [
    state.main.p2p.dirs[p2pIndex || 0].give,
    state.main.p2p.dirs[p2pIndex || 0].get,
  ]);

  const choosePmP2P = (selectedPm: IPm) => {
    const oppositePm = side === "give" ? p2pGetPm : p2pGivePm;
    batch(() => {
      dispatch(addPm({ pm: selectedPm, side, index: p2pIndex || 0 }));
      dispatch(triggerModal(side + (p2pIndex === undefined ? "" : p2pIndex)));

      if (oppositePm?.code) {
        const dir =
          side === "get"
            ? `${oppositePm.currency.code}_${selectedPm.currency.code}`
            : `${selectedPm.currency.code}_${oppositePm.currency.code}`;
        dispatch(fetchCurrencyConverterRate({ dir, p2pIndex }));
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
      dispatch(triggerModal(side + (p2pIndex === undefined ? "" : p2pIndex)));
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
          dispatch(fetchCurrencyConverterRate({ dir }));
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
        choosePm={p2pIndex !== undefined ? choosePmP2P : choosePm}
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
        p2pIndex !== undefined
          ? () => choosePmP2P(pms[0])
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
