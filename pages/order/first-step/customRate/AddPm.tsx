import { Center, Text, useColorModeValue } from "@chakra-ui/react";
import { symbols } from "../../../../redux/amountsHelper";
import { useContext } from "react";
import { IoAddSharp } from "react-icons/io5";
import { batch } from "react-redux";

import p2pContext from "../../../../components/shared/contexts/p2pContext";
import SideContext from "../../../../components/shared/contexts/SideContext";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  setSearchBarInputValue,
  triggerModal,
} from "../../../../redux/mainReducer";
import { ShadedButton } from "../../../../styles/theme/custom";

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
      (key) => key.toUpperCase() === currencyCode?.toUpperCase()
    )
  )
    return <></>;

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    console.log(side, p2pIndex);
    if (side && p2pIndex !== undefined) {
      batch(() => {
        dispatch(triggerModal(side + p2pIndex || ""));
        dispatch(setSearchBarInputValue(currencyCode.toUpperCase()));
      });
    }
    e.stopPropagation();
  };
  return (
    <ShadedButton p="0.5" border="2px dashed" borderColor="bg.500">
      <Center onClick={handleClick}>
        <IoAddSharp size="1rem" />
      </Center>
    </ShadedButton>
  );
};

export default AddPm;
