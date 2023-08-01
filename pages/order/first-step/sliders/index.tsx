import {
  Box,
  Collapse,
  VStack,
  Text,
  Grid,
  HStack,
  Checkbox,
} from "@chakra-ui/react";
import { useContext } from "react";
import limits from "../../../../components/main/limits";
import { capitalize } from "../../../../components/main/side/pmModalButton/section/PmGroup/helper";
import P2PContext from "../../../../components/shared/contexts/p2pContext";
import InfoTooltip from "../../../../components/shared/Info";
import { roundAmount } from "../../../../redux/amountsHelper";
import { useAppSelector } from "../../../../redux/hooks";
import { RegularBox } from "../../../../styles/theme/wrappers";
import Commission from "./Commission";
import InputWithSlider from "./InputSliderGroup";
import Recalc from "./Recalc";

const Sliders = () => {
  const p2pDirIndex = useContext(P2PContext);
  const currencyConverterRate = useAppSelector((state) =>
    p2pDirIndex !== undefined
      ? state.main.p2p.dirs[p2pDirIndex].currencyConverterRate
      : undefined
  );
  const [giveCur, getCur] = useAppSelector((state) =>
    p2pDirIndex !== undefined
      ? [
          state.main.p2p.dirs[
            p2pDirIndex
          ].give?.[0]?.currency.code.toUpperCase(),
          state.main.p2p.dirs[
            p2pDirIndex
          ].get?.[0]?.currency.code.toUpperCase(),
        ]
      : []
  );

  const [givePmName, getPmName, isVisible] = useAppSelector((state) => {
    const dir =
      p2pDirIndex !== undefined ? state.main.p2p.dirs[p2pDirIndex] : undefined;
    if (!dir) return [];
    return [
      `${capitalize(
        dir.give?.[0]?.en_name
      )} ${dir.give?.[0]?.currency.code.toUpperCase()}`,
      `${capitalize(
        dir.get?.[0]?.en_name
      )} ${dir.get?.[0]?.currency.code.toUpperCase()}`,
      dir.isVisible,
    ];
  });
  console.log(
    p2pDirIndex === undefined,
    !currencyConverterRate,
    !giveCur,
    !getCur
  );
  if (
    p2pDirIndex === undefined ||
    !currencyConverterRate ||
    !giveCur ||
    !getCur
  )
    return <></>;
  const { rate, giveToUSD, getToUSD } = currencyConverterRate;

  const [mainCur, secondaryCur, header] =
    rate > 1
      ? [giveCur, getCur, `buy ${getPmName} with ${givePmName}`]
      : [getCur, giveCur, `sell ${givePmName} for ${getPmName}`];

  // const rateValues = [defRate * coefficient, defRate * 0.9, defRate * 1.1];
  // const minValues = [toUsdRate * 300, toUsdRate * 100, toUsdRate * 2000];
  // const maxValues = [toUsdRate * 2000, toUsdRate * 100, toUsdRate * 25000];
  // const toUsd =
  //   !giveCur?.includes("USD") && !getCur?.includes("USD")
  //     ? toUsdRate
  //     : undefined;

  return (
    <Collapse in={isVisible} delay={1000}>
      <Text fontSize={{ base: "md", md: "lg" }} color="bg.300" my="4">
        {`Choose a price to ${header}: `}
      </Text>
      <Grid
        ml="auto"
        mr="10%"
        w={{ base: "100%", md: "80%" }}
        gridRowGap="6"
        gridColumnGap="8"
        gridTemplateColumns="3fr 5fr"
        mb="4"
        px="2"
      >
        <InputWithSlider
          id="rate"
          leftSide={`1 ${secondaryCur} =`}
          rightSide={mainCur}
          // values={rateValues}
          // toUsd={toUsd}
          // strength={2}
          adornment={<Commission />}
        />
        <InputWithSlider
          id="min"
          leftSide="min: "
          rightSide={mainCur}
          adornment={<Recalc id="min" cur={secondaryCur} />}
          // values={minValues}
          // toUsd={toUsd}
          // strength={4}
        />
        <InputWithSlider
          id="max"
          leftSide="max: "
          rightSide={mainCur}
          adornment={<Recalc id="max" cur={secondaryCur} />}
          // values={maxValues}
          // toUsd={toUsd}
          // strength={4}
        />
      </Grid>
      <HStack>
        <Checkbox defaultChecked>
          <HStack>
            <Text>Dynamic rate</Text>
            <InfoTooltip text="Your rate will follow the market" />
          </HStack>
        </Checkbox>
      </HStack>
    </Collapse>
  );
};

export default Sliders;
