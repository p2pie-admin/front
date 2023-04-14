import { Progress, useColorModeValue } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAppSelector } from "../../../../redux/hooks";
import useSmooth from "../../../../services/hooks/smooth";

const SmoothProgress = () => {
  const swiperIdVisible = useAppSelector((state) => state.main.swiperIdVisible);
  const ratesLength =
    useAppSelector((state) => state.main.dirRates?.length) || 1;
  const smoothProgressValue = useSmooth((100 * swiperIdVisible) / ratesLength);
  return (
    <Progress
      transition="width 0.3s ease"
      value={smoothProgressValue}
      alignSelf="center"
      bg={useColorModeValue("bg.100", "bg.700")}
      flex={1}
      h="1px"
      sx={{
        "> div": {
          backgroundColor: useColorModeValue("primary.400", "orange.400"),
        },
      }}
    />
  );
};

export default SmoothProgress;
