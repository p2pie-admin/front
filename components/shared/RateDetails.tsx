import { CustomBox3D } from "../../styles/theme/wrappers";
import { IRate } from "../../types/rates";
import { Text } from "@chakra-ui/react";
import { roundAmount } from "../../redux/amountsHelper";
import { useAppSelector } from "../../redux/hooks";

const RateDetails = () => {
  const rate = useAppSelector(
    (state) => state.main.dirRates?.[state.main.swiperIdVisible]
  );

  //   const renderCourse = () =>  <Text>{`1 ${giveCurrency} = ${} ${getCurrency}`}</Text>
  if (!rate) return <></>;
  return (
    <CustomBox3D>
      <Text>{roundAmount(rate.course)}</Text>
    </CustomBox3D>
  );
};

export default RateDetails;
