import React, { useEffect, useCallback, useState, useMemo } from "react";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import { Box, Grid, useColorModeValue } from "@chakra-ui/react";
import Shader from "../../shared/Shader";
import { Box3D } from "../../../styles/theme/custom";
import ControlPanel from "./ControlPanel";
import { useAppDispatch } from "../../../redux/hooks";
import { setSwiperIdVisible } from "../../../redux/mainReducer";
import { IRate } from "../../../types/rates";
import Item from "./Item";
import debounce from "./utils/debounce";

export const Swiper = (props: {
  isMobile: boolean;
  itemHeight: number;
  visibleItems: number;
  containerHeight: number;
  dirRates: IRate[];
}) => {
  const { isMobile, itemHeight, visibleItems, containerHeight, dirRates } =
    props;
  const length = dirRates.length;
  const dispatch = useAppDispatch();
  const bgColor = useColorModeValue("bg.50", "bg.800");
  const triangleColor = useColorModeValue("bg.100", "bg.600");
  const [mouseEntered, setMouseEntered] = useState(false);

  const y = useMotionValue(0);
  const controls = useAnimation();

  const getIndex = () => {
    const index = Math.round(
      (-y.get() + (containerHeight / 2 - itemHeight / 2)) / itemHeight
    );
    return Math.min(length - 1, Math.max(0, index));
  };

  const snapToNearest = useCallback(
    (currentY) => {
      const offset = containerHeight / 2 - itemHeight / 2;
      const index = Math.round((-currentY + offset) / itemHeight);
      if (index <= 0) return itemHeight;
      if (index >= length) return -itemHeight * (length - 2);
      return -index * itemHeight + offset;
    },
    [containerHeight, itemHeight]
  );

  const move = (y: number) => {
    controls.start({
      y,
      transition: { type: "spring", stiffness: 700, damping: 36 },
    });
  };

  const debouncedSetSwiperIdVisible = useMemo(
    () =>
      debounce(300, (index: number) => {
        dispatch(setSwiperIdVisible(index));
      }),
    [dispatch]
  );

  const stepDown = () => {
    const currentIndex = getIndex();
    const newIndex = Math.max(currentIndex - 1, 0);
    debouncedSetSwiperIdVisible(newIndex);
    scrollToItem(newIndex);
  };

  const stepUp = () => {
    const currentIndex = getIndex();
    const newIndex = Math.min(currentIndex + 1, length - 1);
    debouncedSetSwiperIdVisible(newIndex);
    scrollToItem(newIndex);
  };

  const handleWheel = (event: any) => {
    if (isMobile || !mouseEntered) return;
    if (event.deltaY < 0) {
      stepDown();
    } else if (event.deltaY > 0) {
      stepUp();
    }
  };

  const handleKeyDown = (event: any) => {
    if (isMobile) return;
    if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      stepDown();
    } else if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      stepUp();
    }
  };

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleWheel, handleKeyDown]);

  const scrollToItem = (index: number) => {
    const targetY =
      -(itemHeight * index) + containerHeight / 2 - itemHeight / 2;
    move(targetY);
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    setMouseEntered(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "0px";
    setMouseEntered(false);
  };
  if (!length) return <></>;
  return (
    <Grid gridTemplateColumns="1fr auto" gridGap={["2", "4"]} h="100%">
      <Box3D variant="extra_contrast" px="2">
        <Box
          position="relative"
          overflow="hidden"
          h={`${containerHeight + 34}px`}
          bgColor={bgColor}
          px="1"
          py="4"
          borderRadius={`${4}% ${4}% ${4}% ${4}% / 50% 50% 50% 50%`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Shader direction="top" />
          <motion.div
            drag="y"
            dragConstraints={{
              top:
                -itemHeight * (length - visibleItems) +
                containerHeight / 2 -
                itemHeight * 3,
              bottom: containerHeight / 2,
            }}
            style={{ y, width: "100%" }}
            dragElastic={0.2}
            onDragEnd={() => {
              debouncedSetSwiperIdVisible(getIndex());
              move(snapToNearest(y.get()));
            }}
            animate={controls}
          >
            {dirRates.map((rate, index) => (
              <Item
                key={rate.exchangerId + index}
                rate={rate}
                y={y}
                index={index}
                itemHeight={itemHeight}
                containerHeight={containerHeight}
              />
            ))}
          </motion.div>
          <Shader direction="bottom" />
        </Box>
        <Box
          position="absolute"
          right="0"
          top={`calc(${containerHeight / 2}px + 0.5rem)`}
          color={triangleColor}
          transform="rotate(90deg)"
        >
          <TbTriangleInvertedFilled size="1.2rem" />
        </Box>
      </Box3D>
      <ControlPanel length={length} stepUp={stepUp} stepDown={stepDown} />
    </Grid>
  );
};

export default Swiper;
