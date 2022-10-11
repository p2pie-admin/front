import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Progress,
  IconButton,
} from "@chakra-ui/react";
import { useLayoutEffect } from "react";
import { ChevronRight } from "@styled-icons/boxicons-regular/ChevronRight";
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

  const handleDecrementClick = () => {
    !(swiperIdVisible === positions.length - positions.length) &&
      handleSwiperIdVisible(swiperIdVisible - 1);
  };

  const handleIncrementClick = () => {
    !(swiperIdVisible === positions.length - constraint) &&
      handleSwiperIdVisible(swiperIdVisible + 1);
  };

  const handleGoToEnd = () => {
    handleSwiperIdVisible(positions.length - 1);
  };

  const handleGoToStart = () => {
    handleSwiperIdVisible(0);
  };

  const SwiperButton = ({ isLeft = false }: { isLeft?: boolean }) => (
    <Button
      key={isLeft ? "leftSwiperButton" : "rightSwiperButton"}
      position={{
        base: "relative",
        md: "absolute",
      }}
      left={{
        base: "0",
        md: isLeft ? "-14" : "auto",
      }}
      right={{
        base: "0",
        md: isLeft ? "auto" : "-14",
      }}
      mx="2"
      top="42%"
      onClick={
        isLeft
          ? !swiperIdVisible
            ? handleGoToEnd
            : handleDecrementClick
          : swiperIdVisible === positions.length - 1
          ? handleGoToStart
          : handleIncrementClick
      }
      color="gray.200"
      p="1"
      borderRadius="50%"
      bgColor="bg.700"
      transform={isLeft ? "rotate(180deg)" : "none"}
    >
      <ChevronRight boxSize={9} />
    </Button>
  );

  return (
    <Box position="relative">
      <Box
        mt="3"
        w="100%"
        ref={ref}
        py="2"
        px={`${gap / 2}px`}
        position="relative"
        overflow="hidden"
        _before={{
          bgGradient: "linear(to-r, bg.800, transparent)",
          position: "absolute",
          w: `${gap / 1.5}px`,
          content: "''",
          zIndex: 1,
          h: "100%",
          left: 0,
          top: 0,
        }}
        _after={{
          bgGradient: "linear(to-l, bg.800, transparent)",
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
        <SwiperButton isLeft />

        <Progress
          value={percentage(swiperIdVisible, positions.length - constraint)}
          alignSelf="center"
          borderRadius="2"
          bg={useColorModeValue("bg.100", "bg.700")}
          flex={1}
          h="3px"
          sx={{
            "> div": {
              backgroundColor: useColorModeValue("primary.400", "orange.400"),
            },
          }}
        />

        <SwiperButton />
      </Flex>
    </Box>
  );
}

export default Slider;
