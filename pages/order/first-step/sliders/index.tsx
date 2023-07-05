import { Box, Collapse, Text } from "@chakra-ui/react";
import limits from "../../../../components/main/limits";
import { roundAmount } from "../../../../redux/amountsHelper";
import { useAppSelector } from "../../../../redux/hooks";
import { RegularBox } from "../../../../styles/theme/wrappers";
import InputWithSlider from "./inputSliderGroup";

const Sliders = () => {
  const currencyConverterRate = useAppSelector(
    (state) => state.main.currencyConverterRate
  );
  const [giveCur, getCur] = useAppSelector((state) => [
    state.main.givePm?.currency.code?.toUpperCase(),
    state.main.getPm?.currency.code?.toUpperCase(),
  ]);
  let rateValues = [0, 0, 0];
  let minValues = [0, 0, 0];
  let maxValues = [0, 0, 0];

  if (!currencyConverterRate) return <></>;
  const { rate, giveToUSD, getToUSD } = currencyConverterRate;
  const r = rate > 1 ? rate : 1 / rate;
  rateValues = [r * 0.95, r * 0.8, r * 1.1];
  minValues = [getToUSD * 300, getToUSD * 100, getToUSD * 2000];
  maxValues = [getToUSD * 2000, getToUSD * 100, getToUSD * 25000];

  const [mainCur, secondaryCur] =
    giveCur && getCur
      ? rate > 1
        ? [giveCur, getCur]
        : [getCur, giveCur]
      : ["", ""];

  return (
    <Box>
      <Text fontSize="lg" color="bg.300" mt="4">
        Set your own exchange rate and limits for BTC/RUB:
      </Text>
      <RegularBox variant="extra_contrast" my="4">
        <InputWithSlider
          leftSide={`1 ${secondaryCur} =`}
          rightSide={mainCur}
          values={rateValues}
          strength={2}
        />
        <InputWithSlider
          leftSide="min: "
          rightSide={mainCur}
          values={minValues}
          strength={4}
        />
        <InputWithSlider
          leftSide="max: "
          rightSide={mainCur}
          values={maxValues}
          strength={4}
        />
      </RegularBox>
    </Box>
  );
};

export default Sliders;
