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
  keyframes,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import useSmooth from "../../../services/hooks/smooth";
import { Box3D, ResponsiveText } from "../../../styles/theme/custom";
import Limit from "./Limit";
import {
  isClose,
  kFormatter,
  localFormat,
  R,
  symbols,
} from "../../../redux/amountsHelper";
import { setAmount } from "../../../redux/mainReducer";
import { RxDragHandleDots2 } from "react-icons/rx";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import Thumb from "./Thumb";
import side from "../side";

import { useRouter } from "next/router";

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
  const dispatch = useAppDispatch();
  const currentDirRate = useAppSelector(
    (state) => state.main?.dirRates?.[state.main.swiperIdVisible]
  );
  const { locale } = useRouter() as { locale: "en" | "ru" };

  const [minWord, maxWord, limitsWord] =
    locale == "en" ? ["min", "max", "limits"] : ["мин", "макс", "лимиты"];
  // if(!currentDirRate) return <></>
  const [side, setSide]: [side: "give" | "get", setSide: Function] = useState(
    "get" as "give" | "get" // (currentDirRate.course) > 1 ? "give" : "get"
  );

  const giveCur = useAppSelector(
    (state) => state.main.givePm?.currency.code.toUpperCase() || ""
  );
  const getCur = useAppSelector(
    (state) => state.main.getPm?.currency.code.toUpperCase() || ""
  );

  const mainCur = side === "give" ? giveCur : getCur;

  const dirRates = useAppSelector((state) => state.main.dirRates || []);
  const allMins = dirRates.map((r) => R(r.min?.[side], 2));
  const allMaxes = dirRates.map((r) => R(r.max?.[side], 2));
  const [highestMax, lowestMin] = [Math.max(...allMaxes), Math.min(...allMins)];

  const amount =
    useAppSelector(
      (state) => +state.main.amountOutputs[side].replaceAll(" ", "")
    ) || 0;

  const changeSide = () => setSide(side === "get" ? "give" : "get");

  const { min, max } = currentDirRate
    ? currentDirRate
    : { min: { give: 0, get: 0 }, max: { give: 0, get: 0 } };

  const [MIN, MAX] =
    min?.[side] && max?.[side] ? [R(min[side], 2), R(max[side], 2)] : [0, 0];
  // needMargin если min близок к highestMin && max далек от highestMax
  // const needMarginMin = MIN / lowestMin > 5; //&& MAX / lowestMax < 10;
  // const needMarginMax = highestMax / MAX > 5;
  const tooCloseMinMax = MIN / MAX < 5 || MAX / MIN < 5;

  const log = (base: number, n: number) => Math.log(n) / Math.log(base);
  const curvingStrength = 100 / (1 - log(highestMax, lowestMin));
  const percToAmount = (x: number) =>
    R(highestMax ** (1 + (x - 100) / curvingStrength), 4);

  const amountToPerc = (x?: number) => {
    if (!x) return 0;
    return 100 + curvingStrength * (log(highestMax, x) - 1);
  };
  const [percMin, percMax] = [amountToPerc(MIN), amountToPerc(MAX)];
  const smoothCenter = useSmooth(percMin + (percMax - percMin) / 2);

  const stickTo = [1, 10, 100, 1_000, 10_000, 100_000, 1_000_000, MIN, MAX];
  const stick = (a: number) => stickTo.find((s) => isClose(s, a)) || a;

  const stickyAmount = stick(amount);

  const mainColor = useColorModeValue("violet.500", "peach.200");

  const color1 = useColorModeValue("bg.300", "bg.800");
  const colorTrackInactive = useColorModeValue("bg.300", "bg.600");
  const colorTrackBG = useColorModeValue("bg.100", "bg.800");
  const colorHint = useColorModeValue("bg.10", "bg.800");

  const colorTrackFilled =
    stickyAmount >= MIN && stickyAmount <= MAX ? mainColor : colorTrackInactive;

  const props = { mainCur, stickyAmount, MIN, MAX };
  if (!MIN || !MAX) return <></>;
  return (
    <Box3D py="2" my={[2, 3, 4]} cursor="pointer" display="flex" flexDir="row">
      {/* <Text>highestMax: {highestMax}</Text> */}
      <HStack minW="25%" justifyContent="center" onClick={changeSide}>
        <Text fontSize="xs" color={side === "give" ? mainColor : "bg.500"}>
          {giveCur}
        </Text>
        <Text fontSize="xs" color={side === "get" ? mainColor : "bg.500"}>
          {getCur}
        </Text>
      </HStack>
      <Box position="relative" mb="2" w="75%">
        <Box w="98%" position="absolute" top="0" zIndex="3">
          <Slider
            aria-label="limits"
            focusThumbOnChange={false}
            value={amountToPerc(stickyAmount)}
            step={0.5}
            onChange={(x) => {
              const newAmount = stick(percToAmount(x));
              if (amount !== newAmount) {
                dispatch(
                  setAmount({
                    side,
                    num: newAmount,
                    str: String(newAmount),
                  })
                );
              }
            }}
          >
            <Thumb {...props} />

            <SliderTrack bgColor="transparent"></SliderTrack>
          </Slider>
        </Box>

        <Box w="98%" pointerEvents="none" color="bg.500">
          <CustomRangeSlider resMin={percMin} resMax={percMax}>
            <RangeSliderTrack bgColor={colorTrackBG}>
              <RangeSliderFilledTrack bgColor={colorTrackFilled} />
            </RangeSliderTrack>
            {percMax - percMin < 35 ? (
              <Flex
                justifyContent="center"
                position="absolute"
                minW="100px"
                maxW="100px"
                minH="20"
                left={`calc(${smoothCenter.toFixed(0)}% - 50px)`}
              >
                <Box
                  h="fit-content"
                  mt="3"
                  bgColor={colorHint}
                  boxShadow="lg"
                  borderRadius="md"
                  px="1"
                  py="0.5"
                >
                  <ResponsiveText size="xs">
                    {MIN == MAX
                      ? localFormat(MIN, mainCur, locale)
                      : `${limitsWord}: ${localFormat(
                          MIN,
                          mainCur,
                          locale
                        )} — ${localFormat(MAX, mainCur, locale)}`}
                  </ResponsiveText>
                </Box>
              </Flex>
            ) : (
              <>
                <RangeSliderThumb
                  boxSize={1}
                  index={0}
                  zIndex="2"
                  bgColor={mainColor}
                >
                  <ResponsiveText
                    mt="12"
                    ml={isClose(lowestMin, MIN) ? 6 : 0}
                    size="xs"
                    whiteSpace="nowrap"
                    textAlign="center"
                    bgColor={colorHint}
                    boxShadow="lg"
                    borderRadius="md"
                    px="1"
                    py="0.5"
                  >
                    {`${minWord}: ${localFormat(MIN, mainCur, locale)}`}
                  </ResponsiveText>
                </RangeSliderThumb>

                <RangeSliderThumb
                  boxSize={1}
                  index={1}
                  zIndex="1"
                  bgColor={mainColor}
                >
                  <ResponsiveText
                    mt="12"
                    mr={isClose(highestMax, MAX) ? 6 : 0}
                    size="xs"
                    whiteSpace="nowrap"
                    textAlign="center"
                    bgColor={colorHint}
                    boxShadow="lg"
                    borderRadius="md"
                    px="1"
                    py="0.5"
                  >
                    {`${maxWord}: ${localFormat(MAX, mainCur, locale)}`}
                  </ResponsiveText>
                </RangeSliderThumb>
              </>
            )}
          </CustomRangeSlider>
        </Box>
      </Box>
    </Box3D>
  );
};

export default LimitsRange;
