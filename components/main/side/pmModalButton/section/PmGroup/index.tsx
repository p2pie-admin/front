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
  setAmount,
  setPm,
  updateAmount,
} from "../../../../../../redux/mainReducer";

const PmGroup = ({ pm_group }: { pm_group: IPmGroup }) => {
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
      dispatch(fetchPossiblePairs({ code: selectedPm.code, side: activeSide }));
      dispatch(setPm({ pm: selectedPm, side: activeSide }));
      dispatch(setActiveSide(null));
      if (oppositePm?.code) {
        if (shaded) {
          dispatch(
            setPm({
              side: activeSide === "give" ? "get" : "give",
            })
          );
        } else {
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
