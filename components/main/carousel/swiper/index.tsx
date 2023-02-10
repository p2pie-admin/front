import React, { useCallback, useEffect, useState, useMemo } from "react";

import { useMediaQuery, useTheme, Flex } from "@chakra-ui/react";

import Slider from "./slider";
import Track from "./track";
import Item from "./item";

import { useAppSelector, useAppDispatch } from "../../../../redux/hooks";
import {
  setSwiperIdVisible,
  updateAmount,
} from "../../../../redux/mainReducer";
import { batch } from "react-redux";

export default function Swiper({ children, gap }) {
  const dispatch = useAppDispatch();
  const swiperIdVisible = useAppSelector((state) => state.main.swiperIdVisible);
  const handleSwiperIdVisible = (id: number) =>
    batch(() => {
      dispatch(updateAmount(id));
      dispatch(setSwiperIdVisible(id));
    });

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

  const { breakpoints } = useTheme();

  const [isBetweenBaseAndMd] = useMediaQuery(
    `(min-width: ${breakpoints.base}) and (max-width: ${breakpoints.md})`
  );

  const [isBetweenMdAndXl] = useMediaQuery(
    `(min-width: ${breakpoints.md}) and (max-width: ${breakpoints.xl})`
  );

  const [isGreaterThanXL] = useMediaQuery(`(min-width: ${breakpoints.xl})`);

  useEffect(() => {
    setItemWidth(sliderWidth - gap);
    setMultiplier(0.65);
    setConstraint(1);
  }, [sliderWidth, gap]);

  const sliderProps = {
    setTrackIsActive,
    initSliderWidth,
    handleSwiperIdVisible,
    swiperIdVisible,
    constraint,
    itemWidth,
    positions,
    gap,
  };

  const trackProps = {
    setTrackIsActive,
    trackIsActive,
    handleSwiperIdVisible,
    sliderWidth,
    swiperIdVisible,
    constraint,
    multiplier,
    itemWidth,
    positions,
    gap,
  };

  const itemProps = {
    setTrackIsActive,
    trackIsActive,
    handleSwiperIdVisible,
    swiperIdVisible,
    constraint,
    itemWidth,
    positions,
    gap,
  };

  return (
    <Slider {...sliderProps}>
      <Track {...trackProps}>
        {children.map((child, index) => {
          return (
            <Item {...itemProps} exIdIndexPair={[child.key, index]} key={index}>
              {child}
            </Item>
          );
        })}
      </Track>
    </Slider>
  );
}
