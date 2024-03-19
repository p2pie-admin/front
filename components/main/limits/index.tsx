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
import { isClose, kFormatter, R, symbols } from "../../../redux/amountsHelper";
import { setAmount } from "../../../redux/mainReducer";
import { RxDragHandleDots2 } from "react-icons/rx";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";

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
  const [showTooltip, setShowTooltip] = useState(false);
  const [side, setSide]: [side: "give" | "get", setSide: Function] = useState(
    "get" as "give" | "get"
  );

  const currentDirRate = useAppSelector(
    (state) => state.main?.dirRates?.[state.main.swiperIdVisible]
  );

  // const pmCurrencyName = useAppSelector(
  //   (state) => state.main[`${side}Pm`]?.currency.code.toUpperCase() || ""
  // );

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

  const stick = (a: number) =>
    isClose(MIN, a) ? MIN : isClose(MAX, a) ? MAX : a;

  const stickyAmount = stick(amount);

  const mainColor = useColorModeValue("violet.600", "peach.200");
  const [primary300, secondary600] = useToken("colors", [
    "peach.300",
    "violet.600",
  ]);
  const colorKey = useColorModeValue(secondary600, primary300);
  const color1 = useColorModeValue("bg.200", "bg.800");
  const color2 = useColorModeValue("bg.10", "bg.900");
  const color3 = useColorModeValue("bg.100", "bg.800");
  const color4 =
    stickyAmount >= MIN && stickyAmount <= MAX ? mainColor : "bg.600";
  const shake = keyframes`
  from {transform: translateX(-5px)}
  to {transform: translateX(0)}
  `;
  const shakeAnimation = `${shake} infinite 1s ease-in-out alternate`;

  const localFormat = (n: number) => {
    const cur = mainCur.toLocaleLowerCase() as keyof typeof symbols;
    return `${symbols[cur] || ""} ${kFormatter(n)}`;
  };

  if (!MIN || !MAX) return <></>;
  return (
    <Box3D py="3" my={[2, 3, 4]} cursor="pointer" display="flex" flexDir="row">
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
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {/* <Tooltip
              hasArrow
              bg={color2}
              borderRadius="2xl"
              color={color4}
              placement="top"
              isOpen={showTooltip}
              label={`${kFormatter(stickyAmount)} ${giveCur}`}
            > */}
            <SliderThumb
              boxSize={8}
              bgColor="transparent"
              position="relative"
              boxShadow="none"
            >
              <Box
                w="5"
                h="3"
                position="relative"
                borderRadius="md"
                bgColor={mainColor}
                boxShadow={`0 0 10px -2px ${colorKey}`}
                color={color3}
                as={RxDragHandleDots2}
              />
              <ResponsiveText
                size="xs"
                position="absolute"
                top="22px"
                color={mainColor}
                whiteSpace="nowrap"
              >
                {localFormat(stickyAmount)}
              </ResponsiveText>
              <Box
                position="absolute"
                color={mainColor}
                right={stickyAmount <= MAX ? "-5" : "6"}
                zIndex="5"
                animation={shakeAnimation}
              >
                {stickyAmount >= MIN && stickyAmount <= MAX ? (
                  <></>
                ) : stickyAmount <= MAX ? (
                  <BsArrowRightShort size="1.5rem" />
                ) : (
                  <BsArrowLeftShort size="1.5rem" />
                )}
              </Box>
            </SliderThumb>
            {/* </Tooltip> */}
            <SliderTrack bgColor="transparent"></SliderTrack>
          </Slider>
        </Box>

        <Box w="98%" pointerEvents="none" color="bg.500">
          <CustomRangeSlider resMin={percMin} resMax={percMax}>
            <RangeSliderTrack bgColor={color1}>
              <RangeSliderFilledTrack bgColor={color4} />
            </RangeSliderTrack>
            {percMax - percMin < 25 ? (
              <Flex
                justifyContent="center"
                position="absolute"
                minW="100px"
                maxW="100px"
                minH="20"
                left={`calc(${smoothCenter.toFixed(0)}% - 50px)`}
              >
                <Box h="fit-content" zIndex="5" mt="-7">
                  <ResponsiveText size="xs" color="bg.500">
                    {MIN == MAX
                      ? localFormat(MIN)
                      : `${localFormat(MIN)} — ${localFormat(MAX)}`}
                  </ResponsiveText>
                </Box>
              </Flex>
            ) : (
              <>
                <RangeSliderThumb boxSize={1} index={0} zIndex="2">
                  <ResponsiveText
                    mt="-9"
                    size="xs"
                    whiteSpace="nowrap"
                    textAlign="center"
                  >
                    {localFormat(MIN)}
                  </ResponsiveText>
                </RangeSliderThumb>

                <RangeSliderThumb boxSize={1} index={1} zIndex="1">
                  <ResponsiveText
                    mt="-9"
                    size="xs"
                    whiteSpace="nowrap"
                    textAlign="center"
                  >
                    {localFormat(MAX)}
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
