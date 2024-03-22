import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Progress,
  Text,
  Slider,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useLayoutEffect, useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import useBoundingRect from "../hooks/useBoundingRect";
import percentage from "../utils/percentage";
import useAnimateNumber from "use-animate-number";
import SmoothProgress from "../Progress";
import LimitsRange from "../../limits";
import {
  decrementSwiper,
  incrementSwiper,
} from "../../../../redux/mainReducer";
import { useAppDispatch } from "../../../../redux/hooks";
import e from "cors";

function Carcas({
  setTrackIsActive,
  initSliderWidth,
  constraint,
  itemWidth,
  positions,
  children,
  gap,
}: {
  setTrackIsActive: Function;
  initSliderWidth: Function;
  constraint: number;
  itemWidth: number;
  positions: number[];
  children: React.ReactChild;
  gap: number;
}) {
  const [ref, { width }] = useBoundingRect();

  useLayoutEffect(
    () => initSliderWidth(Math.round(width)),
    [width, initSliderWidth]
  );

  return (
    <Box position="relative">
      <Box
        ref={ref}
        px={`${gap / 2}px`}
        position="relative"
        overflow="hidden"
        // _before={{
        //   bgGradient: `linear(to-r, ${useColorModeValue(
        //     "bg.10",
        //     "bg.900"
        //   )}, transparent)`,
        //   position: "absolute",
        //   w: `${gap}px`,
        //   content: "''",
        //   zIndex: 1,
        //   h: "100%",
        //   left: 0,
        //   top: 0,
        // }}
        // _after={{
        //   bgGradient: `linear(to-l, ${useColorModeValue(
        //     "bg.10",
        //     "bg.900"
        //   )}, transparent)`,
        //   position: "absolute",
        //   w: `${gap}px`,
        //   content: "''",
        //   zIndex: 1,
        //   h: "100%",
        //   right: 0,
        //   top: 0,
        // }}
      >
        {children}
      </Box>

      <Flex mx="auto">
        <SmoothProgress />
      </Flex>
    </Box>
  );
}

export default Carcas;
