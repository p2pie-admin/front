import {
  Image,
  Button,
  HStack,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import Shader from "../shared/Shader";
import { useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { ICurrencyConverterRate } from "../../types/p2p";
import { localFormat } from "../../redux/amountsHelper";

const Chart = ({ giveCur, getCur }: { giveCur: string; getCur: string }) => {
  const env = process.env.NODE_ENV;
  const SRC =
    env === "production"
      ? process.env.NEXT_PUBLIC_CONVERTER_DEV_URL
      : process.env.NEXT_PUBLIC_CONVERTER_PROD_URL;

  const [isLongTimeFrame, setTimeframe] = useState(false);
  const primaryColor = useColorModeValue("violet.600", "peach.200");
  const ccRates = useAppSelector(
    (state) => state.main.ccRates || ({} as ICurrencyConverterRate)
  );
  const { rate, giveToUSD, getToUSD, dayTrend, hourTrend } = ccRates;
  const trend = isLongTimeFrame ? dayTrend : hourTrend;

  return (
    <Box3D variant="extra_contrast" overflow="hidden" position="relative">
      <HStack position="absolute" top="2" right="2">
        <Button
          variant="default"
          size="sm"
          onClick={() => setTimeframe(false)}
          color={!isLongTimeFrame ? primaryColor : "bg.500"}
        >
          1h
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => setTimeframe(true)}
          color={isLongTimeFrame ? primaryColor : "bg.500"}
        >
          24h
        </Button>
      </HStack>
      <Image
        w={400}
        h={180}
        src={`${SRC}/${giveCur}_${getCur}/${isLongTimeFrame ? "day" : "hour"}`}
        alt={`${giveCur} to ${getCur} in last ${
          isLongTimeFrame ? "day" : "hour"
        }`}
      />
      <Box position="absolute" bottom="2" left="2">
        <ResponsiveText size="xs">{`${giveCur} ~ ${localFormat(
          1 / giveToUSD,
          "USD"
        )}`}</ResponsiveText>
        <ResponsiveText size="xs">{`${getCur} ~ ${localFormat(
          1 / getToUSD,
          "USD"
        )}`}</ResponsiveText>
      </Box>

      <Box position="absolute" bottom="2" right="2">
        <ResponsiveText
          size="md"
          color={trend > 0 ? "green.500" : "red.500"}
        >{`${trend > 0 ? "+" : "-"} ${trend}% ${
          trend > 0 ? "▲" : "▼"
        }`}</ResponsiveText>
      </Box>
      <Shader direction="bottom" />
    </Box3D>
  );
};
//▲▼
export default Chart;
