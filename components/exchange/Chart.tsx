import { memo, useMemo, useState } from "react";
import {
  Box,
  HStack,
  Text,
  Button,
  Center,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import Image from "next/image";

import { useAppSelector } from "../../redux/hooks";
import { Box3D } from "../../styles/theme/custom";
import { format, localFormat, R } from "../../redux/amountsHelper";
import { converterLinkPROD, converterLinkDEV } from "../../services/utils";

const Chart = memo(
  ({ giveCur, getCur }: { giveCur: string; getCur: string }) => {
    const bgColor = useColorModeValue("violet.700", "bg.900");
    const primaryColor = useColorModeValue("bg.100", "peach.300");
    const color = useColorModeValue("bg.200", "bg.500");

    const SRC = useMemo(() => {
      const env = process.env.NODE_ENV;
      return env === "production" ? converterLinkPROD : converterLinkDEV;
    }, []);

    const [isLongTimeFrame, setTimeframe] = useState(false);

    const ccRates = useAppSelector(
      (state) => state.main.ccRates || ({} as any)
    );
    const { currentRate, giveToUSD, getToUSD, dayTrend, hourTrend } = ccRates;

    const trend = isLongTimeFrame ? dayTrend : hourTrend;

    // const giveUsdRate = useMemo(
    //   () =>
    //     giveToUSD < 1
    //       ? `1 ${giveCur} ~ ${format(1 / giveToUSD, 2)} USD`
    //       : `1 USD ~ ${format(giveToUSD, 2)} ${giveCur}`,
    //   [giveCur, giveToUSD]
    // );

    // const getUsdRate = useMemo(
    //   () =>
    //     getToUSD < 1
    //       ? `1 ${getCur} ~ ${format(1 / getToUSD, 2)} USD`
    //       : `1 USD ~ ${format(getToUSD, 2)} ${getCur}`,
    //   [getCur, getToUSD]
    //);

    const alt = `${giveCur} to ${getCur} in last ${
      isLongTimeFrame ? "24h" : "1h"
    }`;

    const imgSrc = `${SRC}/${getCur}_${giveCur}/${
      isLongTimeFrame ? "24h" : "1h"
    }`;

    return (
      <Box3D
        bgColor={bgColor}
        overflow="hidden"
        position="relative"
        w="100%"
        h="200px"
      >
        <Image
          src={imgSrc}
          alt={alt}
          width={420}
          height={200}
          style={{ objectFit: "cover" }}
          // placeholder="blur"
          // blurDataURL="/placeholder.png"
        />
        <HStack position="absolute" top="1" left="1" zIndex="35" px="2">
          <Text fontSize="md" fontWeight="bold" color={primaryColor}>
            {`${giveCur} / ${getCur}`}
          </Text>
          <Text fontSize="md" color={trend > 0 ? "red.500" : "green.500"}>
            {`${trend > 0 ? "-" : "+"} ${format(Math.abs(trend), 3)}% ${
              trend > 0 ? "▼" : "▲"
            }`}
          </Text>
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
              size="xs"
              m="0"
              color={!isLongTimeFrame ? primaryColor : "whiteAlpha.400"}
              onClick={() => setTimeframe(false)}
            >
              1h
            </Button>
            <Button
              variant="default"
              size="xs"
              m="0"
              color={isLongTimeFrame ? primaryColor : "whiteAlpha.400"}
              onClick={() => setTimeframe(true)}
            >
              24h
            </Button>
          </HStack>
        </Box>

        <Box
          py="0.5"
          px="1"
          bgColor="bg.1000"
          filter="opacity(0.9)"
          borderRadius="lg"
          position="absolute"
          bottom={`${100 - trend * 5}px`}
          right="4"
        >
          <Text fontSize="sm" color={color}>
            {`1 ${getCur} ≈ ${format(currentRate, 3)} ${giveCur}`}
          </Text>
        </Box>
      </Box3D>
    );
  }
);

export default Chart;
