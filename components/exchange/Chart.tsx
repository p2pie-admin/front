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

const fallbackSRC = "https://i.ibb.co/fpSb8gZ/fallback.png";

const Chart = ({ giveCur, getCur }: { giveCur: string; getCur: string }) => {
  const color = useColorModeValue("bg.200", "bg.500");
  const bgColor = useColorModeValue("violet.600", "bg.900");
  const env = process.env.NODE_ENV;
  const SRC =
    env === "production"
      ? process.env.NEXT_PUBLIC_CONVERTER_PROD_URL
      : process.env.NEXT_PUBLIC_CONVERTER_DEV_URL;

  const [isLongTimeFrame, setTimeframe] = useState(true);
  const primaryColor = useColorModeValue("bg.100", "peach.200");
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
      <Image
        w={400}
        h={164}
        objectFit="cover"
        fallbackSrc={fallbackSRC}
        src={`${SRC}/${getCur}_${giveCur}/${isLongTimeFrame ? "day" : "hour"}`}
        alt={`${giveCur} to ${getCur} in last ${
          isLongTimeFrame ? "day" : "hour"
        }`}
      />
      <HStack position="absolute" top="1" left="1" zIndex="35" px="2">
        <Text fontSize="md" fontWeight="bold" color={primaryColor}>
          {`${giveCur} / ${getCur}`}
        </Text>
        <Text fontSize="md" color={trend > 0 ? "red.500" : "green.500"}>{`${
          trend > 0 ? "-" : "+"
        } ${format(Math.abs(trend), 3)}% ${trend > 0 ? "▼" : "▲"}`}</Text>
      </HStack>
      <Box
        position="absolute"
        top="0"
        right="0"
        zIndex="35"
        borderRadius="lg"
        px="2"
      >
        <HStack>
          <Button
            variant="default"
            m="0"
            size="xs"
            onClick={() => setTimeframe(false)}
            color={!isLongTimeFrame ? primaryColor : "whiteAlpha.400"}
          >
            1h
          </Button>
          <Button
            variant="default"
            size="xs"
            m="0"
            onClick={() => setTimeframe(true)}
            color={isLongTimeFrame ? primaryColor : "whiteAlpha.400"}
          >
            24h
          </Button>
        </HStack>
      </Box>
      <Text fontSize="sm" color={color} position="absolute" bottom="1" left="1">
        {giveUsdRate + " | " + getUsdRate}
      </Text>
    </Box3D>
  );
};
//▲▼
export default Chart;
