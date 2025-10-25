import { HStack, VStack } from "@chakra-ui/react";
import MultiSelectMenu from "./MultiSelectMenu";
import AmountInput from "./AmountInput";
import MassSortButtons from "./MassSortButtons";
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
    <HStack
      gap="4"
      align="stretch"
      w="100%"
      display={{ base: "none", lg: "flex" }}
    >
      <MultiSelectMenu fiatPms={fiatPms} />
      <AmountInput massDirTextId={massDirTextId} />
      <MassSortButtons />
    </HStack>
  );
};

export default TopPanel;
