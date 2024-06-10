import {
  Image,
  Button,
  HStack,
  useColorModeValue,
  Box,
  Text,
} from "@chakra-ui/react";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import Shader from "../shared/Shader";
import { useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { ICurrencyConverterRate } from "../../types/p2p";
import { format, localFormat, R } from "../../redux/amountsHelper";

const Chart = ({ giveCur, getCur }: { giveCur: string; getCur: string }) => {
  const env = process.env.NODE_ENV;
  const SRC =
    env === "production"
      ? process.env.NEXT_PUBLIC_CONVERTER_PROD_URL
      : process.env.NEXT_PUBLIC_CONVERTER_DEV_URL;
  const bgColor = useColorModeValue("violet.900", "bg.900");
  const [isLongTimeFrame, setTimeframe] = useState(true);
  const primaryColor = useColorModeValue("violet.600", "peach.200");
  const ccRates = useAppSelector(
    (state) => state.main.ccRates || ({} as ICurrencyConverterRate)
  );
  const { rate, giveToUSD, getToUSD, dayTrend, hourTrend } = ccRates;
  const trend = isLongTimeFrame ? dayTrend : hourTrend;
  const giveUsdRate =
    giveToUSD < 1
      ? `1 ${giveCur} ~ ${format(1 / giveToUSD, 2)} USD`
      : `1 USD ~ ${format(giveToUSD, 2)} ${giveCur}`;
  const getUsdRate =
    getToUSD < 1
      ? `1 ${getCur} ~ ${format(1 / getToUSD, 2)} USD`
      : `1 USD ~ ${format(getToUSD, 2)} ${getCur}`;
  return (
    <Box3D bgColor={bgColor} overflow="hidden" position="relative">
      <HStack position="absolute" top="0" right="0">
        <Button
          variant="default"
          size="sm"
          onClick={() => setTimeframe(false)}
          color={!isLongTimeFrame ? primaryColor : "whiteAlpha.300"}
        >
          1h
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => setTimeframe(true)}
          color={isLongTimeFrame ? primaryColor : "whiteAlpha.300"}
        >
          24h
        </Button>
      </HStack>
      <Image
        w={400}
        h={180}
        src={`${SRC}/${getCur}_${giveCur}/${isLongTimeFrame ? "day" : "hour"}`}
        alt={`${giveCur} to ${getCur} in last ${
          isLongTimeFrame ? "day" : "hour"
        }`}
      />
      <HStack position="absolute" top="2" left="2" zIndex="35">
        <Text fontSize="md" fontWeight="bold" color={primaryColor}>
          {`${giveCur} / ${getCur}`}
        </Text>
        <Text fontSize="md" color={trend > 0 ? "red.500" : "green.500"}>{`${
          trend > 0 ? "-" : "+"
        } ${format(Math.abs(trend), 3)}% ${trend > 0 ? "▼" : "▲"}`}</Text>
      </HStack>
      <Box
        position="absolute"
        bottom="2"
        right="2"
        zIndex="35"
        bgColor="blackAlpha.500"
        borderRadius="lg"
        px="2"
        py="1"
      >
        <Text fontSize="sm" color="bg.200">
          {giveUsdRate + " | " + getUsdRate}
        </Text>
      </Box>

      <Shader direction="top" />
    </Box3D>
  );
};
//▲▼
export default Chart;
