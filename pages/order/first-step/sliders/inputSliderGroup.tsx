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
import { useContext, useState } from "react";
import P2PContext from "../../../../components/shared/contexts/p2pContext";
import {
  formatNumberInput,
  roundAmount,
} from "../../../../redux/amountsHelper";
import { useAppSelector } from "../../../../redux/hooks";

const InputWithSlider = ({
  leftSide,
  rightSide,
  values,
  strength,
  toUsd,
}: {
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

  const [value, setValue] = useState(def);
  const valueStr = format(value);

  const usdValueStr = toUsd ? `~ $ ${format(+value / toUsd)}` : "";
  console.log(value, +value);

  return (
    <HStack px="2" py="2">
      <Box position="relative">
        <HStack color={contrastColor}>
          <Text whiteSpace="nowrap">{leftSide}</Text>
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
            w={`${valueStr.length * 9.5 + 10}px`}
            max={max}
            min={0} // no negative
          >
            <NumberInputField textAlign="end" px="1" />
          </NumberInput>
          <Text>{rightSide}</Text>
        </HStack>
        <Text position="absolute" right="0" fontSize="xs" color={shadedColor}>
          {usdValueStr}
        </Text>
      </Box>
      <Slider
        aria-label={"slider " + rightSide}
        value={valueToSliderValue(value)}
        w="250px"
        mx="2"
        focusThumbOnChange={false}
        onChange={(v) => setValue(sliderValueToValue(v))}
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
