import React, { useEffect, useCallback, useState } from "react";
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
import Item from "./item";
import ErrorWrapper from "../../../shared/ErrorWrapper";
import { useIsMobile } from "./hooks";

export const ExchangersList = ({ length }: { length: number }) => {
  const dispatch = useAppDispatch();
  const dirRatesStatus = useAppSelector((state) => state.main.dirRatesStatus);
  const [mouseEntered, setMouseEntered] = useState(false);
  const isMobile = useIsMobile();
  const itemHeight = isMobile ? 80 : 120; // Height of each text box
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

  useEffect(() => {
    const unsubscribe = y.onChange(() => {
      controls.start({
        transition: { staggerChildren: 0.1 },
      });
    });

    return () => unsubscribe();
  }, [y, controls]);

  const scrollToItem = (index: number) => {
    const targetY =
      -(itemHeight * index) + containerHeight / 2 - itemHeight / 2;
    move(targetY);
  };

  const stepDown = () => {
    const currentIndex = getIndex();
    const newIndex = Math.max(currentIndex - 1, 0);

    dispatch(setSwiperIdVisible(newIndex));
    scrollToItem(newIndex);
  };

  const stepUp = () => {
    const currentIndex = getIndex();
    const newIndex = Math.min(currentIndex + 1, length - 1);

    dispatch(setSwiperIdVisible(newIndex));
    scrollToItem(newIndex);
  };

  const handleWheel = (event: any) => {
    if (isMobile) return;
    if (!mouseEntered) return;
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

  return (
    <Grid
      gridTemplateColumns="1fr auto"
      gridGap={["2", "4"]}
      transition="width .3s ease"
    >
      <Box3D
        position="relative"
        overflow="hidden"
        h={`${containerHeight + 34}px`}
        variant="extra_contrast"
        px="2"
      >
        <ErrorWrapper
          isError={dirRatesStatus === "rejected"}
          isLoading={length === 0 || dirRatesStatus === "pending"}
          primaryMessage="No rates available!"
          secondaryMessage="check your network connection"
        >
          <Box
            h={`${containerHeight + 34}px`}
            bgColor="bg.800"
            px="1"
            py="4"
            borderRadius={`${4}% ${4}% ${4}% ${4}% / 50% 50% 50% 50%`}
            onMouseEnter={() => {
              if (isMobile) return;
              const scrollbarWidth =
                window.innerWidth - document.documentElement.clientWidth;
              document.body.style.overflow = "hidden";
              document.body.style.paddingRight = `${scrollbarWidth}px`;
              setMouseEntered(true);
            }}
            onMouseLeave={() => {
              if (isMobile) return;
              document.body.style.overflow = "auto";
              document.body.style.paddingRight = "0px";
              setMouseEntered(false);
            }}
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
              {Array.from({ length }).map((_, index) => (
                <Item
                  key={index}
                  y={y}
                  index={index}
                  itemHeight={itemHeight}
                  containerHeight={containerHeight}
                />
              ))}
            </motion.div>

            <Shader direction="top" />
          </Box>
          <Box
            position="absolute"
            right="0"
            top={`calc(${containerHeight / 2}px )`}
            color={mouseEntered ? "bg.500" : "bg.600"}
            transform="rotate(90deg)"
          >
            <TbTriangleInvertedFilled size="2rem" />
          </Box>
        </ErrorWrapper>
      </Box3D>

      <ControlPanel length={length} stepUp={stepUp} stepDown={stepDown} />
    </Grid>
  );
};

export default ExchangersList;
