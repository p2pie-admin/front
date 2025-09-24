import course from "next-seo/lib/jsonld/course";
import React from "react";
import {
  addSpaces,
  curToSymbol,
  localFormat,
  R,
} from "../../../../redux/amountsHelper";
import { ResponsiveText } from "../../../../styles/theme/custom";
import { IMassDirTextId, IMassRate } from "../../../../types/mass";
import { VStack } from "@chakra-ui/react";

export default function MassRateAmount({
  course,
  massAmount,
  massDirTextId,
}: {
  course: number;
  massAmount: { code?: string; value: string };
  massDirTextId: IMassDirTextId;
}) {
  const { code, currency } = massDirTextId;
  const symbol = curToSymbol(currency.code);

  if (massAmount.value == "") {
    return (
      <ResponsiveText size="sm" mt="1" variant="contrast">
        {`${1} ${code} ≈ ${
          course < 1 ? addSpaces(R(1 / course, 1)) : addSpaces(R(course, 1))
        } ${symbol}`}
      </ResponsiveText>
    );
  }

  if (code == massAmount.code) {
    return (
      <ResponsiveText size="sm" mt="1" variant="contrast">
        {`${addSpaces(R(Number(massAmount.value), 1))} ${code} ≈ ${
          course < 1
            ? addSpaces(R((1 / course) * Number(massAmount.value), 1))
            : addSpaces(R(course * Number(massAmount.value), 1))
        } ${symbol}`}
      </ResponsiveText>
    );
  }
  // input fiat
  return (
    <ResponsiveText size="sm" mt="1" variant="contrast">
      {`${
        course < 1
          ? addSpaces(R(course * Number(massAmount.value), 1))
          : addSpaces(R((1 / course) * Number(massAmount.value), 1))
      } ${code} ≈ ${addSpaces(R(Number(massAmount.value), 1))}  ${symbol}`}
    </ResponsiveText>
  );
}
