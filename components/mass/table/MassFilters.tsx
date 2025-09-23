import { Box, HStack, VStack } from "@chakra-ui/react";
import { Box3D } from "../../../styles/theme/custom";
import ExchangerSearch from "../../exchangers/ExchangerSearch";
import FilterButtons from "../../exchangers/FilterButtons";
import SortButtons from "../../exchangers/SortButtons";

const MassFilters = ({
  toggleFilter,
  activeFilter,
}: {
  toggleFilter: (status: string | null) => void;
  activeFilter: string;
}) => {
  return (
    <HStack
      gap="4"
      align="stretch"
      w="100%"
      display={{ base: "none", lg: "flex" }}
    >
      <FilterButtons toggleFilter={toggleFilter} activeFilter={activeFilter} />
      <ExchangerSearch onSearch={() => {}} />
      <SortButtons
        sortCriteria={"name"}
        sortDirection={"asc"}
        toggleSort={() => {}}
      />
    </HStack>
  );
};

export default MassFilters;
