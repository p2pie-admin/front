import { Fade, Box, Text, HStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { addSpaces, R } from "../../../../redux/amountsHelper";

import { useAppSelector } from "../../../../redux/hooks";
import { ILimit } from "../../../../types/rates";
import SideContext from "../../../shared/contexts/SideContext";

const renderHint = (leftPart: string, amount?: number, currency?: string) => {
  if (!amount) return;
  return `${leftPart || ""} ${addSpaces(String(R(amount, 3)))} ${
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
  const toUsd = useAppSelector(
    (state) => state.main.currencyConverterRate?.[`${side}ToUSD`]
  );
  const sideCurrencyCode = useAppSelector((state) =>
    state.main[`${side}Pm`]?.currency.code.toUpperCase()
  );

  const Min = min?.[side] || 0;
  const Max = max?.[side] || 0;
  const toUSD = toUsd && sideCurrencyCode !== "USD" ? (1 / toUsd) * value : 0;

  return (
    <HStack fontSize="xs" color="bg.500" justifySelf="end">
      {Min > 0 && value < Min ? (
        <Text>{renderHint("min: ", Min, sideCurrencyCode)}</Text>
      ) : Max > 0 && value > Max ? (
        <Text>{renderHint("max: ", Max, sideCurrencyCode)}</Text>
      ) : (
        <Text>{renderHint("~ $", toUSD)}</Text>
      )}
    </HStack>
  );
};

export default Fiat;
