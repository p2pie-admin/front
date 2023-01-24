import { Fade, Box, Text, HStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import {
  formatNumberInput,
  roundAmount,
} from "../../../../redux/amountsHelper";

import { useAppSelector } from "../../../../redux/hooks";
import { ILimit } from "../../../../types/rates";
import SideContext from "../../SideContext";

const symbols = {
  usd: "$",
  rub: "₽",
};

const renderHint = (leftPart: string, currency?: string, hint?: number) => {
  if (!hint) return;
  //const a =  showUSD ? fiat_courses.usd * value : fiat_courses.rub * value,
  return `${leftPart || ""} ${formatNumberInput(String(roundAmount(hint)))} ${
    currency || ""
  }`;
};

const Fiat = ({
  value,
  min,
  max,
}: {
  value: number;
  min?: ILimit;
  max?: ILimit;
}) => {
  const side = useContext(SideContext) as "give" | "get";
  const fiat_courses = useAppSelector((state) => state.main[`${side}Pm`]?.fiat);
  const sideCurrencyCode = useAppSelector((state) =>
    state.main[`${side}Pm`]?.currency.code.toUpperCase()
  );
  const oppositeSideCurrencyCode = useAppSelector((state) =>
    state.main[
      `${side === "give" ? "get" : "give"}Pm`
    ]?.currency.code.toUpperCase()
  );
  const fiatCurrencyCode = oppositeSideCurrencyCode?.includes("RUB")
    ? "usd"
    : "rub";

  const roundedMin = roundAmount(min?.[side] || 0);
  const roundedMax = roundAmount(max?.[side] || 0);
  return <></>;
};

export default Fiat;

// <HStack
// pos="absolute"
// top="10"
// right="0"
// fontSize="sm"
// color="bg.700"
// >
// {roundedMin > 0 && roundedValue < roundedMin ? (
//   <Text color="bg.300">
//     {renderHint("min: ", sideCurrencyCode, roundedMin)}
//   </Text>
// ) : roundedMax > 0 && roundedValue > roundedMax] ? (
//   <Text color="bg.300">
//     {renderHint("max: ", sideCurrencyCode, roundedMax)}
//   </Text>
// ) : (
//   <Text color="bg.400">
//     {renderHint(
//       "~",
//       symbols[fiatCurrencyCode],
//       fiat_courses && fiat_courses[fiatCurrencyCode] * value
//     )}
//   </Text>
// )
// </HStack>
