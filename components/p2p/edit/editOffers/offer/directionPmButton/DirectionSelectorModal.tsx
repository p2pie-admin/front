import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import CustomModal from "../../../../../shared/CustomModal";
import { DirectionSide } from "../types";
import DirectionSelector from "./DirectionSelector";

const DirectionSelectorModal = ({
  id,
  side,
  directionIndex,
}: {
  id: string;
  side: DirectionSide;
  directionIndex: number;
}) => {
  const primary = useColorModeValue("violet.700", "peach.300");
  const header =
    side === "give" ? (
      <>
        Что клиент{" "}
        <Box as="span" color={primary}>
          отдает тебе
        </Box>
        ?
      </>
    ) : (
      <>
        Что клиент{" "}
        <Box as="span" color={primary}>
          получает от тебя
        </Box>
        ?
      </>
    );

  return (
    <CustomModal id={id} header={header}>
      <DirectionSelector side={side} directionIndex={directionIndex} />
    </CustomModal>
  );
};

export default DirectionSelectorModal;
