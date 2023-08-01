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
import P2PContext from "../../../../components/shared/contexts/p2pContext";
import {
  format,
  formatNumberInput,
  roundAmount,
} from "../../../../redux/amountsHelper";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setP2PUsersRate } from "../../../../redux/mainReducer";
import { IUsersRate } from "../../../../types/p2p";
import Commission from "./Commission";
import Recalc from "./Recalc";

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
  const trackColor = useColorModeValue("bg.100", "bg.700");
  const contrastColor = useColorModeValue("bg.900", "bg.100");
  const inputBgColor = useColorModeValue("blackAlpha.200", "blackAlpha.600");
  const primaryColor = useColorModeValue("violet.600", "peach.200");

  const p2pDirIndex = useContext(P2PContext)!;
  const dispatch = useAppDispatch();

  const [values, toUsd] = useAppSelector((state) => {
    const dirs = state.main.p2p.dirs;
    if (!dirs[p2pDirIndex].usersRate) return [];
    const usersRate = dirs[p2pDirIndex].usersRate!;
    return [usersRate[id], dirs[p2pDirIndex].toUsdRate];
  });

  const [value, min, max] = values || [];

  const valueToSliderValue = (v: number): number =>
    ((v - min) / (max - min)) * 100;
  const sliderValueToValue = (sv: number): number =>
    min + (sv * (max - min)) / 100;

  const valueStr = formatNumberInput(value);
  const usdValueStr = toUsd ? `~ $ ${format(+value / toUsd, 2)}` : "";

  const setValue = (newValue: number) =>
    dispatch(
      setP2PUsersRate({ id, p2pDirIndex, values: [newValue, min, max] })
    );

  return (
    <>
      <Box position="relative">
        <HStack color={contrastColor} justifyContent="space-between">
          <Text whiteSpace="nowrap">{leftSide}</Text>

          <HStack>
            <NumberInput
              //step={roundAmount(value / 100)}
              //allowMouseWheel
              onClick={(e: any) => {
                e.target.select();
              }}
              keepWithinRange={true}
              clampValueOnBlur={true}
              borderRadius="lg"
              color={primaryColor}
              bgColor={inputBgColor}
              borderColor={`${shadedColor} !important`}
              border="1px solid"
              variant="unstyled"
              value={valueStr}
              position="relative"
              onChange={(v) => setValue(+v.replaceAll(" ", ""))}
              minW="90px"
              maxW="110px"
              max={max}
              min={min} // no negative
            >
              <NumberInputField textAlign="end" px="1" />
            </NumberInput>

            <Text>{rightSide}</Text>
          </HStack>
        </HStack>
        <HStack position="absolute" right="0" fontSize="xs" color={shadedColor}>
          {adornment}
          <Text>{usdValueStr}</Text>
        </HStack>
      </Box>
      <Slider
        justifySelf="end"
        aria-label={"slider " + rightSide}
        value={valueToSliderValue(value)}
        mx="2"
        focusThumbOnChange={false}
        onChange={(v) => setValue(sliderValueToValue(v))}
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
