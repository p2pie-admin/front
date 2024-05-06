import React, { useEffect, useCallback } from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import { Text, Box, Button } from "@chakra-ui/react";

export const TextBoxList = () => {
  const itemHeight = 80; // Height of each text box
  const visibleItems = 3; // Number of items visible in the container
  const containerHeight = itemHeight * visibleItems;

  const y = useMotionValue(0);
  const controls = useAnimation();

  const dragConstraints = {
    top:
      -itemHeight * (100 - visibleItems) + containerHeight / 2 - itemHeight / 2,
    bottom: containerHeight / 2 - itemHeight / 2,
  };

  const snapToNearest = useCallback(
    (currentY) => {
      const offset = containerHeight / 2 - itemHeight / 2;
      const index = Math.round((-currentY + offset) / itemHeight);
      return -index * itemHeight + offset;
    },
    [containerHeight, itemHeight]
  );

  useEffect(() => {
    let lastY = y.get();
    const unsubscribe = y.onChange((value) => {
      const currentVelocity = y.getVelocity();
      if (Math.abs(currentVelocity) < 10 && Math.abs(lastY - value) < 1) {
        // Check both low velocity and small movement delta
        const snapPoint = snapToNearest(value);
        if (snapPoint !== value) {
          controls.start({
            y: snapPoint,
            transition: { type: "spring", stiffness: 220, damping: 25 },
          });
        }
      }
      lastY = value; // Update lastY to the latest value
    });

    return () => unsubscribe();
  }, [y, controls, snapToNearest]);

  const onDragEnd = () => {
    controls.start({
      y: snapToNearest(y.get()),
      transition: { type: "spring", stiffness: 220, damping: 25 },
    });
  };

  const scrollToItem = useCallback(
    (index) => {
      const targetY =
        -(itemHeight * index) + containerHeight / 2 - itemHeight / 2;
      controls.start({
        y: targetY,
        transition: { type: "spring", stiffness: 220, damping: 25 },
      });
    },
    [itemHeight, containerHeight, controls]
  );
  const handleWheel = (event) => {
    const currentIndex = Math.round(
      (-y.get() + (containerHeight / 2 - itemHeight / 2)) / itemHeight
    );
    if (event.deltaY < 0) {
      scrollToItem(Math.max(currentIndex - 1, 0));
    } else if (event.deltaY > 0) {
      scrollToItem(Math.min(currentIndex + 1, 99));
    }
  };

  const handleKeyDown = (event) => {
    const currentIndex = Math.round(
      (-y.get() + (containerHeight / 2 - itemHeight / 2)) / itemHeight
    );
    if (event.key === "ArrowUp") {
      scrollToItem(Math.max(currentIndex - 1, 0));
    } else if (event.key === "ArrowDown") {
      scrollToItem(Math.min(currentIndex + 1, 99));
    }
    console.log(y, itemHeight, containerHeight);
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
    <>
      <Box overflow="hidden" position="relative" h={`${containerHeight}px`}>
        <motion.div
          drag="y"
          dragConstraints={dragConstraints}
          style={{ y }}
          dragElastic={0.2}
          onDragEnd={onDragEnd}
          animate={controls}
        >
          {Array.from({ length: 100 }).map((_, index) => (
            <motion.div
              key={index}
              style={{
                height: `${itemHeight}px`,
                background: "lightgray",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "5px",
              }}
            >
              <Text color="red.600">{`Item ${index + 1}`}</Text>
            </motion.div>
          ))}
        </motion.div>
      </Box>
      <Box display="flex" justifyContent="space-between" p={4}>
        <Button
          onClick={() =>
            scrollToItem(
              Math.max(
                Math.round(
                  (-y.get() + (containerHeight / 2 - itemHeight / 2)) /
                    itemHeight
                ) - 1,
                0
              )
            )
          }
        >
          Prev
        </Button>
        <Button
          onClick={() =>
            scrollToItem(
              Math.min(
                Math.round(
                  (-y.get() + (containerHeight / 2 - itemHeight / 2)) /
                    itemHeight
                ) + 1,
                99
              )
            )
          }
        >
          Next
        </Button>
      </Box>
    </>
  );
};

export default TextBoxList;
