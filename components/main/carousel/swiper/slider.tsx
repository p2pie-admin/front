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

  const SwiperButton = ({ isLeft = false }: { isLeft?: boolean }) => (
    <Button
      onClick={!swiperIdVisible ? handleGoToEnd : handleDecrementClick}
      onFocus={handleFocus}
      color="gray.200"
      p="1"
      borderRadius="50%"
      variant="primary_shaded"
      transform={isLeft ? "rotate(180deg)" : "none"}
    >
      <ChevronRight boxSize={9} />
    </Button>
  );

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
        <SwiperButton isLeft />

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

        <SwiperButton />
      </Flex>
    </>
  );
}

export default Slider;
