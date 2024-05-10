import React, { useEffect, useCallback } from "react";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import {
  motion,
  useMotionValue,
  useAnimation,
  useTransform,
  MotionValue,
} from "framer-motion";
import {
  Text,
  Box,
  Button,
  HStack,
  Grid,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import Shader from "../../../shared/Shader";
import { Box3D, ResponsiveButton } from "../../../../styles/theme/custom";

import ControlPanel from "./ControlPanel";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import ExchangerCard from "./ExchangerCard";
import { setSwiperIdVisible } from "../../../../redux/mainReducer";

export const ExchangersList = () => {
  const length = useAppSelector((state) => state.main.dirRates?.length) || 0;
  const dispatch = useAppDispatch();
  const itemHeight = useBreakpointValue({ base: 80, md: 100, lg: 120 }) || 80; // Height of each text box
  const visibleItems = 3; // Number of items visible in the container
  const containerHeight = itemHeight * visibleItems;

  const y = useMotionValue(0);
  const controls = useAnimation();
  const getIndex = () => {
    const index = Math.round(
      (-y.get() + (containerHeight / 2 - itemHeight / 2)) / itemHeight
    );

    return Math.min(length - 1, Math.max(0, index));
  };

  const dragConstraints = {
    top:
      -itemHeight * (length - visibleItems) +
      containerHeight / 2 -
      itemHeight * 3,
    bottom: containerHeight / 2,
  };

  const snapToNearest = useCallback(
    (currentY) => {
      const offset = containerHeight / 2 - itemHeight / 2;
      const index = Math.round((-currentY + offset) / itemHeight);
      if (index < 0) return itemHeight;
      if (index >= length) return -itemHeight * (length - 2);
      return -index * itemHeight + offset;
    },
    [containerHeight, itemHeight]
  );

  const move = (y: number) => {
    controls.start({
      y,
      transition: { type: "spring", stiffness: 220, damping: 25 },
    });
  };

  const onDragEnd = () => {
    dispatch(setSwiperIdVisible(getIndex()));
    move(snapToNearest(y.get()));
  };

  const getScaleX = useCallback(
    (itemIndex) => {
      const itemMiddleY = itemIndex * itemHeight + itemHeight / 2;
      const containerMiddle = containerHeight / 2;
      const distanceFromCenter = Math.abs(
        y.get() + itemMiddleY - containerMiddle
      );
      const scaleXRange = 0.02; // Difference in scaleX

      return 1 - scaleXRange * (distanceFromCenter / itemHeight) ** 2;
    },
    [containerHeight, itemHeight, y]
  );
  const getShape = useCallback(
    (itemIndex) => {
      const itemMiddleY = itemIndex * itemHeight + itemHeight / 2;
      const containerMiddle = containerHeight / 2;
      const distanceFromCenter = y.get() + itemMiddleY - containerMiddle;
      const maxRadiusEffect = itemHeight / 2;
      if (
        Math.abs(distanceFromCenter) > maxRadiusEffect &&
        distanceFromCenter < 0
      ) {
        return `${3}% ${3}% ${0}% ${0}% / 100% 100% 0% 0%`;
      } else if (
        Math.abs(distanceFromCenter) > maxRadiusEffect &&
        distanceFromCenter > 0
      ) {
        return `${0}% ${0}% ${3}% ${3}% / 0% 0% 100% 100%`;
      }
      return `${1}% ${1}% ${1}% ${1}% / 50% 50% 50% 50%`;
    },
    [containerHeight, itemHeight, y]
  );
  useEffect(() => {
    const unsubscribe = y.onChange(() => {
      controls.start({
        transition: { staggerChildren: 0.1 },
      });
    });

    return () => unsubscribe();
  }, [y, controls]);

  const renderItem = (index: number) => {
    const scaleX = useTransform(y, () => getScaleX(index));
    const borderRadius = useTransform(y, () => getShape(index));

    return (
      <motion.div
        key={index}
        style={{
          height: `${itemHeight}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius,
          padding: "4px",
          scaleX,
        }}
      >
        <ExchangerCard index={index} />
      </motion.div>
    );
  };

  const scrollToItem = (index: number) => {
    const targetY =
      -(itemHeight * index) + containerHeight / 2 - itemHeight / 2;
    move(targetY);
  };

  const stepDown = () => {
    const currentIndex = getIndex();
    const newIndex = Math.max(currentIndex - 1, 0);
    console.log(newIndex);
    dispatch(setSwiperIdVisible(newIndex));
    scrollToItem(newIndex);
  };

  const stepUp = () => {
    const currentIndex = getIndex();
    const newIndex = Math.min(currentIndex + 1, length - 1);
    console.log(newIndex);
    dispatch(setSwiperIdVisible(newIndex));
    scrollToItem(newIndex);
  };

  const handleWheel = (event: any) => {
    if (event.deltaY < 0) {
      stepDown();
    } else if (event.deltaY > 0) {
      stepUp();
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      stepDown();
    } else if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      stepUp();
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleWheel, handleKeyDown]);

  return (
    <Grid gridTemplateColumns="1fr 40px" gridGap={["2", "4"]}>
      <Box3D
        position="relative"
        overflow="hidden"
        h={`${containerHeight + 34}px`}
        variant="extra_contrast"
        px="2"
      >
        <Box
          h={`${containerHeight + 34}px`}
          bgColor="bg.800"
          px="1"
          py="4"
          borderRadius={`${4}% ${4}% ${4}% ${4}% / 50% 50% 50% 50%`}
        >
          <Shader direction="bottom" />
          <motion.div
            drag="y"
            dragConstraints={dragConstraints}
            style={{ y, width: "100%" }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
            animate={controls}
          >
            {Array.from({ length }).map((_, index) => renderItem(index))}
          </motion.div>

          <Shader direction="top" />
        </Box>
        <Box
          position="absolute"
          right="0"
          top={`calc(${containerHeight / 2}px )`}
          color="bg.600"
          transform="rotate(90deg)"
        >
          <TbTriangleInvertedFilled size="2rem" />
        </Box>
      </Box3D>

      <ControlPanel length={length} stepUp={stepUp} stepDown={stepDown} />
    </Grid>
  );
};

export default ExchangersList;
