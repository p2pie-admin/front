import { Collapse, Text, Grid, HStack, Checkbox } from "@chakra-ui/react";
import { useContext } from "react";
import { capitalize } from "../../../../../components/main/side/pmModalButton/section/PmGroup/helper";
import P2PContext from "../../../../../components/shared/contexts/p2pContext";
import InfoTooltip from "../../../../../components/shared/Info";
import { useAppSelector } from "../../../../../redux/hooks";
import Commission from "./adornments/Commission";

import LimitRecalc from "./adornments/LimitRecalc";
import InputWithSlider from "./InputWithSlider";
import { ResponsiveText } from "../../../../../styles/theme/custom";

const Collapsed = () => {
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
      ? [giveCur, getCur, `sell ${givePmName} for ${getPmName}`]
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
      <ResponsiveText my="4">{`Choose price and limits to ${header}: `}</ResponsiveText>

      <Grid
        ml="auto"
        mr="10%"
        w={{ base: "100%", md: "80%" }}
        gridRowGap="7"
        gridColumnGap="8"
        gridTemplateColumns="3fr 5fr"
        mb="6"
        px="2"
      >
        <InputWithSlider
          id="rate"
          leftSide={rate > 1 ? "" : `1 ${secondaryCur} =`}
          rightSide={rate > 1 ? `${mainCur} = 1 ${secondaryCur}` : mainCur}
          // values={rateValues}
          // toUsd={toUsd}
          // strength={2}
          adornment={<Commission />}
        />
        <InputWithSlider
          id="min"
          leftSide="min: "
          rightSide={mainCur}
          adornment={<LimitRecalc id="min" cur={secondaryCur} />}
          // values={minValues}
          // toUsd={toUsd}
          // strength={4}
        />
        <InputWithSlider
          id="max"
          leftSide="max: "
          rightSide={mainCur}
          adornment={<LimitRecalc id="max" cur={secondaryCur} />}
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

      <HStack
        bgColor="bg.900"
        py="1"
        px="2"
        mt="4"
        borderRadius="lg"
        justifyContent="space-between"
      >
        <Text>Found 18 P2P rates starting from 1 BTC = 18 900 RUB</Text>
        <Text fontWeight="bold">SEE ALL</Text>
      </HStack>
    </Collapse>
  );
};

export default Collapsed;
