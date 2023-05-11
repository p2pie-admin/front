import {
  Box,
  Center,
  HStack,
  Progress,
  useColorModeValue,
  VStack,
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
  <VStack cursor="pointer" onClick={() => handleClickDot()}>
    <Box
      position="relative"
      w={2}
      h={3}
      mx="0.5"
      mt="0 !important"
      borderRadius="sm"
      bgColor={useColorModeValue("bg.100", "bg.800")}
      // outline="1px solid"
      // outlineColor={
      //   selected
      //     ? useColorModeValue("secondary.600", "primary.200")
      //     : useColorModeValue("bg.200", "bg.600")
      // }
    >
      <Box
        position="absolute"
        bottom="0"
        w={2}
        h={2 + h + "px"}
        borderRadius="sm"
        bgColor={
          selected
            ? useColorModeValue("secondary.600", "primary.200")
            : useColorModeValue("bg.300", "bg.400")
        }
      />
    </Box>
  </VStack>
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
  const step = (maxCourse - minCourse) / 8;

  const handleClickDot = (index: number) => dispatch(setSwiperIdVisible(index));

  return (
    <HStack
      justifyContent="center"
      alignItems="end"
      position="absolute"
      left="0"
      bottom="-1"
      w="100%"
      h="2"
      zIndex="3"
    >
      <HStack
        bgColor={useColorModeValue("bg.10", "bg.1000")}
        p="1"
        borderRadius="md"
      >
        {ratesCourses.map((course, index) => (
          <Dot
            key={index}
            h={+((maxCourse - course) / step).toFixed(0)}
            selected={index === swiperIdVisible}
            handleClickDot={() => handleClickDot(index)}
          />
        ))}
      </HStack>
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
    //       backgroundColor: useColorModeValue("primary.400", "pink00"),
    //     },
    //   }}
    // />
  );
};

export default SmoothProgress;
