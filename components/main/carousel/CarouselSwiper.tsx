import { DirRates, ITop } from "../../../types/rates";
import Swiper from "./swiper";
import Top from "./Top";

const CarouselSwiper = ({
  uniqueRates,
  data,
}: {
  uniqueRates: { [key: string]: DirRates };
  data: { tops: ITop[] };
}) => {
  return <Swiper gap={12}></Swiper>;
};

export default CarouselSwiper;
