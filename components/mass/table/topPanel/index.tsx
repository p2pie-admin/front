import { Box, HStack, VStack } from "@chakra-ui/react";
import MultiSelectMenu from "./MultiSelectMenu";
import AmountInput from "./AmountInput";
import MassSortButtons from "./MassSortButtons";
import { useState } from "react";
import { IPm } from "../../../../types/selector";
import { IMassDirTextId } from "../../../../types/mass";

export type Option = { value: string; label: string };

const TopPanel = ({
  fiatPms,
  isSmall,
  massDirTextId,
}: {
  fiatPms: Record<string, IPm>;
  isSmall: boolean;
  massDirTextId: IMassDirTextId;
}) => {
  if (isSmall) {
    return (
      <Box py="2" px="4">
        <HStack gap="4" align="stretch" w="100%" mb="4">
          <MultiSelectMenu fiatPms={fiatPms} isSmall={isSmall} />
          <AmountInput massDirTextId={massDirTextId} />
        </HStack>
        <MassSortButtons />
      </Box>
    );
  }
  return (
    <HStack gap="4" align="stretch" w="100%">
      <MultiSelectMenu fiatPms={fiatPms} isSmall={isSmall} />
      <AmountInput massDirTextId={massDirTextId} />
      <MassSortButtons />
    </HStack>
  );
};

export default TopPanel;
