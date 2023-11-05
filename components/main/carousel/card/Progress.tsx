import {
  Box,
  Center,
  HStack,
  Progress,
  useColorModeValue,
  useToken,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setSwiperIdVisible } from "../../../../redux/mainReducer";
import useSmooth from "../../../../services/hooks/smooth";
import { RegularBox } from "../../../../styles/theme/custom";

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
    <RegularBox
      position="relative"
      w={2}
      h={3}
      mx="0.5"
      mt="0 !important"
      borderRadius="sm"

      // outline="1px solid"
      // outlineColor={
      //   selected
      //     ? useColorModeValue("violet.600", "peach.200")
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
            ? useColorModeValue("violet.600", "peach.200")
            : useColorModeValue("bg.300", "bg.400")
        }
      />
    </RegularBox>
  </VStack>
);
const SmoothProgress = () => {
  const dispatch = useAppDispatch();
  const swiperIdVisible = useAppSelector((state) => state.main.swiperIdVisible);
  const dirRates = useAppSelector((state) => state.main.dirRates) || [];
  const ratesLimits = dirRates?.map((r) => [r.min.give, r.max.give]);
  const amountStr = useAppSelector((state) => state.main.amountOutputs.give);
  const amount = +amountStr.replaceAll(",", "");
  //const smoothProgressValue = useSmooth((100 * swiperIdVisible) / ratesLength);

  const color_bg = useColorModeValue("bg.100", "bg.1000");
  const color1 = useColorModeValue("violet.600", "peach.200");
  const color2 = useColorModeValue("bg.10", "bg.500");
  const color3 = useColorModeValue("bg.100", "bg.800");
  const [primary300, secondary600] = useToken("colors", [
    "peach.300",
    "violet.600",
  ]);
  const colorKey = useColorModeValue(secondary600, primary300);
  const length = ratesLimits.length;

  const handleClickDot = (index: number) => dispatch(setSwiperIdVisible(index));

  return (
    <HStack
      justifyContent="center"
      alignItems="end"
      position="absolute"
      left="0"
      bottom="2.5"
      w="100%"
      h="2"
      zIndex="3"
    >
      <HStack bgColor={color_bg} p="1" borderRadius="md">
        {ratesLimits.map(([min, max], index) => (
          <Box
            key={index}
            h="2"
            transform={swiperIdVisible === index ? "scale(1.2)" : "none"}
            boxShadow={
              swiperIdVisible === index ? `0 0 10px -1px ${colorKey}` : "none"
            }
            w={length > 18 ? 1.5 : length > 9 ? 2 : 3}
            cursor="pointer"
            borderRadius="2px"
            bgColor={
              swiperIdVisible === index
                ? color1
                : amount < min || amount > max
                ? color3
                : color2
            }
            onClick={() => handleClickDot(index)}
          />
        ))}
      </HStack>
    </HStack>
  );
};

export default SmoothProgress;
