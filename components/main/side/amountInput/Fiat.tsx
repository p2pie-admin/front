import { Fade, Box, Text, HStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { addSpaces, R } from "../../../../redux/amountsHelper";

import { useAppSelector } from "../../../../redux/hooks";
import { ILimit } from "../../../../types/rates";
import SideContext from "../../../shared/contexts/SideContext";

const renderHint = (leftPart: string, amount?: number, currency?: string) => {
  if (!amount) return;
  return `${leftPart || ""} ${addSpaces(String(R(amount, 2)))} ${
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
  const toUsd = useAppSelector((state) => state.main.ccRates?.[`${side}ToUSD`]);
  const sideCurrencyCode = useAppSelector((state) =>
    state.main[`${side}Pm`]?.currency.code.toUpperCase()
  );
  const isEdited = useAppSelector((state) => !!state.main.amountInput);

  const Min = R(min?.[side] || 0, 2);
  const Max = R(max?.[side] || 0, 2);
  const toUSD = toUsd && sideCurrencyCode !== "USD" ? (1 / toUsd) * value : 0;

  return (
    <HStack
      fontSize="sm"
      color="bg.500"
      justifySelf="end"
      position="absolute"
      bottom="1"
      right="4"
    >
      {isEdited && Min > 0 && value < Min - Min * 0.01 ? (
        <Text color="red.500">
          {renderHint("min: ", Min, sideCurrencyCode)}
        </Text>
      ) : isEdited && Max > 0 && value > Max + Max * 0.01 ? (
        <Text color="red.500">
          {renderHint("max: ", Max, sideCurrencyCode)}
        </Text>
      ) : (
        <Text>{renderHint("~ $", toUSD)}</Text>
      )}
    </HStack>
  );
};

export default Fiat;
