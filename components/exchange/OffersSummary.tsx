import { Box } from "@chakra-ui/react";
import { ResponsiveText } from "../../styles/theme/custom";
import { buildRateString } from "../shared/helper";
import { formatAmount, formatMoscowTime, IRatesSummary } from "./ssrRates";
import { Locale, useLocale } from "../../services/i18n";

const pluralize = (count: number, one: string, few: string, many: string) => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
};

const buildEnSentences = (
  summary: IRatesSummary,
  when: string | null,
  best: string,
  med: string,
  worst: string,
  getCur: string,
  smallCur: string,
  locale: Locale,
) => {
  const sentences: string[] = [
    `${when ? `As of ${when} (Moscow time), ` : "Right now "}this direction has ${summary.count} ${
      summary.count === 1 ? "offer" : "offers"
    }.`,
  ];
  if (best) {
    sentences.push(
      summary.count > 1
        ? `Best rate: ${best}, median: ${med}, worst: ${worst} (spread ${summary.spreadPercent.toFixed(1)}%).`
        : `Rate: ${best}.`,
    );
  }
  if (summary.totalReserveGet > 0) {
    sentences.push(`Total exchanger reserve: ${formatAmount(summary.totalReserveGet, getCur, locale)}.`);
  }
  if (summary.minAmount) {
    sentences.push(`Minimum exchange amount: from ${formatAmount(summary.minAmount, smallCur, locale)}.`);
  }
  return sentences;
};

// One factual paragraph built from live data: what a crawler (and a hurried user)
// should learn about this direction without scrolling the offers.
const OffersSummary = ({
  summary,
  giveCur,
  getCur,
}: {
  summary: IRatesSummary | null | undefined;
  giveCur: string;
  getCur: string;
}) => {
  const locale = useLocale();
  if (!summary || !summary.count) return null;

  const when = formatMoscowTime(summary.updatedAt, locale);
  const best = buildRateString({ course: summary.bestCourse, giveCur, getCur });
  const med = buildRateString({ course: summary.medianCourse, giveCur, getCur });
  const worst = buildRateString({ course: summary.worstCourse, giveCur, getCur });
  const smallCur = summary.bestCourse > 1 ? giveCur : getCur;

  const sentences: string[] = [];
  if (locale === "en") {
    sentences.push(...buildEnSentences(summary, when, best, med, worst, getCur, smallCur, locale));
  } else {
    sentences.push(
      `${when ? `На ${when} (МСК) ` : "Сейчас "}по этому направлению доступно ${
        summary.count
      } ${pluralize(summary.count, "предложение", "предложения", "предложений")}.`,
    );
    if (best) {
      sentences.push(
        summary.count > 1
          ? `Лучший курс: ${best}, медианный: ${med}, худший: ${worst} (разброс ${summary.spreadPercent.toFixed(
              1,
            )} %).`
          : `Курс: ${best}.`,
      );
    }
    if (summary.totalReserveGet > 0) {
      sentences.push(
        `Суммарный резерв обменников: ${formatAmount(summary.totalReserveGet, getCur)}.`,
      );
    }
    if (summary.minAmount) {
      sentences.push(
        `Минимальная сумма обмена — от ${formatAmount(summary.minAmount, smallCur)}.`,
      );
    }
  }

  return (
    <Box mb="3">
      <ResponsiveText variant="contrast" whiteSpace="unset">
        {sentences.join(" ")}
      </ResponsiveText>
    </Box>
  );
};

export default OffersSummary;
