import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Progress,
} from "@chakra-ui/react";
import { useLayoutEffect } from "react";
import { ChevronLeft, ChevronRight } from "styled-icons/bootstrap";
import useBoundingRect from "../hooks/useBoundingRect";
import percentage from "../utils/percentage";

function Slider({
  setTrackIsActive,
  initSliderWidth,
  handleSwiperIdVisible,
  swiperIdVisible,
  constraint,
  itemWidth,
  positions,
  children,
  gap,
}: {
  setTrackIsActive: Function;
  initSliderWidth: Function;
  handleSwiperIdVisible: Function;
  swiperIdVisible: number;
  constraint: number;
  itemWidth: number;
  positions: number[];
  children: React.ReactChild;
  gap: number;
}) {
  const [ref, { width }] = useBoundingRect();

  useLayoutEffect(() => initSliderWidth(Math.round(width)), [
    width,
    initSliderWidth,
  ]);

  const handleFocus = () => {
    setTrackIsActive(true);
  };

  const handleDecrementClick = () => {
    setTrackIsActive(true);
    !(swiperIdVisible === positions.length - positions.length) &&
      handleSwiperIdVisible(swiperIdVisible - 1);
  };

  const handleIncrementClick = () => {
    setTrackIsActive(true);
    !(swiperIdVisible === positions.length - constraint) &&
      handleSwiperIdVisible(swiperIdVisible + 1);
  };

  const handleGoToEnd = () => {
    setTrackIsActive(true);
    handleSwiperIdVisible(positions.length - 1);
  };

  const handleGoToStart = () => {
    setTrackIsActive(true);
    handleSwiperIdVisible(0);
  };

  return (
    <>
      <Box
        mt="3"
        w="100%"
        ref={ref}
        py="2"
        px={`${gap / 2}px`}
        position="relative"
        overflow="hidden"
        _before={{
          bgGradient: "linear(to-r, bg.700, transparent)",
          position: "absolute",
          w: `${gap / 1.5}px`,
          content: "''",
          zIndex: 1,
          h: "100%",
          left: 0,
          top: 0,
        }}
        _after={{
          bgGradient: "linear(to-l, bg.700, transparent)",
          position: "absolute",
          w: `${gap / 1.5}px`,
          content: "''",
          zIndex: 1,
          h: "100%",
          right: 0,
          top: 0,
        }}
      >
        {children}
      </Box>

      <Flex w={`${itemWidth}px`} mt={`${gap / 2}px`} mx="auto">
        <Button
          onClick={!swiperIdVisible ? handleGoToEnd : handleDecrementClick}
          onFocus={handleFocus}
          color="gray.200"
          variant="link"
          minW={8}
          p="1"
          borderRadius="2xl"
          bgGradient={useColorModeValue(
            "linear(to-br, primary.400, primary.500)",
            "linear(to-br, bg.700, bg.800)"
          )}
        >
          <ChevronLeft boxSize={9} color="bg.300" />
        </Button>

        <Progress
          value={percentage(swiperIdVisible, positions.length - constraint)}
          alignSelf="center"
          m="1"
          borderRadius="2"
          bg={useColorModeValue("bg.100", "bg.500")}
          flex={1}
          h="3px"
          sx={{
            "> div": {
              backgroundColor: useColorModeValue("primary.400", "primary.200"),
            },
          }}
        />

        <Button
          onClick={
            swiperIdVisible === positions.length - 1
              ? handleGoToStart
              : handleIncrementClick
          }
          onFocus={handleFocus}
          color="gray.200"
          variant="link"
          minW={8}
          p="1"
          borderRadius="2xl"
          bgGradient={useColorModeValue(
            "linear(to-br, primary.400, primary.500)",
            "linear(to-br, bg.700, bg.800)"
          )}
        >
          <ChevronRight boxSize={9} color="bg.300" />
        </Button>
      </Flex>
    </>
  );
}

export default Slider;
