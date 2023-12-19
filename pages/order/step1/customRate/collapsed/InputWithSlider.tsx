import {
  Box,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { ReactComponentElement, useContext, useEffect, useState } from "react";
import P2PContext from "../../../../../components/shared/contexts/p2pContext";
import { format, addSpaces, R } from "../../../../../redux/amountsHelper";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { setP2PUsersRate } from "../../../../../redux/mainReducer";
import { IUsersRate } from "../../../../../types/p2p";
import Commission from "./adornments/Commission";
import LimitRecalc from "./adornments/LimitRecalc";
import { ResponsiveText } from "../../../../../styles/theme/custom";

const InputWithSlider = ({
  leftSide,
  rightSide,
  id,
  adornment,
}: {
  leftSide: string;
  rightSide: string;
  id: keyof IUsersRate;
  adornment: ReactJSXElement;
}) => {
  const shadedColor = useColorModeValue("bg.500", "bg.400");
  const trackColor = useColorModeValue("bg.300", "bg.900");
  const contrastColor = useColorModeValue("bg.900", "bg.100");
  const inputBgColor = useColorModeValue("blackAlpha.100", "blackAlpha.400");
  const primaryColor = useColorModeValue("violet.600", "peach.200");

  const p2pDirIndex = useContext(P2PContext)!;
  const dispatch = useAppDispatch();

  const dir = useAppSelector((state) => state.main.p2p.dirs[p2pDirIndex]);
  const { usersRate, toUsdRate, give, get } = dir;
  const [giveCode, getCode] = [give?.[0].code, get?.[0].code];

  if (!usersRate) return <></>;

  const [value, startValue, endValue] = usersRate[id] || ["", 0, 0];

  const valueToSliderValue = (v: string): number =>
    ((+v - startValue) / (endValue - startValue)) * 100;
  const sliderValueToValue = (sv: number): number =>
    startValue + (sv * (endValue - startValue)) / 100;

  //const valueStr = addSpaces(value);
  const usdValueStr =
    !giveCode?.includes("USD") && !getCode?.includes("USD") && toUsdRate
      ? `(~$${format(+value / toUsdRate, 2)})`
      : "";

  const setValue = (value: string) =>
    dispatch(
      setP2PUsersRate({
        id,
        p2pDirIndex,
        value,
      })
    );

  return (
    <>
      <Box position="relative">
        <HStack color={contrastColor} justifyContent="space-between">
          <ResponsiveText size="sm">{leftSide}</ResponsiveText>

          <HStack>
            <NumberInput
              //step={R(value / 100)}
              //allowMouseWheel
              onClick={(e: any) => {
                e.target.select();
              }}
              keepWithinRange={true}
              clampValueOnBlur={true}
              borderRadius="md"
              color={primaryColor}
              bgColor={inputBgColor}
              borderColor={`${shadedColor} !important`}
              borderBottom="1px solid"
              variant="unstyled"
              value={addSpaces(value)}
              position="relative"
              onChange={(v) => setValue(v)}
              minW="90px"
              maxW="110px"
              max={endValue * 1.2}
              min={startValue / 1.2} // no negative
            >
              <NumberInputField textAlign="end" px="1" />
            </NumberInput>

            <ResponsiveText size="sm">{rightSide}</ResponsiveText>
          </HStack>
        </HStack>
        <HStack position="absolute" right="0" fontSize="xs" color={shadedColor}>
          {adornment}
          <ResponsiveText size="xs">{usdValueStr}</ResponsiveText>
        </HStack>
      </Box>
      <Slider
        justifySelf="endValue"
        aria-label={"slider " + rightSide}
        value={valueToSliderValue(value)}
        mx="2"
        focusThumbOnChange={false}
        onChange={(v) =>
          setValue(String(R(sliderValueToValue(v), id === "rate" ? 2 : 4)))
        }
      >
        <SliderTrack bg={trackColor}>
          <SliderFilledTrack bg={primaryColor} />
        </SliderTrack>
        <SliderThumb boxSize={4} />
      </Slider>
    </>
  );
};

export default InputWithSlider;
