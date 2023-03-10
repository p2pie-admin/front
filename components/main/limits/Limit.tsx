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
  changeSide,
}: {
  label: string;
  value: number;
  pmCurrencyName: string;
  needMargin?: boolean;
  changeSide: Function;
}) => {
  return (
    <Box borderRadius="lg" mb="-10" onClick={() => changeSide()}>
      <Text
        bgColor="bg.600"
        borderRadius="lg"
        boxShadow="lg"
        whiteSpace="nowrap"
        fontSize="xs"
        color="bg.100"
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
