import { Box, Collapse, VStack, Text } from "@chakra-ui/react";
import { useContext } from "react";
import limits from "../../../../components/main/limits";
import { capitalize } from "../../../../components/main/side/pmModalButton/section/PmGroup/helper";
import P2PContext from "../../../../components/shared/contexts/p2pContext";
import { roundAmount } from "../../../../redux/amountsHelper";
import { useAppSelector } from "../../../../redux/hooks";
import { RegularBox } from "../../../../styles/theme/wrappers";
import InputWithSlider from "./inputSliderGroup";

const Sliders = () => {
  const p2pIndex = useContext(P2PContext);
  const currencyConverterRate = useAppSelector((state) =>
    p2pIndex !== undefined
      ? state.main.p2p.dirs[p2pIndex].currencyConverterRate
      : undefined
  );
  const [giveCur, getCur] = useAppSelector((state) =>
    p2pIndex !== undefined
      ? [
          state.main.p2p.dirs[p2pIndex].give?.currency.code.toUpperCase(),
          state.main.p2p.dirs[p2pIndex].get?.currency.code.toUpperCase(),
        ]
      : []
  );

  const [givePmName, getPmName, isVisible] = useAppSelector((state) => {
    const dir =
      p2pIndex !== undefined ? state.main.p2p.dirs[p2pIndex] : undefined;
    if (!dir) return [];
    return [
      `${capitalize(
        dir.give?.en_name
      )} ${dir.give?.currency.code.toUpperCase()}`,
      `${capitalize(dir.get?.en_name)} ${dir.get?.currency.code.toUpperCase()}`,
      dir.isVisible,
    ];
  });

  if (!currencyConverterRate || !giveCur || !getCur) return <></>;
  const { rate, giveToUSD, getToUSD } = currencyConverterRate;

  const [mainCur, secondaryCur, defRate, toUsdRate, coefficient, header] =
    rate > 1
      ? [
          giveCur,
          getCur,
          rate,
          giveToUSD,
          0.95,
          `buy ${getPmName} for ${givePmName}`,
        ]
      : [
          getCur,
          giveCur,
          1 / rate,
          getToUSD,
          1.05,
          `sell ${givePmName} for ${getPmName}`,
        ];

  const rateValues = [defRate * coefficient, defRate * 0.8, defRate * 1.1];
  const minValues = [toUsdRate * 300, toUsdRate * 100, toUsdRate * 2000];
  const maxValues = [toUsdRate * 2000, toUsdRate * 100, toUsdRate * 25000];
  const toUsd =
    !giveCur?.includes("USD") && !getCur?.includes("USD")
      ? toUsdRate
      : undefined;

  return (
    <Collapse in={isVisible} delay={1000}>
      <Text fontSize="lg" color="bg.300" mt="4">
        {`Choose a price to ${header}: `}
      </Text>
      <Box mt="4" pb="4" pt="1" display="flex" justifyContent="center">
        <VStack alignItems="end" w="fit-content">
          <InputWithSlider
            leftSide={`1 ${secondaryCur} =`}
            rightSide={mainCur}
            values={rateValues}
            toUsd={toUsd}
            strength={2}
          />
          <InputWithSlider
            leftSide="min: "
            rightSide={mainCur}
            values={minValues}
            toUsd={toUsd}
            strength={4}
          />
          <InputWithSlider
            leftSide="max: "
            rightSide={mainCur}
            values={maxValues}
            toUsd={toUsd}
            strength={4}
          />
        </VStack>
      </Box>
    </Collapse>
  );
};

export default Sliders;
