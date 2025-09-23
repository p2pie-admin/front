import { Button, HStack, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { FaArrowUpWideShort, FaArrowDownShortWide } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

interface SortButtonsProps {
  sortCriteria: "min" | "course" | "admin_rating";
  sortDirection: "asc" | "desc";
  toggleSort: (criteria: "min" | "course" | "admin_rating") => void;
}

const MassSortButtons: React.FC<SortButtonsProps> = ({
  sortCriteria,
  sortDirection,
  toggleSort,
}) => {
  const { t } = useTranslation();
  const activeBg = useColorModeValue("bg.100", "bg.600");

  const getIcon = (criteria: SortButtonsProps["sortCriteria"]) =>
    sortCriteria === criteria ? (
      sortDirection === "asc" ? (
        <FaArrowDownShortWide />
      ) : (
        <FaArrowUpWideShort />
      )
    ) : undefined; // ✅ instead of `null`

  const buttons = [
    {
      key: "course",
      label: t("Course"),
      tooltip: t("Sort by course"),
    },
    { key: "min", label: t("Min"), tooltip: t("Sort by min amount") },

    {
      key: "admin_rating",
      label: t("Rating"),
      tooltip: t("Sort by admin rating"),
    },
  ] as const;

  return (
    <HStack
      borderWidth="2px"
      borderRadius="xl"
      borderColor="bg.500"
      spacing={0}
      h="45px"
    >
      {buttons.map(({ key, label, tooltip }) => (
        <Tooltip key={key} label={tooltip} fontSize="sm">
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

export default MassSortButtons;
