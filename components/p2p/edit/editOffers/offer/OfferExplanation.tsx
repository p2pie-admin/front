import React from "react";
import { Box } from "@chakra-ui/react";
import { IFullOffer } from "../../../../../types/p2p";
import {
  beautifyAmount,
  curToSymbol,
} from "../../../../../redux/amountsHelper";
import { ResponsiveText } from "../../../../../styles/theme/custom";

type Props = {
  fullOffer: Partial<IFullOffer>;
};

export default function OfferExplanation({ fullOffer }: Props) {
  const offer = fullOffer || {};
  const givePm = offer.givePm;
  const getPm = offer.getPm;
  const giveCur = givePm?.currency?.code?.toUpperCase();
  const getCur = getPm?.currency?.code?.toUpperCase();
  const course = offer.course;
  const feeAmount = offer.fee_amount;
  const feeType = offer.fee_type;
  const activeSide = offer.side;
  const feeEnabled =
    offer.fee_enabled ??
    (feeAmount !== null && feeAmount !== undefined ? true : Boolean(feeType));

  if (!givePm || !getPm || !giveCur || !getCur) return null;

  const normalizedGiveAmount =
    course && activeSide === "give"
      ? course
      : course && activeSide === "get"
        ? 1
        : undefined;
  const normalizedGetAmount =
    course && activeSide === "give"
      ? 1
      : course && activeSide === "get"
        ? 1 / course
        : undefined;

  const givePmRuName = (givePm.ru_name ?? givePm.en_name)?.toLowerCase();
  const getPmRuName = (getPm.ru_name ?? getPm.en_name)?.toLowerCase();

  const explanation =
    normalizedGiveAmount && normalizedGetAmount && course && course >= 1
      ? `Клиент покупает твой ${getPmRuName} по курсу ${beautifyAmount(course, 1)} ${curToSymbol(giveCur)} за 1 ${curToSymbol(getCur)}`
      : normalizedGiveAmount && normalizedGetAmount && course && course < 1
        ? `Клиент продает тебе ${givePmRuName} по курсу 1 ${curToSymbol(giveCur)} за ${beautifyAmount(1 / course, 1)} ${curToSymbol(getCur)}`
        : "Установите курс";

  const feeSuffix = (() => {
    if (!feeEnabled) return "";
    const feeLabel = feeAmount && feeAmount < 0 ? "Доплата" : "Комиссия";
    if (feeAmount === null || feeAmount === undefined || !feeType) {
      return "";
    }
    const feeValue = Math.abs(feeAmount);
    if (feeType === "percentage") {
      return ` • ${feeLabel} ${beautifyAmount(feeValue, 2)}%`;
    }
    if (feeType === "give") {
      return ` • ${feeLabel} ${beautifyAmount(feeValue, 2)} ${curToSymbol(
        giveCur,
      )}`;
    }
    return ` • ${feeLabel} ${beautifyAmount(feeValue, 2)} ${curToSymbol(getCur)}`;
  })();

  return (
    <Box w="100%">
      <ResponsiveText whiteSpace="unset" variant="shaded" mb="2" size="xs">
        {`${explanation}${feeSuffix}`}
      </ResponsiveText>
    </Box>
  );
}
