import React, { useCallback, useEffect, useState, useMemo } from "react";

import { useMediaQuery, useTheme, Flex } from "@chakra-ui/react";

import Item from "./item";
import Carcas from "./Carcas";

import ExchangerCard from "../card";
import { IParamData, IRate } from "../../../../types/rates";
import { TextBoxList } from ".";

export default function Swiper({
  dirRates,
  gap,
}: {
  dirRates?: IRate[];
  gap: number;
  allParameters: IParamData[];
}) {
  const [trackIsActive, setTrackIsActive] = useState(false);
  const [multiplier, setMultiplier] = useState(0.35);
  const [sliderWidth, setSliderWidth] = useState(0);

  const [constraint, setConstraint] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);

  const initSliderWidth = useCallback((width) => setSliderWidth(width), []);

  if (!dirRates || !dirRates.length) return <></>;

  const positions = useMemo(
    () => dirRates.map((_, index) => -Math.abs((itemWidth + gap) * index)),
    [dirRates, itemWidth, gap]
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
  const texts = [
    "Text Item 1",
    "Text Item 2",
    "Text Item 3",
    "Text Item 4",
    "Text Item 5",
    "Text Item 6",
    "Text Item 7",
    "Text Item 8",
    "Text Item 9",
    "Text Item 10",
  ];
  return {
    /* <SlidingLayout {...slidingLayoutProps}>
        {dirRates.map((dirRate, index) => {
          const parameters = allParameters
            .filter((p) =>
              dirRate?.parameterCodes?.find((code) => code === p.code)
            )
            .map((p) => ({
              ...p.parameter,
              en_name: p.en_name,
              ru_name: p.ru_name,
            }));

          return (
            <Item
              {...itemProps}
              //exIdIndexPair={[dirRate.key, index]}
              index={index}
              key={index}
            >
              <ExchangerCard
                key={dirRate.exchangerId + index}
                dirRate={dirRate}
                parameters={parameters}
              />
            </Item>
          );
        })}
      </SlidingLayout> */
  };
}
