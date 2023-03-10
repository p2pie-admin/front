import { Box, Button, Text } from "@chakra-ui/react";
import { ReadableByteStreamController } from "stream/web";

import { useAppSelector } from "../../../redux/hooks";

import { IDirRates, ITop } from "../../../types/rates";
import BottomPanel from "./BottomPanel";
import ExchangerCard from "./card";
import Swiper from "./swiper";

const CarouselSwiper = ({ data }: { data: { tops: ITop[] } }) => {
  // const uniqueRates = useAppSelector(
  //   (state) => state.main.dirParserResp?.uniqueRates
  // );
  // const bestRates = useAppSelector(
  //   (state) => state.main.dirParserResp?.bestRates
  // );

  const rates = useAppSelector((state) => ({
    ...(state.main.dirParserResp?.bestRates || {}),
  }));

  console.log(rates);

  return (
    <Box minH="144">
      {rates && (
        <Swiper gap={12}>
          {Object.entries(rates).map(([exchangerId, rate], index) => {
            const tops = data?.tops.filter((t) =>
              rate?.tags?.find((tag) => tag === t.code)
            );
            return (
              <ExchangerCard
                key={exchangerId + index}
                rate={rate}
                exchangerId={exchangerId}
                tops={tops}
              />
            );
          })}
        </Swiper>
      )}

      <BottomPanel />
    </Box>
  );
};

export default CarouselSwiper;
