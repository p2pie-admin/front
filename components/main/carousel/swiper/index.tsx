import React, { useCallback, useEffect, useState, useMemo } from "react";

import { useMediaQuery, useTheme, Flex } from "@chakra-ui/react";

import Item from "./item";
import Carcas from "./Carcas";
import SlidingLayout from "./SlidingLayout";

export default function Swiper({ children, gap }) {
  const [trackIsActive, setTrackIsActive] = useState(false);
  const [multiplier, setMultiplier] = useState(0.35);
  const [sliderWidth, setSliderWidth] = useState(0);

  const [constraint, setConstraint] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);

  const initSliderWidth = useCallback((width) => setSliderWidth(width), []);

  const positions = useMemo(
    () => children.map((_, index) => -Math.abs((itemWidth + gap) * index)),
    [children, itemWidth, gap]
  );

  useEffect(() => {
    setItemWidth(sliderWidth - gap);
    setMultiplier(0.65);
    setConstraint(1);
  }, [sliderWidth, gap]);

  const carcasProps = {
    setTrackIsActive,
    initSliderWidth,
    constraint,
    itemWidth,
    positions,
    gap,
  };

  const slidingLayoutProps = {
    setTrackIsActive,
    trackIsActive,
    sliderWidth,
    constraint,
    multiplier,
    itemWidth,
    positions,
    gap,
  };

  const itemProps = {
    setTrackIsActive,
    trackIsActive,
    constraint,
    itemWidth,
    positions,
    gap,
  };

  return (
    <Carcas {...carcasProps}>
      <SlidingLayout {...slidingLayoutProps}>
        {children.map((child, index) => {
          return (
            <Item
              {...itemProps}
              exIdIndexPair={[child.key, index]}
              index={index}
              key={index}
            >
              {child}
            </Item>
          );
        })}
      </SlidingLayout>
    </Carcas>
  );
}
