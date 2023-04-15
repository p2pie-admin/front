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

  const amountOutputs = useAppSelector((state) => state.main.amountOutputs);
  const pmCurrencyName = useAppSelector(
    (state) => state.main[`${side}Pm`]?.currency.code.toUpperCase() || ""
  );

  const stringValue = (amountOutputs && amountOutputs[side]) || "";
  const value = +stringValue.replaceAll(" ", "");
  // const outRange = min && max && (value > MAX || value < MAX);

  //Формула для логарифмической шкалы

  // рисуем точки на шкале 0-65% для min и 65-100% для max
  // на 65% случается надлом производной и функция начинает расти существенно
  // const lowLimit = lowestMax > highestMin ? highestMin : lowestMax;
  // const resMin = 65 - 65 ** (1 - MIN / lowLimit);

  // если максималка очень маленькая, то переносим ее на левую шкалу для минималок
  // const resMax = 100 - 35 ** (1 - MAX / highestMax);

  const [showTooltip, setShowTooltip] = useState(false);
  const [MIN, MAX] =
    min?.[side] && max?.[side]
      ? [roundAmount(min[side], true), roundAmount(max[side], true)]
      : [0, 0];
  // needMargin если min близок к highestMin && max далек от highestMax
  const needMarginMin = MIN / lowestMin > 8; //&& MAX / lowestMax < 10;
  const needMarginMax = highestMax / MAX > 8;

  // const f = (x: number, breakpoint: number) =>
  //   x > breakpoint
  //     ? 49 + 49 ** (1 + (x - 2 * breakpoint) / breakpoint)
  //     : 51 - 51 ** (1 - x / breakpoint);
  const log = (base: number, n: number) => Math.log(n) / Math.log(base);
  const curvingStrength = 100 / (1 - log(highestMax, lowestMin));
  const F = (x: number) =>
    roundAmount(highestMax ** (1 + (x - 100) / curvingStrength), true);

  const unF = (x?: number) => {
    if (!x) return 0;
    return 100 + curvingStrength * (log(highestMax, x) - 1);
  };
  const [resMin, resMax] = [unF(MIN), unF(MAX)];
  const [a, setA] = useState(0);
  const dispatch = useAppDispatch();
  //const amountInputNum = useAppSelector((state) => state.main.amountInput?.num) || 0;

  const amount = F(a);
  const stickyAmount = isClose(MIN, amount)
    ? MIN
    : isClose(MAX, amount)
    ? MAX
    : amount;
  const color =
    stickyAmount >= MIN && stickyAmount <= MAX ? "orange.200" : "bg.500";
  if (!MIN || !MAX) return <></>;
  return (
    <Box3D bgColor="bg.900" h="14" mb="4" cursor="pointer">
      {/* <Text>highestMax: {highestMax}</Text>
      <Text>resMin: {resMin}</Text>
      <Text>resMax: {resMax}</Text> */}
      <Center position="relative">
        <Box w="90%" position="absolute" top="6px">
          <Slider
            aria-label="slider-ex-1"
            defaultValue={10}
            step={0.5}
            onChange={(x) => {
              setA(x);
              dispatch(
                setAmount({
                  side,
                  num: F(x),
                  str: String(F(x)),
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
          <CustomRangeSlider resMin={resMin} resMax={resMax}>
            <RangeSliderTrack>
              <RangeSliderFilledTrack bgColor="orange.200" />
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
