import { useColorModeValue, Box, useTheme } from "@chakra-ui/react";
import { useMotionValue, useAnimation, motion } from "framer-motion";
import React, { forwardRef, useImperativeHandle } from "react";
import { ResponsiveText } from "../../../styles/theme/custom";
import { useRouter } from "next/router";
import MassShader from "../MassShader";

const elastic = 0.1;
const stiffness = 50;
const damping = 10;

type MassSwiperProps = {
  initialId?: string;
  set: Function;
  items: { id: string; ru_label: string; en_label: string }[];
};

const MassSwiper = forwardRef<MassSwiperHandle, MassSwiperProps>(
  ({ initialId, items, set }, ref) => {
  const { locale } = useRouter() as { locale: "en" | "ru" };
  const isMobile = false;
  const itemHeight = 40;
  const containerHeight = 120;

  const length = items.length;
  const bgColor = useColorModeValue("bg.50", "bg.800");
  const [mouseEntered, setMouseEntered] = React.useState(false);
  const originalOverflowRef = React.useRef<string | null>(null);
  const originalPaddingRef = React.useRef<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const y = useMotionValue(0);
  const controls = useAnimation();
  const theme = useTheme();

  const parseSpaceToPx = React.useCallback((val: any) => {
    if (!val && val !== 0) return 0;
    if (typeof val === "number") return val;
    const s = String(val).trim();
    if (s.endsWith("px")) return parseFloat(s);
    if (s.endsWith("rem")) {
      const root =
        typeof window !== "undefined"
          ? parseFloat(
              getComputedStyle(document.documentElement).fontSize || "16"
            )
          : 16;
      return parseFloat(s) * root;
    }
    if (s.endsWith("em")) {
      const root =
        typeof window !== "undefined"
          ? parseFloat(
              getComputedStyle(document.documentElement).fontSize || "16"
            )
          : 16;
      return parseFloat(s) * root;
    }
    const maybeNum = Number(s);
    if (!isNaN(maybeNum)) return maybeNum;
    return 0;
  }, []);

  const gapPx = parseSpaceToPx((theme as any).space?.[2] ?? 0);
  const padY = parseSpaceToPx((theme as any).space?.[4] ?? 0);
  const paddingTopPx = padY;
  const step = itemHeight + gapPx;
  const centerOffset = containerHeight / 2 - itemHeight / 2 - paddingTopPx;

  const getIndex = React.useCallback(() => {
    const index = Math.round((-y.get() + centerOffset) / step);
    return Math.min(length - 1, Math.max(0, index));
  }, [centerOffset, length, step, y]);

  const snapToNearest = React.useCallback(
    (currentY: number) => {
      const index = Math.round((-currentY + centerOffset) / step);
      if (index <= 0) return centerOffset;
      if (index >= length - 1) return -step * (length - 1) + centerOffset;
      return -index * step + centerOffset;
    },
    [centerOffset, step, length]
  );

  const move = React.useCallback((yPos: number) => {
    controls.start({
      y: yPos,
      transition: { type: "spring", stiffness, damping },
    });
  }, [controls]);

  const scrollToItem = React.useCallback((index: number) => {
    const targetY = -index * step + centerOffset;
    move(targetY);
  }, [centerOffset, move, step]);

  const stepDown = React.useCallback(() => {
    const currentIndex = getIndex();
    scrollToItem(Math.max(currentIndex - 1, 0));
  }, [getIndex, scrollToItem]);

  const stepUp = React.useCallback(() => {
    const currentIndex = getIndex();
    scrollToItem(Math.min(currentIndex + 1, length - 1));
  }, [getIndex, scrollToItem]);

    useImperativeHandle(
      ref,
      () => ({
        stepUp,
        stepDown,
      }),
      [stepDown, stepUp]
    );

  // 1) CLICK HANDLER → go to next item (loop back to top)
  const handleClick = () => {
    // const currentIndex = getIndex();
    // if (currentIndex < length - 1) {
    //   scrollToItem(currentIndex + 1);
    // } else {
    //   scrollToItem(0);
    // }
  };

  const restoreBodyStyles = React.useCallback(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = originalOverflowRef.current ?? "";
    document.body.style.paddingRight = originalPaddingRef.current ?? "";
    originalOverflowRef.current = null;
    originalPaddingRef.current = null;
  }, []);

  const handleMouseEnter = React.useCallback(() => {
    if (isMobile || mouseEntered) return;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    originalOverflowRef.current = document.body.style.overflow;
    originalPaddingRef.current = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    setMouseEntered(true);
  }, [isMobile, mouseEntered]);

  const handleMouseLeave = React.useCallback(() => {
    if (isMobile) return;
    restoreBodyStyles();
    setMouseEntered(false);
  }, [isMobile, restoreBodyStyles]);

  const handleWheel = React.useCallback(
    (event: WheelEvent) => {
      const containerEl = containerRef.current;
      const targetNode = event.target as Node | null;
      const path = (event as any).composedPath?.() as Node[] | undefined;
      const targetInside =
        !!containerEl &&
        (containerEl === targetNode ||
          (!!targetNode && containerEl.contains(targetNode)) ||
          (Array.isArray(path) && path.includes(containerEl)));

      if (targetInside && !mouseEntered) {
        handleMouseEnter();
      }
      if (isMobile || !mouseEntered) return;
      if (event.deltaY < 0) stepDown();
      else if (event.deltaY > 0) stepUp();
    },
    [handleMouseEnter, isMobile, mouseEntered, stepDown, stepUp]
  );

  const handleKeyDown = React.useCallback(
    (event: any) => {
      if (isMobile) return;
      if (event.key === "ArrowUp" || event.key === "ArrowRight") stepDown();
      else if (event.key === "ArrowDown" || event.key === "ArrowLeft") stepUp();
    },
    [isMobile, stepDown, stepUp]
  );

  React.useEffect(() => {
    if (isMobile) return;
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleWheel, handleKeyDown]);

  // === FIXED INITIALIZATION ===
  // Use layout effect so we set the motion value before paint/other effects.
  const didMount = React.useRef(false);
  React.useEffect(() => {
    if (length === 0) return;

    let startIndex = 0;
    if (initialId) {
      const idx = items.findIndex((it) => it.id === initialId);
      if (idx !== -1) {
        startIndex = idx;
      }
    }

    const targetY = -startIndex * step + centerOffset;

    // instead of setting instantly → animate to it
    controls.start({
      y: targetY,
      transition: { type: "spring", stiffness, damping },
    });

    // still notify parent which item is selected
    set(items[startIndex].id);
  }, [initialId, length, step, centerOffset, items, set, controls]);

  // 3) LOG selected item whenever it changes (keeps parent in sync on interactions)
  React.useEffect(() => {
    let lastIndex = getIndex();
    set(items[lastIndex].id);

    const unsubscribe = y.onChange(() => {
      const idx = getIndex();
      if (idx !== lastIndex) {
        lastIndex = idx;
        set(items[idx].id);
      }
    });
    return unsubscribe;
  }, [y, items, set, centerOffset, step]);

  React.useEffect(() => {
    return () => {
      restoreBodyStyles();
    };
  }, [restoreBodyStyles]);

    return (
      <Box h={`${containerHeight}px`} minW="33%">
        <Box
          cursor="grab"
          position="relative"
          overflow="hidden"
          h={`${containerHeight}px`}
          px="1"
          py="4"
          borderRadius={`${8}% ${8}% ${8}% ${8}% / 50% 50% 50% 50%`}
          onClick={handleClick}
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <MassShader direction="top" />
          <motion.div
            drag="y"
            dragConstraints={{
              top: -step * (length - 1) + centerOffset,
              bottom: centerOffset,
            }}
            style={{ y, width: "100%" }}
            dragElastic={elastic}
            onDragEnd={(_, info) => {
              const velocity = info.velocity.y;
              const currentIndex = getIndex();
              if (velocity > 50) {
                scrollToItem(Math.max(currentIndex - 1, 0));
              } else if (velocity < -50) {
                scrollToItem(Math.min(currentIndex + 1, length - 1));
              } else {
                move(snapToNearest(y.get()));
              }
            }}
            animate={controls}
          >
            {items.map((item) => (
              <Box
                bgColor={bgColor}
                key={item[`${locale}_label`] + item.id}
                h={`${itemHeight}px`}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="lg"
                mb="2"
              >
                <ResponsiveText variant="contrast" size="xl">
                  {item[`${locale}_label`]}
                </ResponsiveText>
              </Box>
            ))}
          </motion.div>
          <MassShader direction="bottom" />
        </Box>
      </Box>
    );
  }
);

export type MassSwiperHandle = {
  stepUp: () => void;
  stepDown: () => void;
};

export default MassSwiper;
