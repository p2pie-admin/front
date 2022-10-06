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
  return (
    <Swiper gap={12}>
      {Object.entries(uniqueRates).map(([code, dirTops], index) => {
        const top = data?.tops.find((t) => t.code === code);
        const [exchangerId, rate] = Object.entries(dirTops)[0];
        if (!top) return;
        return <Top top={top} rate={rate} />;
      })}
    </Swiper>
  );
};

export default CarouselSwiper;
