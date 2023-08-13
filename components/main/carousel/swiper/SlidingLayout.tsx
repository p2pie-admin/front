import { Box, Flex, VStack } from "@chakra-ui/react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { batch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setSwiperIdVisible } from "../../../../redux/mainReducer";

const MotionFlex = motion(Flex);

const transitionProps = {
  stiffness: 400,
  type: "spring",
  damping: 60,
  mass: 3,
};

function SlidingLayout({
  setTrackIsActive,
  trackIsActive,
  constraint,
  multiplier,
  itemWidth,
  positions,
  children,
}) {
  const dispatch = useAppDispatch();
  const swiperIdVisible = useAppSelector((state) => state.main.swiperIdVisible);
  const handleSwiperIdVisible = (id: number) =>
    dispatch(setSwiperIdVisible(id));

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

  useEffect(() => {
    handleResize();
  }, [handleClick, handleResize, positions]);

  return (
    <>
      {!!itemWidth && (
        <VStack
          ref={node}
          spacing={4}
          alignItems="stretch"
          // onWheel={handleWheel}
        >
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
          >
            {children}
          </MotionFlex>
        </VStack>
      )}
    </>
  );
}

export default SlidingLayout;
