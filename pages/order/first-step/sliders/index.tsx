import { Box, Collapse, VStack, Text } from "@chakra-ui/react";
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

  if (!currencyConverterRate) return <></>;
  const { rate, giveToUSD, getToUSD } = currencyConverterRate;

  const [mainCur, secondaryCur, defRate, toUsdRate] =
    giveCur && getCur
      ? rate > 1
        ? [giveCur, getCur, rate, giveToUSD]
        : [getCur, giveCur, 1 / rate, getToUSD]
      : ["", "", 0, 0];

  const rateValues = [defRate, defRate * 0.8, defRate * 1.1];
  const minValues = [toUsdRate * 300, toUsdRate * 100, toUsdRate * 2000];
  const maxValues = [toUsdRate * 2000, toUsdRate * 100, toUsdRate * 25000];
  const toUsd =
    !giveCur?.includes("USD") && !getCur?.includes("USD")
      ? toUsdRate
      : undefined;

  return (
    <Box>
      <Text fontSize="lg" color="bg.300" mt="4">
        {`Set your own exchange rate and limits for ${giveCur} → ${getCur}:`}
      </Text>
      <RegularBox
        variant="extra_contrast"
        mt="4"
        pb="4"
        pt="1"
        display="flex"
        justifyContent="center"
      >
        <VStack alignItems="end" w="fit-content">
          <InputWithSlider
            id="rate"
            leftSide={`1 ${secondaryCur} =`}
            rightSide={mainCur}
            values={rateValues}
            toUsd={toUsd}
            strength={2}
          />
          <InputWithSlider
            id="min"
            leftSide="min: "
            rightSide={mainCur}
            values={minValues}
            toUsd={toUsd}
            strength={4}
          />
          <InputWithSlider
            id="max"
            leftSide="max: "
            rightSide={mainCur}
            values={maxValues}
            toUsd={toUsd}
            strength={4}
          />
        </VStack>
      </RegularBox>
    </Box>
  );
};

export default Sliders;
