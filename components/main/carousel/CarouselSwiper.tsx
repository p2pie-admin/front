import { Box } from "@chakra-ui/react";
import { useAppSelector } from "../../../redux/hooks";
import { DirRates, ITop } from "../../../types/rates";
import Swiper from "./swiper";
import Top from "./Top";

const CarouselSwiper = ({ data }: { data: { tops: ITop[] } }) => {
  const uniqueRates = useAppSelector(
    (state) => state.main.dirTops?.uniqueRates
  ) as { [key: string]: DirRates };

  return (
    <Swiper gap={12}>
      {Object.entries(uniqueRates).map(([code, dirTops], index) => {
        const top = data?.tops.find((t) => t.code === code);
        const [exchangerId, rate] = Object.entries(dirTops)[0];
        if (!top) return;
        return <Top key={`${top.code}${index}`} top={top} rate={rate} />;
      })}
    </Swiper>
  );
};

export default CarouselSwiper;
