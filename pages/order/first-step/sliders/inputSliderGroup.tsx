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
import { useState } from "react";
import {
  formatNumberInput,
  roundAmount,
} from "../../../../redux/amountsHelper";
import { useAppSelector } from "../../../../redux/hooks";

const InputWithSlider = ({
  id,
  leftSide,
  rightSide,
  values,
  strength,
  toUsd,
}: {
  id: string;
  leftSide: string;
  rightSide: string;
  values: number[];
  strength: number;
  toUsd?: number;
}) => {
  const shadedColor = useColorModeValue("bg.600", "bg.300");
  const trackColor = useColorModeValue("bg.100", "bg.700");
  const contrastColor = useColorModeValue("bg.900", "bg.100");
  const inputBgColor = useColorModeValue("blackAlpha.200", "blackAlpha.600");
  const primaryColor = useColorModeValue("violet.600", "peach.200");

  const [def, min, max] = values.map((v) => roundAmount(v, strength));

  const valueToSliderValue = (v: number): number =>
    ((v - min) / (max - min)) * 100;
  const sliderValueToValue = (sv: number): number =>
    min + (sv * (max - min)) / 100;
  const format = (v: number): string =>
    formatNumberInput(roundAmount(v, strength));
  const [sliderValue, setSliderValue] = useState(valueToSliderValue(def));

  const valueStr = format(sliderValueToValue(sliderValue));
  const usdValueStr = toUsd
    ? `~ $ ${format(sliderValueToValue(sliderValue) / toUsd)}`
    : "";

  return (
    <HStack px="2" py="2">
      <Box position="relative">
        <HStack color={contrastColor}>
          <Text whiteSpace="nowrap">{leftSide}</Text>
          <NumberInput
            //step={roundAmount(value / 100)}
            //allowMouseWheel
            borderRadius="lg"
            color={primaryColor}
            bgColor={inputBgColor}
            borderColor={`${shadedColor} !important`}
            border="1px solid"
            variant="unstyled"
            position="relative"
            onChange={() => {}}
            value={valueStr}
            keepWithinRange={true}
            clampValueOnBlur={true}
            w={`${valueStr.length * 9.5 + 9.5}px`}
            max={max}
            min={0} // no negative
          >
            <NumberInputField textAlign="end" px="1" value={valueStr} />
          </NumberInput>
          <Text>{rightSide}</Text>
        </HStack>
        <Text position="absolute" right="0" fontSize="xs" color={shadedColor}>
          {usdValueStr}
        </Text>
      </Box>
      <Slider
        aria-label="slider-ex-4"
        value={sliderValue}
        w="250px"
        mx="2"
        onChange={(v) => setSliderValue(v)}
      >
        <SliderTrack bg={trackColor}>
          <SliderFilledTrack bg={primaryColor} />
        </SliderTrack>
        <SliderThumb boxSize={4} />
      </Slider>
    </HStack>
  );
};

export default InputWithSlider;
