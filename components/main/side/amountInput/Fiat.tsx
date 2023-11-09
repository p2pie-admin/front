import { Fade, Box, Text, HStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { addCommas, R } from "../../../../redux/amountsHelper";

import { useAppSelector } from "../../../../redux/hooks";
import { ILimit } from "../../../../types/rates";
import SideContext from "../../../shared/contexts/SideContext";

const renderHint = (leftPart: string, amount?: number, currency?: string) => {
  if (!amount) return;
  return `${leftPart || ""} ${addCommas(String(R(amount)))} ${currency || ""}`;
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

  const roundedMin = R(min?.[side] || 0);
  const roundedMax = R(max?.[side] || 0);

  return (
    <HStack pos="absolute" top="9" right="0" fontSize="sm" color="bg.500">
      {roundedMin > 0 && value < roundedMin ? (
        <Text>{renderHint("min: ", roundedMin, sideCurrencyCode)}</Text>
      ) : roundedMax > 0 && value > roundedMax ? (
        <Text>{renderHint("max: ", roundedMax, sideCurrencyCode)}</Text>
      ) : (
        <Text>
          {toUsd &&
            sideCurrencyCode !== "USD" &&
            `~ $${R((1 / toUsd) * value, 2)}`}
        </Text>
      )}
    </HStack>
  );
};

export default Fiat;
