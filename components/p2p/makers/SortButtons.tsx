import { Button, HStack, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { FaArrowDownShortWide, FaArrowUpWideShort } from "react-icons/fa6";
import React from "react";
import { useT } from "../../../services/i18n";

type SortCriteria = "name" | "offers" | "reviews";

interface SortButtonsProps {
  sortCriteria: SortCriteria;
  sortDirection: "asc" | "desc";
  toggleSort: (criteria: SortCriteria) => void;
}

const SortButtons: React.FC<SortButtonsProps> = ({
  sortCriteria,
  sortDirection,
  toggleSort,
}) => {
  const activeBg = useColorModeValue("bg.100", "bg.600");
  const t = useT();

  const getIcon = (criteria: SortCriteria) =>
    sortCriteria === criteria ? (
      sortDirection === "asc" ? (
        <FaArrowDownShortWide />
      ) : (
        <FaArrowUpWideShort />
      )
    ) : undefined;

  const buttons = [
    { key: "name", label: t("Имя", "Name"), tooltip: t("Сортировать по имени", "Sort by name") },
    {
      key: "offers",
      label: t("Предложения", "Offers"),
      tooltip: t("Сортировать по количеству предложений", "Sort by number of offers"),
    },
    {
      key: "reviews",
      label: t("Отзывы", "Reviews"),
      tooltip: t("Сортировать по количеству отзывов", "Sort by number of reviews"),
    },
  ] as const;

  return (
    <HStack
      borderWidth="2px"
      borderRadius="xl"
      borderColor="bg.500"
      spacing={0}
      h="45px"
      w="100%"
      justifyContent="space-between"
    >
      {buttons.map(({ key, label, tooltip }) => (
        <Tooltip openDelay={500} key={key} label={tooltip} fontSize="sm">
          <Button
            bgColor={sortCriteria === key ? activeBg : "transparent"}
            onClick={() => toggleSort(key)}
            rightIcon={getIcon(key)}
            borderRadius="none"
            _first={{ borderTopLeftRadius: "lg", borderBottomLeftRadius: "lg" }}
            _last={{
              borderTopRightRadius: "lg",
              borderBottomRightRadius: "lg",
            }}
          >
            {label}
          </Button>
        </Tooltip>
      ))}
    </HStack>
  );
};

export default SortButtons;
export type { SortCriteria };
