import { Box, Tag, Text, useColorModeValue } from "@chakra-ui/react";
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
import SideButton from "./sideButton";
import SelectorModal from "../selector/SelectorModal";
import PmIcons from "./pmIcons";

const PmModalButton = () => {
  const dispatch = useAppDispatch();
  const p2pIndex = useContext(p2pContext);
  const side = useContext(SideContext) as "give" | "get";
  const tmp = useAppSelector((state) => {
    if (p2pIndex !== undefined) return state.main.p2p.dirs[p2pIndex]?.[side];
    return state.main[`${side}Pm`];
  });
  const pms = !tmp ? [] : Array.isArray(tmp) ? [...tmp.slice(0, 3)] : [tmp];
  const tagBgColor = useColorModeValue("bg.100", "bg.600");
  const openDialog = () => {
    batch(() => {
      dispatch(triggerModal(side + p2pIndex || ""));
      dispatch(setSearchBarInputValue(""));
    });
  };

  if (!pms.length)
    return (
      <SideButton openDialog={openDialog}>
        <SelectorModal id={side + p2pIndex || ""} />
        <ResponsiveText size="md" variant="primary">
          {capitalize(side === "give" ? "sell" : "buy")}
        </ResponsiveText>
      </SideButton>
    );

  const { subgroup_name } = pms[0]; // TAG
  const currencyCode = pms[0].currency.code.toUpperCase();
  return (
    <SideButton openDialog={openDialog} leftIcon={<PmIcons pms={pms} />}>
      <SelectorModal id={side + p2pIndex || ""} />
      <ResponsiveText size="md" variant="primary">
        {currencyCode}
      </ResponsiveText>

      {subgroup_name && (
        <Box
          position="absolute"
          zIndex="5"
          w="fit-content"
          right={-3}
          bottom={-2.5}
        >
          <Tag size="sm" bgColor={tagBgColor}>
            <Text variant="contrast">{subgroup_name}</Text>
          </Tag>
        </Box>
      )}
    </SideButton>
  );
};

export default PmModalButton;
