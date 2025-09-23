import { HStack, VStack } from "@chakra-ui/react";
import MultiSelectMenu from "./MultiSelectMenu";
import AmountInput from "./AmountInput";
import MassSortButtons from "./MassSortButtons";
import { useState } from "react";
import { IPm } from "../../../../types/selector";

export type Option = { value: string; label: string };

const TopPanel = ({
  toggleFilter,
  pmsByCodes,
  activeFilter,
}: {
  pmsByCodes: Record<string, IPm>;
  toggleFilter: (status: string | null) => void;
  activeFilter: string;
}) => {
  const [sel, setSel] = useState<string[]>(["usd", "eur"]);

  return (
    <HStack
      gap="4"
      align="stretch"
      w="100%"
      display={{ base: "none", lg: "flex" }}
    >
      <MultiSelectMenu
        pmsByCodes={pmsByCodes}
        value={sel}
        onChange={(next) => setSel(next)}
        placeholder="Choose currencies"
      />

      <AmountInput onAmountChange={() => {}} />
      <MassSortButtons
        sortCriteria={"course"}
        sortDirection={"asc"}
        toggleSort={() => {}}
      />
    </HStack>
  );
};

export default TopPanel;
