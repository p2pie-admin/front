import { Box, HStack, Text } from "@chakra-ui/react";
import { kFormatter, roundAmount } from "../../../redux/amountsHelper";
import { CgSync } from "react-icons/cg";

const Limit = ({
  label,
  value,
  pmCurrencyName,
  needMargin,
  changeSide,
}: {
  label: "min" | "max";
  value: number;
  pmCurrencyName: string;
  needMargin?: boolean;
  changeSide: Function;
}) => {
  const ml = needMargin
    ? label === "max"
      ? "20"
      : "-20"
    : label === "max"
    ? "-10"
    : "10";

  return (
    <HStack
      mb="-10"
      onClick={() => changeSide()}
      bgColor={"bg.800"}
      borderRadius="lg"
      ml={ml}
      fontSize="xs"
      px="1"
    >
      <Text
        whiteSpace="nowrap"
        color={"bg.100"}
      >{`${label.toUpperCase()}: ${kFormatter(
        roundAmount(value, true)
      )}`}</Text>
      <Text mx="2px !important" color="orange.200">
        {pmCurrencyName}
      </Text>
      <Box mx="0 !important" color="orange.200">
        <CgSync size="0.8rem" />
      </Box>
    </HStack>
  );
};

export default Limit;
