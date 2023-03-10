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
import { useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import useSmooth from "../../../services/hooks/smooth";
import { Box3D } from "../../../styles/theme/wrappers";
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
      Object.values({
        ...(state.main.dirParserResp?.uniqueRates || {}),
        ...(state.main.dirParserResp?.bestRates || {}),
      })[state.main.swiperIdVisible]
  );

  const [side, setSide]: [side: "give" | "get", setSide: Function] = useState(
    "get"
  );
  const changeSide = () => setSide(side === "get" ? "give" : "get");

  const [highestMin, highestMax, lowestMin, lowestMax] = useAppSelector(
    (state) => {
      const rates = {
        ...(state.main.dirParserResp?.uniqueRates || {}),
        ...(state.main.dirParserResp?.bestRates || {}),
      }; // объединили все в одно
      if (!Object.keys(rates).length) return [0, 0, 0, 0];
      const allMins = Object.values(rates).map((r) => r.min[side]);
      const allMaxes = Object.values(rates).map((r) => r.max[side]);
      return [
        Math.max(...allMins),
        Math.max(...allMaxes),
        Math.min(...allMins),
        Math.min(...allMaxes),
      ];
    }
  );

  const { min, max } = currentDirRate
    ? currentDirRate
    : { min: { give: 0, get: 0 }, max: { give: 0, get: 0 } };

  const amountOutputs = useAppSelector((state) => state.main.amountOutputs);
  const pmCurrencyName = useAppSelector((state) =>
    state.main[`${side}Pm`]?.currency.code.toUpperCase()
  );

  const stringValue = (amountOutputs && amountOutputs[side]) || "";
  const value = +stringValue.replaceAll(" ", "");
  // const outRange = min && max && (value > max[side] || value < min[side]);

  //Формула для логарифмической шкалы

  const resMin = 45 - 45 ** (1 - min?.[side] / (highestMin - lowestMin));
  const resMax = 45 - 45 ** (1 - max?.[side] / (highestMax - lowestMax));

  // 0-45% для min и 55-100% для max
  if (!min?.[side] || !max?.[side]) return <></>;
  // needMargin если min близок к highestMin && max далек от highestMax
  const needMargin = highestMin / min[side] < 10 && highestMax / max[side] > 10;

  return (
    <Box3D bgColor="bg.900" h="14" mb="4" cursor="pointer">
      <Center>
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
                changeSide={changeSide}
              />
            </RangeSliderThumb>
            <RangeSliderThumb boxSize={2} index={1}>
              <Limit
                label="max"
                value={max[side]}
                needMargin={needMargin}
                pmCurrencyName={pmCurrencyName || ""}
                changeSide={changeSide}
              />
            </RangeSliderThumb>
          </CustomRangeSlider>
        </Box>
      </Center>
    </Box3D>
  );
};

export default LimitsRange;
