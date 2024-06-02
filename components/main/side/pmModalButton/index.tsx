import { Box, Center, Tag, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useContext } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import SideContext from "../../../shared/contexts/SideContext";
import { capitalize } from "../selector/section/PmGroup/helper";
import p2pContext from "../../../shared/contexts/p2pContext";

import { ResponsiveText } from "../../../../styles/theme/custom";
import { batch } from "react-redux";
import {
  triggerModal,
  setSearchBarInputValue,
} from "../../../../redux/mainReducer";

import SelectorModal from "../selector/SelectorModal";
import PmIcons from "./PmIcons";
import ModalButton from "./ModalButton";
import { fetchPossiblePairs } from "../../../../redux/thunks";
import { IoAddOutline } from "react-icons/io5";

const PmModalButton = () => {
  const dispatch = useAppDispatch();
  const p2pIndex = useContext(p2pContext);
  const side = useContext(SideContext) as "give" | "get";
  const oppositeSide = side === "give" ? "get" : "give";
  const isP2P = p2pIndex !== undefined;
  const pms = useAppSelector((state) => {
    if (isP2P) return state.main.p2p.dirs[p2pIndex]?.[side]?.slice(0, 3);
    const pm = state.main?.[`${side}Pm`];
    return pm ? [pm] : [];
    //      state.main[`${side == "give" ? "get" : "give"}Pm`],
  }); // либо три в ряд для п2п либо pm и обратная pm
  const oppositePm = useAppSelector((state) =>
    isP2P ? undefined : state.main?.[`${oppositeSide}Pm`]
  );
  const openDialog = () => {
    batch(() => {
      // берем возможные пары для обратной пм если такая выбрана
      oppositePm &&
        dispatch(fetchPossiblePairs({ code: oppositePm.code, side }));
      dispatch(triggerModal(side + p2pIndex || ""));
      dispatch(setSearchBarInputValue(""));
    });
  };
  const unselectedPmText = capitalize(side === "give" ? "sell" : "buy");

  const currencyCode = pms?.[0]?.currency.code.toUpperCase();
  return (
    <ModalButton
      openDialog={openDialog}
      leftIcon={
        pms?.length ? (
          <PmIcons pms={pms} />
        ) : (
          <Center
            border="2px dashed"
            borderColor="bg.500"
            borderRadius="50%"
            h="6"
            w="6"
          >
            <IoAddOutline size="1rem" />
          </Center>
        )
      }
    >
      <SelectorModal id={side + p2pIndex || ""} />
      <ResponsiveText size="md" variant="primary">
        {!pms?.length ? unselectedPmText : currencyCode}
      </ResponsiveText>

      {pms?.[0]?.subgroup_name && ( // tag
        <Box
          position="absolute"
          zIndex="5"
          w="fit-content"
          right={2}
          bottom={-3}
        >
          <Tag size="sm" bgColor="blackAlpha.300">
            <Text variant="contrast">{pms?.[0].subgroup_name}</Text>
          </Tag>
        </Box>
      )}
    </ModalButton>
  );
};

export default PmModalButton;
