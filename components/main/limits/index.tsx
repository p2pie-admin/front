import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Box,
  Flex,
  Center,
  useToken,
  Text,
} from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { useAppSelector } from "../../../redux/hooks";
import useSmooth from "../../../services/hooks/smooth";
import side from "../side";
import Limit from "./Limit";

const CustomRangeSlider = ({
  resMin,
  resMax,
  children,
}: {
  resMin: number;
  resMax: number;
  children: ReactJSXElement[];
}) => {
  const smoothResMin = useSmooth(resMin);
  const smoothResMax = useSmooth(resMax);
  return (
    <RangeSlider
      value={[0 + smoothResMin, 55 + smoothResMax]}
      aria-label={["min", "max"]}
    >
      {children}
    </RangeSlider>
  );
};

const LimitsRange = () => {
  const currentDirRate = useAppSelector(
    (state) =>
      Object.values(state.main.dirParserResp?.uniqueRates || {})[
        state.main.swiperIdVisible
      ]
  );
  const side = "give";

  const [highestMin, highestMax] = useAppSelector((state) => {
    const rates = {
      ...(state.main.dirParserResp?.uniqueRates || {}),
      ...state.main.dirParserResp?.bestRates,
    };
    if (!Object.keys(rates).length) return [0, 0];
    const allMins = Object.values(rates).map((r) => r.min[side]);
    const allMaxes = Object.values(rates).map((r) => r.max[side]);
    return [Math.max(...allMins), Math.max(...allMaxes)];
  });

  const { min, max } = currentDirRate
    ? Object.values(currentDirRate)[0]
    : { min: { give: 0, get: 0 }, max: { give: 0, get: 0 } };

  const amountOutputs = useAppSelector((state) => state.main.amountOutputs);
  const pmCurrencyName = useAppSelector((state) =>
    state.main[`${side}Pm`]?.currency.code.toUpperCase()
  );

  const stringValue = amountOutputs[side] || "";
  const value = +stringValue.replaceAll(" ", "");
  // const outRange = min && max && (value > max[side] || value < min[side]);

  //Формула для логарифмической шкалы

  const resMin = 45 - 45 ** (1 - min[side] / highestMin);
  const resMax = 45 - 45 ** (1 - max[side] / highestMax);

  const [bg900] = useToken("colors", ["bg.700"]);
  // 0-45% для min и 55-100% для max
  if (!min[side] || !max[side]) return <></>;
  // needMargin если min близок к highestMin && max далек от highestMax
  const needMargin = highestMin / min[side] < 10 && highestMax / max[side] > 10;

  return (
    <Center mt="2" pb="5" border={`solid 1px ${bg900}`} borderRadius="xl">
      <Box w="86%">
        <CustomRangeSlider resMin={resMin} resMax={resMax}>
          <RangeSliderTrack>
            <RangeSliderFilledTrack bgColor="orange.300" />
          </RangeSliderTrack>
          <RangeSliderThumb boxSize={2} index={0}>
            <Limit
              label="min"
              value={min[side]}
              needMargin={needMargin}
              pmCurrencyName={pmCurrencyName || ""}
            />
          </RangeSliderThumb>
          <RangeSliderThumb boxSize={2} index={1}>
            <Limit
              label="max"
              value={max[side]}
              needMargin={needMargin}
              pmCurrencyName={pmCurrencyName || ""}
            />
          </RangeSliderThumb>
        </CustomRangeSlider>
      </Box>
    </Center>
  );
};

export default LimitsRange;
