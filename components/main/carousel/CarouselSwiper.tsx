import { Box } from "@chakra-ui/react";
import { ReadableByteStreamController } from "stream/web";

import { useAppSelector } from "../../../redux/hooks";

import { IDirRates, ITop } from "../../../types/rates";
import ExchangerCard from "./card";
import Swiper from "./swiper";

const CarouselSwiper = ({ data }: { data: { tops: ITop[] } }) => {
  const uniqueRates = useAppSelector(
    (state) => state.main.dirParserResp?.uniqueRates
  );
  const bestRates = useAppSelector(
    (state) => state.main.dirParserResp?.bestRates
  );

  return (
    <Box minH="240">
      {bestRates && uniqueRates && (
        <Swiper gap={12}>
          {Object.entries(uniqueRates).map(([exchangerId, rate], index) => {
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
    </Box>
  );
};

export default CarouselSwiper;
