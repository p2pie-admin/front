import { Center, Text, useColorModeValue } from "@chakra-ui/react";
import { symbols } from "../../../../redux/amountsHelper";
import { useContext } from "react";
import { IoAddSharp } from "react-icons/io5";
import { batch } from "react-redux";

import p2pContext from "../../../shared/contexts/p2pContext";
import SideContext from "../../../shared/contexts/SideContext";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  setSearchBarInputValue,
  triggerModal,
} from "../../../../redux/mainReducer";
import { ShadedButton } from "../../../../styles/theme/custom";
import SelectorModal from "../selector/SelectorModal";

const AddPm = () => {
  const side = useContext(SideContext) as "give" | "get";
  const p2pIndex = useContext(p2pContext);
  const dispatch = useAppDispatch();

  const currencyCode = useAppSelector((state) =>
    p2pIndex !== undefined
      ? state.main.p2p.dirs[p2pIndex][side]?.[0]?.currency.code
      : undefined
  );

  if (
    !currencyCode ||
    !Object.keys(symbols).find(
      (key) =>
        key.toUpperCase() === currencyCode?.toUpperCase() && key !== "btc"
    )
  )
    return <></>;

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (side && p2pIndex !== undefined) {
      batch(() => {
        dispatch(triggerModal("+" + side + p2pIndex));
        dispatch(setSearchBarInputValue(currencyCode.toUpperCase()));
      });
    }
    e.stopPropagation();
  };
  return (
    <ShadedButton
      onClick={handleClick}
      p={["0.3", "0.5"]}
      border="2px dashed"
      borderColor="bg.500"
      mr="2"
    >
      <SelectorModal id={"+" + side + p2pIndex || ""} />
      <IoAddSharp size="1.2rem" />
    </ShadedButton>
  );
};

export default AddPm;
