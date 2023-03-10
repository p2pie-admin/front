import { Flex, VStack } from "@chakra-ui/react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";

const MotionFlex = motion(Flex);

const transitionProps = {
  stiffness: 400,
  type: "spring",
  damping: 60,
  mass: 3,
};

function Track({
  setTrackIsActive,
  trackIsActive,
  handleSwiperIdVisible,
  swiperIdVisible,
  constraint,
  multiplier,
  itemWidth,
  positions,
  children,
}) {
  const [dragStartPosition, setDragStartPosition] = useState(0);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const node = useRef(null);

  const handleDragStart = () =>
    setDragStartPosition(positions[swiperIdVisible]);

  const handleDragEnd = (_, info) => {
    const distance = info.offset.x;
    const velocity = info.velocity.x * multiplier;
    const direction = velocity < 0 || distance < 0 ? 1 : -1;

    const extrapolatedPosition =
      dragStartPosition +
      (direction === 1
        ? Math.min(velocity, distance)
        : Math.max(velocity, distance));

    const closestPosition = positions.reduce((prev, curr) => {
      return Math.abs(curr - extrapolatedPosition) <
        Math.abs(prev - extrapolatedPosition)
        ? curr
        : prev;
    }, 0);

    if (!(closestPosition < positions[positions.length - constraint])) {
      handleSwiperIdVisible(positions.indexOf(closestPosition));
      controls.start({
        x: closestPosition,
        transition: {
          velocity: info.velocity.x,
          ...transitionProps,
        },
      });
    } else {
      handleSwiperIdVisible(positions.length - constraint);
      controls.start({
        x: positions[positions.length - constraint],
        transition: {
          velocity: info.velocity.x,
          ...transitionProps,
        },
      });
    }
  };

  const handleResize = useCallback(() => {
    controls.start({
      x: positions[swiperIdVisible],
      transition: {
        ...transitionProps,
      },
    });
  }, [swiperIdVisible, controls, positions]);

  const handleClick = useCallback(
    (event) => {
      if (node.current && node.current.contains(event.target)) {
        setTrackIsActive(true);
      } else setTrackIsActive(false);
    },
    [setTrackIsActive]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (trackIsActive) {
        if (swiperIdVisible < positions.length - constraint) {
          if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            event.preventDefault();
            handleSwiperIdVisible(swiperIdVisible + 1);
          }
        }
        if (swiperIdVisible > positions.length - positions.length) {
          if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            event.preventDefault();
            handleSwiperIdVisible(swiperIdVisible - 1);
          }
        }
      }
    },
    [
      trackIsActive,
      handleSwiperIdVisible,
      swiperIdVisible,
      constraint,
      positions.length,
    ]
  );

  useEffect(() => {
    handleResize();

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [handleClick, handleResize, handleKeyDown, positions]);

  return (
    <>
      {itemWidth && (
        <VStack ref={node} spacing={4} alignItems="stretch">
          <MotionFlex
            dragConstraints={node}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            animate={controls}
            style={{ x }}
            drag="x"
            _active={{ cursor: "grabbing" }}
            minWidth="min-content"
            flexWrap="nowrap"
            cursor="grab"
            p="0"
          >
            {children}
          </MotionFlex>
        </VStack>
      )}
    </>
  );
}

export default Track;
