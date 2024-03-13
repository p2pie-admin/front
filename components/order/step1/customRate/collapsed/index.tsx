import { Collapse, Grid, Box, HStack, Checkbox } from "@chakra-ui/react";
import { useContext } from "react";
import P2PContext from "../../../../../components/shared/contexts/p2pContext";
import InfoTooltip from "../../../../../components/shared/Info";
import { useAppSelector } from "../../../../../redux/hooks";
import Commission from "./adornments/Commission";

import LimitRecalc from "./adornments/LimitRecalc";
import InputWithSlider from "./InputWithSlider";
import { ResponsiveText } from "../../../../../styles/theme/custom";
import { MainState } from "../../../../../redux/mainReducer";
import { ISide } from "../../../../../types/selector";

import FoundRates from "./FoundRates";
import DirDescription from "./DirDescription";

const Collapsed = () => {
  const p2pDirIndex = useContext(P2PContext);

  const rateBiggerThanOne = useAppSelector((state) => {
    const currencyConverterRate =
      p2pDirIndex !== undefined
        ? state.main.p2p.dirs[p2pDirIndex].currencyConverterRate
        : undefined;
    return currencyConverterRate && currencyConverterRate.rate > 1;
  });

  const currencySelector = (side: ISide) => (state: { main: MainState }) =>
    p2pDirIndex !== undefined
      ? state.main.p2p.dirs[p2pDirIndex][side]?.[0]?.currency.code.toUpperCase()
      : "";

  const giveCur = useAppSelector(currencySelector("give"));
  const getCur = useAppSelector(currencySelector("get"));

  const dirSelector = (state: { main: MainState }) =>
    p2pDirIndex !== undefined ? state.main.p2p.dirs[p2pDirIndex] : undefined;

  //const [givePmName, getPmName, expanded] = useAppSelector((state) => {
  const expanded = useAppSelector((state) => {
    const dir = dirSelector(state);
    if (!dir) return false;
    return dir.expanded;
  });

  const minMoreThanMax = useAppSelector((state) => {
    const dir = dirSelector(state);
    const [minVal, maxVal] = [dir?.usersRate?.min[0], dir?.usersRate?.max[0]];
    return !(minVal && maxVal && +maxVal >= +minVal);
  });

  if (
    p2pDirIndex === undefined ||
    rateBiggerThanOne === undefined ||
    !giveCur ||
    !getCur
  )
    return <></>;

  const mainCur = rateBiggerThanOne ? giveCur : getCur;
  const secondaryCur = rateBiggerThanOne ? getCur : giveCur;

  // const rateValues = [defRate * coefficient, defRate * 0.9, defRate * 1.1];
  // const minValues = [toUsdRate * 300, toUsdRate * 100, toUsdRate * 2000];
  // const maxValues = [toUsdRate * 2000, toUsdRate * 100, toUsdRate * 25000];
  // const toUsd =
  //   !giveCur?.includes("USD") && !getCur?.includes("USD")
  //     ? toUsdRate
  //     : undefined;

  return (
    <Collapse in={expanded}>
      <FoundRates />
      {/* <ResponsiveText size="md" mb="4">
        {`Choose a price and limits to ${header}: `}
      </ResponsiveText> */}
      <DirDescription rateBiggerThanOne={rateBiggerThanOne} />
      <Box>
        <Grid
          ml="auto"
          mr={[2, 4, "10%"]}
          w={{ base: "96%", md: "80%" }}
          gridRowGap={["6", "7", "8"]}
          gridColumnGap={["2", "4", "8"]}
          gridTemplateColumns="3fr 5fr"
          mb="6"
          px={["1", "2", "3"]}
        >
          <InputWithSlider
            id="rate"
            leftSide={rateBiggerThanOne ? "" : `1 ${giveCur} =`}
            rightSide={rateBiggerThanOne ? `${giveCur} = 1 ${getCur}` : getCur}
            adornment={<Commission />}
          />
          <InputWithSlider
            id="min"
            leftSide="min: "
            rightSide={mainCur}
            adornment={<LimitRecalc id="min" cur={secondaryCur} />}
            isError={minMoreThanMax}
          />
          <InputWithSlider
            id="max"
            leftSide="max: "
            rightSide={mainCur}
            adornment={<LimitRecalc id="max" cur={secondaryCur} />}
            isError={minMoreThanMax}
          />
        </Grid>
      </Box>
      {/* <HStack justifyContent="end">
        <Checkbox defaultChecked colorScheme="peach">
          <HStack>
            <ResponsiveText>Dynamic rate</ResponsiveText>
            <InfoTooltip text="Your rate will follow the market" />
          </HStack>
        </Checkbox>
      </HStack> */}
    </Collapse>
  );
};

export default Collapsed;
