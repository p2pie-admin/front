import { Fade, Box, Text, HStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import {
  formatNumberInput,
  roundAmount,
} from "../../../../redux/amountsHelper";

import { useAppSelector } from "../../../../redux/hooks";
import { ILimit } from "../../../../types/rates";
import SideContext from "../../../shared/SideContext";

const symbols = {
  usd: "$",
  rub: "₽",
};

const renderHint = (leftPart: string, amount?: number, currency?: string) => {
  if (!amount) return;
  //const a =  showUSD ? fiat_courses.usd * value : fiat_courses.rub * value,
  return `${leftPart || ""} ${formatNumberInput(String(roundAmount(amount)))} ${
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
  const fiatCurrencyCode = oppositeSideCurrencyCode?.includes("USD")
    ? "rub"
    : "usd";

  const roundedMin = roundAmount(min?.[side] || 0);
  const roundedMax = roundAmount(max?.[side] || 0);

  return (
    <HStack pos="absolute" top="9" right="0" fontSize="sm" color="bg.500">
      {roundedMin > 0 && value < roundedMin ? (
        <Text>{renderHint("min: ", roundedMin, sideCurrencyCode)}</Text>
      ) : roundedMax > 0 && value > roundedMax ? (
        <Text>{renderHint("max: ", roundedMax, sideCurrencyCode)}</Text>
      ) : (
        <Text>
          {renderHint(
            "~",
            fiat_courses && fiat_courses[fiatCurrencyCode] * value,
            symbols[fiatCurrencyCode]
          )}
        </Text>
      )}
    </HStack>
  );
};

export default Fiat;
