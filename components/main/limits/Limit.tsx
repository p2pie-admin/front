import { Box, Text } from "@chakra-ui/react";
import { roundAmount } from "../../../redux/amountsHelper";

const kFormatter = (num: number) => {
  return Math.abs(num) > 999999999
    ? "-"
    : Math.abs(num) > 999999
    ? Math.sign(num) * +(Math.abs(num) / 1000000).toFixed(1) + "m"
    : Math.abs(num) > 999
    ? Math.sign(num) * +(Math.abs(num) / 1000).toFixed(1) + "k"
    : Math.sign(num) * Math.abs(num);
};

const Limit = ({
  label,
  value,
  pmCurrencyName,
  needMargin,
}: {
  label: string;
  value: number;
  pmCurrencyName: string;
  needMargin?: boolean;
}) => {
  return (
    <Box borderRadius="lg" mb="-8">
      <Text
        bgColor="bg.800"
        whiteSpace="nowrap"
        fontSize="xs"
        color="bg.400"
        ml={needMargin && label == "max" ? 12 : 0}
        mr={needMargin && label == "min" ? 12 : 0}
        px="1"
      >{`${label.toUpperCase()}: ${kFormatter(
        roundAmount(value, true)
      )} ${pmCurrencyName}`}</Text>
    </Box>
  );
};

export default Limit;
