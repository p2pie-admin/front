import { Box } from "@chakra-ui/react";
import { useLayoutEffect } from "react";

import useBoundingRect from "../hooks/useBoundingRect";
import SmoothProgress from "../Progress";

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
      <SmoothProgress />
    </Box>
  );
}

export default Carcas;
