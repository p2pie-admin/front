import Subitems from "./Subitems";
import PmButton from "./PmButton";
import PmName from "./PmName";
import { getPmsFromPmGroup, singlePmHasUnmetPairs } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/hooks";
import { batch } from "react-redux";
import {
  fetchDirRates,
  fetchDirTops,
  fetchFiatByCurrencyCode,
  fetchPossiblePairs,
} from "../../../../../../redux/thunks";
import { PmGroupType, PmType } from "../../../../../../types/selector";
import {
  setActiveSide,
  setAmount,
  setPm,
} from "../../../../../../redux/mainReducer";

const PmGroup = ({ pm_group }: { pm_group: PmGroupType }) => {
  const dispatch = useAppDispatch();
  const activeSide = useAppSelector((state) => state.main.activeSide);
  const possiblePairs = useAppSelector((state) =>
    activeSide
      ? state.main[`${activeSide === "give" ? "get" : "give"}Pm`]
          ?.possible_pairs
      : undefined
  );

  const [givePm, getPm] = useAppSelector((state) => [
    state.main.givePm,
    state.main.getPm,
  ]);

  const choosePm = (selectedPm: PmType) => {
    if (!activeSide) return;
    const oppositePm = activeSide === "give" ? getPm : givePm;
    batch(() => {
      dispatch(
        fetchFiatByCurrencyCode({
          code: selectedPm.currency.code,
          side: activeSide,
        })
      ); // нужен только код валюты,  reducer сам запишет куда надо
      dispatch(fetchPossiblePairs({ code: selectedPm.code, side: activeSide }));
      oppositePm?.code &&
        dispatch(fetchDirTops({ code: selectedPm.code, side: activeSide }));
      dispatch(setPm({ pm: selectedPm, side: activeSide }));
      dispatch(setActiveSide(null));
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
        choosePm={choosePm}
        possiblePairs={possiblePairs}
      />
    ); // pm_id from pm_group_short_name + currency or subitem
  }

  return (
    // pm_id from pm_group_short_name or currency
    <PmButton
      icon={pm_group.icon}
      handleToggle={() => choosePm(pms[0])}
      disabled={singlePmHasUnmetPairs(pms[0], possiblePairs)}
    >
      <PmName
        name={name}
        code={pms[0].currency.code} // for crypto
      />
    </PmButton>
  );
};

export default PmGroup;
