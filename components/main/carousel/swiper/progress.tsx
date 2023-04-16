import {
  Box,
  Center,
  HStack,
  Progress,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setSwiperIdVisible } from "../../../../redux/mainReducer";
import useSmooth from "../../../../services/hooks/smooth";

const Dot = ({
  selected = false,
  h,
  handleClickDot,
}: {
  selected?: boolean;
  h: number;
  handleClickDot: Function;
}) => (
  <Center cursor="pointer" px="0.5" onClick={() => handleClickDot()}>
    <Box
      w={1}
      h={h + "px"}
      borderRadius="sm"
      bgColor={selected ? "orange.200" : "bg.800"}
    />
  </Center>
);
const SmoothProgress = () => {
  const dispatch = useAppDispatch();
  const swiperIdVisible = useAppSelector((state) => state.main.swiperIdVisible);
  const ratesCourses =
    useAppSelector((state) => state.main.dirRates?.map((r) => r.course)) || [];
  //const smoothProgressValue = useSmooth((100 * swiperIdVisible) / ratesLength);
  const ratesLength = ratesCourses.length;
  const [minCourse, maxCourse] = [
    Math.min(...ratesCourses),
    Math.max(...ratesCourses),
  ];
  const step = (maxCourse - minCourse) / 5;

  console.log("step", step);
  console.log("minCourse", minCourse);
  console.log("maxCourse", maxCourse);
  console.log("formula", +(maxCourse / step).toFixed(0));

  const handleClickDot = (index: number) => dispatch(setSwiperIdVisible(index));

  return (
    <HStack
      justifyContent="center"
      position="absolute"
      left="0"
      bottom="2"
      w="100%"
      h="2"
      zIndex="3"
    >
      {ratesCourses.map((course, index) => (
        <Dot
          h={8 + +((maxCourse - course) / step).toFixed(0)}
          selected={index === swiperIdVisible}
          handleClickDot={() => handleClickDot(index)}
        />
      ))}
    </HStack>
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
