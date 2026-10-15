import React from "react";
import { IMakerOffer } from "../../../../types/p2p";
import { HStack } from "@chakra-ui/react";
import { addSpaces } from "../../../../redux/amountsHelper";
import { ResponsiveText } from "../../../../styles/theme/custom";
import { useT } from "../../../../services/i18n";

// Raw courses come as long floats (1.0548523206751055); show 5 significant digits.
const formatCourse = (course?: number | null) => {
  const n = Number(course);
  if (!Number.isFinite(n) || n === 0) return "";
  return addSpaces(String(Number(n.toPrecision(5))));
};

// Empty fields are skipped instead of rendering a label with nothing next to it.
export default function OfferDetails({ offer }: { offer: IMakerOffer }) {
  const t = useT();
  const SIDE_LABEL: Record<string, string> = {
    give: t("мейкер отдаёт", "maker gives"),
    get: t("мейкер получает", "maker gets"),
  };
  const FEE_LABEL: Record<string, string> = {
    percentage: "%",
    give: t("(из суммы отдачи)", "(of the amount given)"),
    get: t("(из суммы получения)", "(of the amount received)"),
  };
  const rows: Array<[string, string]> = [];
  const course = formatCourse(offer.course);
  if (course) rows.push([t("Курс", "Rate"), course]);
  if (offer.min != null || offer.max != null) {
    rows.push([
      t("Лимиты", "Limits"),
      `${addSpaces(String(offer.min ?? ""))} – ${addSpaces(String(offer.max ?? ""))}`,
    ]);
  }
  if (offer.fee_enabled !== false && offer.fee_amount != null && Number(offer.fee_amount) > 0) {
    rows.push([t("Комиссия", "Fee"), `${offer.fee_amount} ${FEE_LABEL[offer.fee_type || ""] || ""}`.trim()]);
  }
  if (offer.side && SIDE_LABEL[offer.side]) rows.push([t("Сторона", "Side"), SIDE_LABEL[offer.side]]);
  return (
    <>
      {rows.map(([label, value]) => (
        <HStack spacing="2" key={label}>
          <ResponsiveText size="sm" color="bg.400" variant="primary">
            {label}
          </ResponsiveText>
          <ResponsiveText size="md" variant="primary">
            {value}
          </ResponsiveText>
        </HStack>
      ))}
    </>
  );
}
