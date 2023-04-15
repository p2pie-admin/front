import { Box, Center, Progress, useColorModeValue } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setSwiperIdVisible } from "../../../../redux/mainReducer";
import useSmooth from "../../../../services/hooks/smooth";

const Dot = ({
  big = false,
  handleClickDot,
}: {
  big?: boolean;
  handleClickDot: Function;
}) => (
  <Center cursor="pointer" p="1" onClick={() => handleClickDot()}>
    <Box
      w={big ? "2" : "1"}
      h={big ? "2" : "1"}
      borderRadius="50%"
      bgColor={big ? "orange.200" : "bg.600"}
    />
  </Center>
);
const SmoothProgress = () => {
  const dispatch = useAppDispatch();
  const swiperIdVisible = useAppSelector((state) => state.main.swiperIdVisible);
  const ratesLength =
    useAppSelector((state) => state.main.dirRates?.length) || 1;
  //const smoothProgressValue = useSmooth((100 * swiperIdVisible) / ratesLength);
  const dots = Array.from(Array(ratesLength).keys());
  const handleClickDot = (id) => dispatch(setSwiperIdVisible(id));

  return (
    <Center position="absolute" left="0" bottom="2" w="100%" h="2" zIndex="3">
      {dots.map((dot, index) => (
        <Dot
          big={index === swiperIdVisible}
          handleClickDot={() => handleClickDot(index)}
        />
      ))}
    </Center>
    // <Progress
    //   transition="width 0.3s ease"
    //   value={smoothProgressValue}
    //   alignSelf="center"
    //   bg={useColorModeValue("bg.100", "bg.700")}
    //   flex={1}
    //   h="1px"
    //   sx={{
    //     "> div": {
    //       backgroundColor: useColorModeValue("primary.400", "orange.400"),
    //     },
    //   }}
    // />
  );
};

export default SmoothProgress;
