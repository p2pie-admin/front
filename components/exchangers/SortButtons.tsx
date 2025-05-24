import { Button, ButtonGroup, HStack, Tooltip } from "@chakra-ui/react";
import { FaArrowUpWideShort, FaArrowDownShortWide } from "react-icons/fa6";
import React from "react";

interface SortButtonsProps {
  sortCriteria: "name" | "total_rates" | "admin_rating";
  sortDirection: "asc" | "desc";
  toggleSort: (criteria: "name" | "total_rates" | "admin_rating") => void;
}

const SortButtons: React.FC<SortButtonsProps> = ({
  sortCriteria,
  sortDirection,
  toggleSort,
}) => {
  const getIcon = (criteria: SortButtonsProps["sortCriteria"]) => {
    if (sortCriteria !== criteria) return <></>;
    return sortDirection === "asc" ? (
      <FaArrowDownShortWide />
    ) : (
      <FaArrowUpWideShort />
    );
  };

  return (
    <HStack borderWidth="2px" borderRadius="xl" borderColor="bg.500" gap="0">
      <Tooltip label="Sort by name" fontSize="sm">
        <Button
          bgColor={sortCriteria === "name" ? "bg.700" : "transparent"}
          onClick={() => toggleSort("name")}
          rightIcon={getIcon("name")}
        >
          Name
        </Button>
      </Tooltip>
      <Tooltip label="Sort by total rates" fontSize="sm">
        <Button
          bgColor={sortCriteria === "total_rates" ? "bg.700" : "transparent"}
          onClick={() => toggleSort("total_rates")}
          rightIcon={getIcon("total_rates")}
        >
          Rates
        </Button>
      </Tooltip>
      <Tooltip label="Sort by admin rating" fontSize="sm">
        <Button
          bgColor={sortCriteria === "admin_rating" ? "bg.700" : "transparent"}
          onClick={() => toggleSort("admin_rating")}
          rightIcon={getIcon("admin_rating")}
        >
          Rating
        </Button>
      </Tooltip>
    </HStack>
  );
};

export default SortButtons;
