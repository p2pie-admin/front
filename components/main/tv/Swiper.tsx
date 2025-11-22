import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
} from "react";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import { Box, Grid, useColorModeValue } from "@chakra-ui/react";
import Shader from "../../shared/Shader";
import { Box3D } from "../../../styles/theme/custom";
import ControlPanel from "./ControlPanel";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setSwiperIdVisible } from "../../../redux/mainReducer";
import { IRate } from "../../../types/rates";
import Item from "./Item";
import debounce from "./utils/debounce";
import { fetchTopParameters } from "../../../redux/thunks";
import type { DirRatesReloadTrigger } from "../../../redux/thunks";
import ErrorWrapper from "../../shared/ErrorWrapper";
import BottomLabel from "./BottomLabel";
import TopLabel from "./TopLabel";
import { IDirText } from "../../../types/exchange";
import FoundError from "../../article/FoundError";

// You asked to keep TopLabel/BottomLabel separate files; if you haven't created them,
// simple presentational components are provided below inline — replace with your imports if you prefer.

const MotionBox = motion(Box);

const [elastic, stiffness, damping, debounceTime] = [0.05, 50, 10, 500];

export const Swiper = (props: {
  isMobile: boolean;
  itemHeight: number;
  visibleItems: number;
  containerHeight: number;
  dirRates: IRate[];
  dirText: IDirText | null;
  dirRatesReloadTrigger?: DirRatesReloadTrigger;
}) => {
  const {
    isMobile,
    itemHeight,
    visibleItems,
    containerHeight,
    dirRates,
    dirText,
    dirRatesReloadTrigger,
  } = props;

  const [initial, setInitial] = useState(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchTopParameters());
    setInitial(false);
  }, [dispatch]);

  const dirRatesStatus = useAppSelector((state) => state.main.dirRatesStatus);
  const isError =
    dirRatesStatus === "rejected" || (!initial && !dirRates.length);
  const isLoading = dirRatesStatus === "pending";

  const length = dirRates.length;
  const reloadTrigger: DirRatesReloadTrigger =
    dirRatesReloadTrigger || "manual";

  const bgColor = useColorModeValue("bg.50", "bg.800");
  const triangleColor = useColorModeValue("violet.700", "peach.600");
  const mouseEnteredRef = useRef(false);
  const originalOverflowRef = useRef<string | null>(null);
  const originalPaddingRef = useRef<string | null>(null);

  const y = useMotionValue(0);
  const controls = useAnimation();

  const getIndex = useCallback(() => {
    const index = Math.round(
      (-y.get() + (containerHeight / 2 - itemHeight / 2)) / itemHeight
    );
    return Math.min(length - 1, Math.max(0, index));
  }, [containerHeight, itemHeight, length, y]);

  const snapToNearest = useCallback(
    (currentY: number) => {
      const offset = containerHeight / 2 - itemHeight / 2;
      const index = Math.round((-currentY + offset) / itemHeight);

      if (index <= 0) return offset; // snap to first element
      if (index >= length - 1) return -itemHeight * (length - 1) + offset; // snap to last
      return -index * itemHeight + offset;
    },
    [containerHeight, itemHeight, length]
  );

  const move = useCallback(
    (yVal: number) => {
      controls.start({
        y: yVal,
        transition: { type: "spring", stiffness, damping },
      });
    },
    [controls]
  );

  const debouncedSetSwiperIdVisible = useMemo(
    () =>
      debounce(debounceTime, (index: number) => {
        dispatch(setSwiperIdVisible(index));
      }),
    [dispatch]
  );

  const scrollToItem = useCallback(
    (index: number) => {
      const targetY =
        -(itemHeight * index) + containerHeight / 2 - itemHeight / 2;
      move(targetY);
    },
    [containerHeight, itemHeight, move]
  );

  const changeIndexByDelta = useCallback(
    (delta: number) => {
      if (!length) return;
      const currentIndex = getIndex();
      const newIndex = Math.min(length - 1, Math.max(0, currentIndex + delta));
      debouncedSetSwiperIdVisible(newIndex);
      scrollToItem(newIndex);
    },
    [debouncedSetSwiperIdVisible, getIndex, length, scrollToItem]
  );

  const stepDown = () => changeIndexByDelta(-1);

  const stepUp = () => changeIndexByDelta(1);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (isMobile || !mouseEnteredRef.current) return;
      if (!event.deltaY) return;
      const normalized = Math.abs(event.deltaY);
      const intensity = Math.min(5, Math.max(1, Math.round(normalized / 80)));
      const direction = event.deltaY > 0 ? 1 : -1;
      changeIndexByDelta(direction * intensity);
      event.preventDefault();
    },
    [changeIndexByDelta, isMobile]
  );

  const handleKeyDown = (event: any) => {
    if (isMobile) return;
    if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      stepDown();
    } else if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      stepUp();
    }
  };

  useEffect(() => {
    if (initial) return;
    if (!length) return;
    if (reloadTrigger === "auto") return;

    const timeout = setTimeout(() => {
      scrollToItem(0);
      debouncedSetSwiperIdVisible(0);
    }, 700);

    return () => clearTimeout(timeout);
  }, [
    initial,
    length,
    reloadTrigger,
    debouncedSetSwiperIdVisible,
    scrollToItem,
  ]);

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleWheel, handleKeyDown, isMobile]);

  const restoreBodyStyles = useCallback(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = originalOverflowRef.current ?? "";
    document.body.style.paddingRight = originalPaddingRef.current ?? "";
    originalOverflowRef.current = null;
    originalPaddingRef.current = null;
  }, []);

  const handleMouseEnter = () => {
    if (isMobile || mouseEnteredRef.current) return;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    originalOverflowRef.current = document.body.style.overflow;
    originalPaddingRef.current = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    mouseEnteredRef.current = true;
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    restoreBodyStyles();
    mouseEnteredRef.current = false;
  };

  useEffect(() => {
    return () => {
      mouseEnteredRef.current = false;
      restoreBodyStyles();
    };
  }, [restoreBodyStyles]);

  const topLabelBaseTop = -itemHeight;
  const bottomLabelBaseTop = length * itemHeight;

  return (
    <Grid
      gridTemplateColumns="1fr auto"
      gridGap={["2", "4"]}
      h={`${containerHeight}px`}
    >
      <Box3D variant="extra_contrast" px="2" py="1">
        <ErrorWrapper
          isError={isError}
          isLoading={isLoading}
          primaryMessage="No rates available!"
          secondaryMessage="check your network connection"
        >
          <Box
            position="relative"
            overflow="hidden"
            h={`${containerHeight}px`}
            bgColor={bgColor}
            px="1"
            py="4"
            borderRadius={`${4}% ${4}% ${4}% ${4}% / 50% 50% 50% 50%`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Shader direction="top" />

            {/* motion div with items exactly as before */}
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
              dragElastic={elastic}
              onDragEnd={(_, info) => {
                const velocity = info.velocity.y;
                const currentIndex = getIndex();

                if (velocity > 50) {
                  // swipe down
                  const newIndex = Math.max(currentIndex - 1, 0);
                  debouncedSetSwiperIdVisible(newIndex);
                  scrollToItem(newIndex);
                } else if (velocity < -50) {
                  // swipe up
                  const newIndex = Math.min(currentIndex + 1, length - 1);
                  debouncedSetSwiperIdVisible(newIndex);
                  scrollToItem(newIndex);
                } else {
                  // low velocity: just snap back
                  debouncedSetSwiperIdVisible(currentIndex);
                  move(snapToNearest(y.get()));
                }
              }}
              animate={controls}
            >
              {dirRates.map((rate, index) => (
                <Item
                  key={"exchanger_" + rate.exchangerId}
                  rate={rate}
                  y={y}
                  index={index}
                  itemHeight={itemHeight}
                  containerHeight={containerHeight}
                />
              ))}
            </motion.div>

            <MotionBox
              position="absolute"
              left="0"
              right="0"
              style={{ top: `${topLabelBaseTop + 10}px`, y }}
              height={`${itemHeight}px`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              pointerEvents="none"
            >
              <TopLabel text={dirText?.h1} length={dirRates.length} />
            </MotionBox>

            <MotionBox
              position="absolute"
              left="0"
              right="0"
              style={{ top: `${bottomLabelBaseTop}px`, y }}
              height={`${itemHeight}px`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              pointerEvents="none"
              zIndex="655"
            >
              <FoundError />
            </MotionBox>

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
        </ErrorWrapper>
      </Box3D>
      <ControlPanel length={length} stepUp={stepUp} stepDown={stepDown} />
    </Grid>
  );
};

export default Swiper;
