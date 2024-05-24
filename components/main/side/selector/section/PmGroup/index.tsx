import Subitems from "./Subitems";
import PmButton from "./PmButton";
import Name from "./Name";
import {
  extractPmsFromPmGroup,
  pmsToSlug,
  singlePmHasUnmetPairs,
} from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/hooks";
import { batch } from "react-redux";
import {
  fetchPossiblePairs,
  fetchCurrencyConverterRates,
} from "../../../../../../redux/thunks";
import { IPmGroup, IPm } from "../../../../../../types/selector";
import {
  addPmP2P,
  setDirRatesStatusPending,
  setPm,
  setPmP2P,
  triggerModal,
} from "../../../../../../redux/mainReducer";
import { useRouter } from "next/router";
import { useContext } from "react";
import P2PContext from "../../../../../shared/contexts/p2pContext";

import SideContext from "../../../../../shared/contexts/SideContext";

const PmGroup = ({ pm_group }: { pm_group: IPmGroup }) => {
  const router = useRouter();
  const p2pDirIndex = useContext(P2PContext);
  const dispatch = useAppDispatch();
  const side = useContext(SideContext) as "give" | "get";
  const pms = extractPmsFromPmGroup(pm_group);
  if (!pms || !pms.length) {
    return <></>;
  }
  // const possiblePairs = useAppSelector((state) =>
  //   side
  //     ? state.main[`${side === "give" ? "get" : "give"}Pm`]?.possible_pairs
  //     : undefined
  // );
  // const router = useRouter();

  // const givePm = useAppSelector((state) => state.main.givePm);
  // const getPm = useAppSelector((state) => state.main.getPm);
  // const p2pGivePm = useAppSelector(
  //   (state) => state.main.p2p.dirs[p2pDirIndex || 0].give
  // );
  // const p2pGetPm = useAppSelector(
  //   (state) => state.main.p2p.dirs[p2pDirIndex || 0].get
  // );
  // const isAddPm = useAppSelector((state) => state.main.modal?.includes("+"));

  const choosePmP2P = (selectedPm: IPm) => {
    // для странички ордеров
    // const oppositePm = side === "give" ? p2pGetPm?.[0] : p2pGivePm?.[0];
    // batch(() => {
    //   isAddPm
    //     ? dispatch(addPmP2P({ pm: selectedPm, side, index: p2pDirIndex || 0 }))
    //     : dispatch(setPmP2P({ pm: selectedPm, side, index: p2pDirIndex || 0 }));
    //   dispatch(triggerModal(undefined));
    //   if (oppositePm?.code) {
    //     const curPair =
    //       side === "get"
    //         ? `${oppositePm.currency.code}_${selectedPm.currency.code}`
    //         : `${selectedPm.currency.code}_${oppositePm.currency.code}`;
    //     dispatch(fetchCurrencyConverterRates({ curPair, p2pDirIndex }));
    //   }
    // });
  };

  const choosePm = () => {
    const pm = pms[0];
    const oldSlug = router.query.slug as string;
    const leftPart =
      side === "give"
        ? `${pm.en_name}-${pm.currency.code}`
        : oldSlug.split("-to-")[0];
    const rightPart =
      side === "give"
        ? oldSlug.split("-to-")[1]
        : `${pm.en_name}-${pm.currency.code}`;
    const slug = `${leftPart}-to-${rightPart}`
      .replaceAll(" ", "")
      .toLowerCase();

    batch(() => {
      dispatch(triggerModal(undefined));
      dispatch(setDirRatesStatusPending());
      dispatch(setPm({ pm, side }));
    });
    router.push(`/exchange/${slug}`);

    // const oppositePm = side === "give" ? getPm : givePm;
    // batch(() => {
    //   dispatch(fetchPossiblePairs({ code: selectedPm.code, side }));
    //   dispatch(triggerModal(undefined));
    //   dispatch(setPm({ pm: selectedPm, side }));
    //   if (oppositePm?.code) {
    //     if (shaded) {
    //       // clear opposite Pm is no pair possible anyway
    //       dispatch(
    //         setPm({
    //           pm: undefined,
    //           side: side === "give" ? "get" : "give",
    //         })
    //       );
    //     } else {
    //       const slug = pmsToSlug(
    //         side === "get"
    //           ? { givePm, getPm: selectedPm }
    //           : { givePm: selectedPm, getPm }
    //       );
    //       router.push(`/exchange/${slug}`, undefined, {
    //         shallow: true,
    //       });
    //     }
    //   }
    // });
  };

  const name = pm_group.en_name;

  if (pms.length > 1) {
    return (
      <Subitems
        pmGroupName={name}
        pms={pms}
        color={pm_group.color}
        choosePm={p2pDirIndex !== undefined ? choosePmP2P : choosePm}
        //possiblePairs={possiblePairs}
      />
    ); // pm_id from pm_group_short_name + currency or subitem
  }

  const shadedPm = false; //singlePmHasUnmetPairs(pms[0], possiblePairs);

  return (
    // pm_id from pm_group_short_name or currency
    <PmButton
      color={pm_group.color}
      icon={pm_group.icon}
      handleToggle={
        p2pDirIndex !== undefined ? () => choosePmP2P(pms[0]) : choosePm
      }
      shaded={shadedPm}
    >
      <Name
        name={name}
        code={pms[0].currency?.code} // for crypto
      />
    </PmButton>
  );
};

export default PmGroup;
