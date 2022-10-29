import { Box } from "@chakra-ui/react";
import { ReadableByteStreamController } from "stream/web";

import { useAppSelector } from "../../../redux/hooks";

import { DirRates, ITop } from "../../../types/rates";
import Swiper from "./swiper";
import Top from "./Top";

const CarouselSwiper = ({ data }: { data: { tops: ITop[] } }) => {
  const uniqueRates = useAppSelector(
    (state) => state.main.dirTops?.uniqueRates
  );
  const bestRates = useAppSelector((state) => state.main.dirTops?.bestRates);

  return (
    <>
      {bestRates && uniqueRates && (
        <Swiper gap={12}>
          {Object.entries(uniqueRates).map(([code, dirRates], index) => {
            const top = data?.tops.find((t) => t.code === code);
            if (!top) return;

            const [exchangerId, rate] = Object.entries(dirRates)[0];
            return <Top key={`${top.code}${index}`} top={top} rate={rate} />;
          })}
        </Swiper>
      )}
    </>
  );
};

export default CarouselSwiper;
