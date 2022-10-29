import { Fade, Flex, Text } from "@chakra-ui/react";
import { useContext, useState } from "react";
import {
  formatNumberInput,
  roundAmount,
} from "../../../../redux/amountsHelper";

import { useAppSelector } from "../../../../redux/hooks";
import { Limit } from "../../../../types/rates";
import SideContext from "../../SideContext";

const symbols = {
  usd: "$",
  rub: "₽",
};

const renderHint = (leftPart: string, currency?: string, hint?: number) => {
  if (!hint) return;
  //const a =  showUSD ? fiat_courses.usd * value : fiat_courses.rub * value,
  return `${leftPart || ""} ${formatNumberInput(
    String(roundAmount(hint, true))
  )} ${currency || ""}`;
};

const Fiat = ({
  value,
  min,
  max,
}: {
  value: number;
  min?: Limit;
  max?: Limit;
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
  const fiatCurrencyCode = oppositeSideCurrencyCode?.includes("USD")
    ? "rub"
    : "usd";

  return (
    <Flex
      pos="absolute"
      top="10"
      right="0"
      fontSize="sm"
      color="bg.700"
      flexDir="row"
    >
      {min && value < min[side] ? (
        <Text color="orange.300" filter="opacity(0.7)">
          {renderHint("min: ", sideCurrencyCode, min[side])}
        </Text>
      ) : max && value > max[side] ? (
        <Text color="orange.300">
          {renderHint("max: ", sideCurrencyCode, max[side])}
        </Text>
      ) : (
        <Text color="bg.700">
          {renderHint(
            "~",
            symbols[fiatCurrencyCode],
            fiat_courses && fiat_courses[fiatCurrencyCode] * value
          )}
        </Text>
      )}
      {/* <Text>{renderHint("max: ", sideCurrencyCode, max && max[side])}</Text> */}
    </Flex>
  );

  return <></>;
};

export default Fiat;
