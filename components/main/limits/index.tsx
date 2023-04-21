import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Box,
  Flex,
  Center,
  useToken,
  Text,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
} from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import useSmooth from "../../../services/hooks/smooth";
import { Box3D } from "../../../styles/theme/wrappers";
import Limit from "./Limit";
import { isClose, kFormatter, roundAmount } from "../../../redux/amountsHelper";
import { setAmount } from "../../../redux/mainReducer";

const CustomRangeSlider = ({
  resMin,
  resMax,

  children,
}: {
  resMin: number;
  resMax: number;

  children: ReactJSXElement[];
}) => {
  const smoothResMin = useSmooth(resMin);
  const smoothResMax = useSmooth(resMax);
  return (
    <RangeSlider
      value={[smoothResMin, smoothResMax]}
      aria-label={["min", "max"]}
    >
      {children}
    </RangeSlider>
  );
};

const LimitsRange = () => {
  const currentDirRate = useAppSelector(
    (state) => state.main?.dirRates?.[state.main.swiperIdVisible]
  );

  const [side, setSide]: [side: "give" | "get", setSide: Function] = useState(
    "get"
  );
  const changeSide = () => setSide(side === "get" ? "give" : "get");

  const [highestMin, highestMax, lowestMin, lowestMax] = useAppSelector(
    (state) => {
      const dirRates = state.main.dirRates || [];
      const allMins = dirRates.map((r) => roundAmount(r.min?.[side], true));
      const allMaxes = dirRates.map((r) => roundAmount(r.max?.[side], true));

      return [
        Math.max(...allMins),
        Math.max(...allMaxes),
        Math.min(...allMins),
        Math.min(...allMaxes),
      ];
    }
  );

  const { min, max } = currentDirRate
    ? currentDirRate
    : { min: { give: 0, get: 0 }, max: { give: 0, get: 0 } };

  const pmCurrencyName = useAppSelector(
    (state) => state.main[`${side}Pm`]?.currency.code.toUpperCase() || ""
  );

  const [showTooltip, setShowTooltip] = useState(false);
  const [MIN, MAX] =
    min?.[side] && max?.[side]
      ? [roundAmount(min[side], true), roundAmount(max[side], true)]
      : [0, 0];
  // needMargin если min близок к highestMin && max далек от highestMax
  const needMarginMin = MIN / lowestMin > 8; //&& MAX / lowestMax < 10;
  const needMarginMax = highestMax / MAX > 8;

  const log = (base: number, n: number) => Math.log(n) / Math.log(base);
  const curvingStrength = 100 / (1 - log(highestMax, lowestMin));
  const percToAmount = (x: number) =>
    roundAmount(highestMax ** (1 + (x - 100) / curvingStrength), true);

  const amountToPerc = (x?: number) => {
    if (!x) return 0;
    return 100 + curvingStrength * (log(highestMax, x) - 1);
  };
  const [percMin, percMax] = [amountToPerc(MIN), amountToPerc(MAX)];

  const dispatch = useAppDispatch();
  const amount =
    useAppSelector(
      (state) => +state.main.amountOutputs[side].replaceAll(" ", "")
    ) || 0;

  const stick = (a: number) =>
    isClose(MIN, a) ? MIN : isClose(MAX, a) ? MAX : a;
  const stickyAmount = stick(amount);

  const color =
    stickyAmount >= MIN && stickyAmount <= MAX ? "primary.200" : "bg.500";
  if (!MIN || !MAX) return <></>;
  return (
    <Box3D bgColor="bg.900" h="14" mb="4" cursor="pointer">
      {/* <Text>highestMax: {highestMax}</Text> */}
      <Center position="relative">
        <Box w="90%" position="absolute" top="6px">
          <Slider
            aria-label="slider-ex-1"
            focusThumbOnChange={false}
            value={amountToPerc(stickyAmount)}
            step={0.5}
            onChange={(x) => {
              const newAmount = stick(percToAmount(x));
              dispatch(
                setAmount({
                  side,
                  num: newAmount,
                  str: String(newAmount),
                })
              );
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Tooltip
              hasArrow
              bg="bg.700"
              borderRadius="2xl"
              color={color}
              placement="top"
              isOpen={showTooltip}
              label={`${kFormatter(stickyAmount)} ${pmCurrencyName}`}
            >
              <SliderThumb zIndex="3" boxSize={4} bgColor={color}>
                <Box w="1.5" h="1.5" bgColor="bg.600" borderRadius="50%" />
              </SliderThumb>
            </Tooltip>
            <SliderTrack bgColor="transparent"></SliderTrack>
          </Slider>
        </Box>

        <Box w="90%">
          <CustomRangeSlider resMin={percMin} resMax={percMax}>
            <RangeSliderTrack>
              <RangeSliderFilledTrack bgColor="primary.200" />
            </RangeSliderTrack>
            <RangeSliderThumb boxSize={1} index={0} zIndex="2">
              <Limit
                label="min"
                value={MIN}
                needMargin={needMarginMin}
                pmCurrencyName={pmCurrencyName}
                changeSide={changeSide}
              />
            </RangeSliderThumb>
            <RangeSliderThumb boxSize={1} index={1} zIndex="1">
              <Limit
                label="max"
                value={MAX}
                needMargin={needMarginMax}
                pmCurrencyName={pmCurrencyName}
                changeSide={changeSide}
              />
            </RangeSliderThumb>
          </CustomRangeSlider>
        </Box>
      </Center>
    </Box3D>
  );
};

export default LimitsRange;
