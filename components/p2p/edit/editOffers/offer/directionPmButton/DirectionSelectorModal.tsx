import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import CustomModal from "../../../../../shared/CustomModal";
import { DirectionSide } from "../types";
import DirectionSelector from "./DirectionSelector";
import { useT } from "../../../../../../services/i18n";

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
  const t = useT();
  const header =
    side === "give" ? (
      <>
        {t("Что клиент", "What does the client")}{" "}
        <Box as="span" color={primary}>
          {t("отдает тебе", "give you")}
        </Box>
        ?
      </>
    ) : (
      <>
        {t("Что клиент", "What does the client")}{" "}
        <Box as="span" color={primary}>
          {t("получает от тебя", "get from you")}
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
