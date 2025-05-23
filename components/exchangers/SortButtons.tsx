import { Button, ButtonGroup, Tooltip } from "@chakra-ui/react";
import { FaSortAlphaDown, FaSortNumericDown } from "react-icons/fa";
import React from "react";

interface SortButtonsProps {
  sortCriteria: "name" | "total_rates" | "admin_rating";
  toggleSort: (criteria: "name" | "total_rates" | "admin_rating") => void;
}

const SortButtons: React.FC<SortButtonsProps> = ({
  sortCriteria,
  toggleSort,
}) => {
  return (
    <ButtonGroup>
      <Tooltip label="Sort by name" fontSize="sm">
        <Button
          bgColor={sortCriteria === "name" ? "bg.600" : "bg.700"}
          onClick={() => toggleSort("name")}
        >
          <FaSortAlphaDown />
        </Button>
      </Tooltip>
      <Tooltip label="Sort by total rates" fontSize="sm">
        <Button
          bgColor={sortCriteria === "total_rates" ? "bg.600" : "bg.700"}
          onClick={() => toggleSort("total_rates")}
        >
          <FaSortNumericDown />
        </Button>
      </Tooltip>
      <Tooltip label="Sort by admin rating" fontSize="sm">
        <Button
          bgColor={sortCriteria === "admin_rating" ? "bg.600" : "bg.700"}
          onClick={() => toggleSort("admin_rating")}
        >
          <FaSortNumericDown />
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
};

export default SortButtons;
