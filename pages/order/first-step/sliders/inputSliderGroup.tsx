import {
  HStack,
  Input,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
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
}: {
  leftSide: string;
  rightSide: string;
  values: number[];
  strength: number;
}) => {
  const [def, min, max] = values.map((v) => roundAmount(v, strength));

  const valueToSliderValue = (v: number) => ((v - min) / (max - min)) * 100;
  const sliderValueToValue = (sv: number) =>
    formatNumberInput(roundAmount(min + (sv * (max - min)) / 100, strength));

  const [sliderValue, setSliderValue] = useState(valueToSliderValue(def));

  const valueStr = sliderValueToValue(sliderValue);

  return (
    <HStack justifyContent="end" p="2">
      <Text>{leftSide}</Text>
      <Input
        bgColor="blackAlpha.500"
        px="1"
        w={`${valueStr.length * 9 + 10}px`}
        variant="unstyled"
        placeholder="Enter amount"
        value={valueStr}
      />
      <Text>{rightSide}</Text>
      <Slider
        aria-label="slider-ex-4"
        value={sliderValue}
        w="300px"
        mx="2"
        onChange={(v) => setSliderValue(v)}
      >
        <SliderTrack bg="bg.600">
          <SliderFilledTrack bg="peach.200" />
        </SliderTrack>
        <SliderThumb boxSize={4} />
      </Slider>
    </HStack>
  );
};

export default InputWithSlider;
