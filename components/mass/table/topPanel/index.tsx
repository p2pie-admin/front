import { Box, HStack, VStack } from "@chakra-ui/react";
import MultiSelectMenu from "./MultiSelectMenu";
import AmountInput from "./AmountInput";
import MassSortButtons from "./MassSortButtons";
import PaymentChips from "./PaymentChips";
import { useState } from "react";
import { IPm } from "../../../../types/selector";
import { IMassDirTextId } from "../../../../types/mass";

export type Option = { value: string; label: string };

const TopPanel = ({
  fiatPms,
  massDirTextId,
}: {
  fiatPms: Record<string, IPm>;
  massDirTextId: IMassDirTextId;
}) => {
  return (
    <>
      <VStack
        display={{ base: "flex", md: "none" }}
        spacing="3"
        align="stretch"
        w="100%"
        minW="0"
        py="2"
        px="2"
      >
        <PaymentChips fiatPms={fiatPms} />
        <AmountInput massDirTextId={massDirTextId} />
        <MassSortButtons />
      </VStack>

      <HStack
        display={{ base: "none", md: "flex" }}
        gap="4"
        align="stretch"
        w="100%"
      >
        <MultiSelectMenu fiatPms={fiatPms} />
        <AmountInput massDirTextId={massDirTextId} />
        <MassSortButtons />
      </HStack>
    </>
  );
};

export default TopPanel;
