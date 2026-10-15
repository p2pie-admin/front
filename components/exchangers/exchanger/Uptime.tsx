import { Box } from "@chakra-ui/react";
import { BoxWrapper } from "../../shared/BoxWrapper";
import { ResponsiveText } from "../../../styles/theme/custom";
import { TitleH2 } from "../../shared/TitleH2";
import { intlLocale, Locale, useLocale } from "../../../services/i18n";

// Response of server GET /history/exchanger/<id>?days=N (summary part).
export type IExchangerUptime = {
  days: number;
  points: number;
  uptimePct: number;
  downHours: number;
  ratesAvg: number;
  lastOk: number | null;
  lastError: string | null;
};

// Show nothing until a day of hourly checks exists.
export const UPTIME_MIN_POINTS = 24;

export const prepareUptime = (raw: unknown): IExchangerUptime | null => {
  const summary = (raw as { summary?: IExchangerUptime } | null)?.summary;
  if (!summary || !Number.isFinite(summary.points)) return null;
  if (summary.points < UPTIME_MIN_POINTS) return null;
  return summary;
};

const formatMoscow = (ms: number | null, locale: Locale = "ru") => {
  if (!ms) return null;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: "Europe/Moscow",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms));
};

const pluralDays = (n: number) =>
  n % 10 === 1 && n % 100 !== 11
    ? "день"
    : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
      ? "дня"
      : "дней";

// Our own monitoring data: how often the exchanger actually answered rate requests.
const Uptime = ({ uptime }: { uptime: IExchangerUptime | null | undefined }) => {
  const locale = useLocale();
  if (!uptime) return null;
  const spanDays = Math.max(1, Math.round(uptime.points / 24));
  const pct = locale === "en" ? uptime.uptimePct.toFixed(1) : uptime.uptimePct.toFixed(1).replace(".", ",");
  const lastOk = formatMoscow(uptime.lastOk, locale);

  const sentences = locale === "en" ? [
    `Over the last ${spanDays} ${spanDays === 1 ? "day" : "days"} the exchanger answered rate requests in ${pct}% of hourly checks` +
      (uptime.downHours
        ? ` (down for about ${uptime.downHours} h in total).`
        : ", with no outages."),
    `On average it returned ${Math.round(uptime.ratesAvg)} exchange directions.`,
    uptime.lastError
      ? `Rates are not responding right now (${uptime.lastError})${lastOk ? `, last successful response ${lastOk} MSK` : ""}.`
      : lastOk
        ? `Last successful check ${lastOk} MSK.`
        : "",
  ].filter(Boolean) : [
    `За последние ${spanDays} ${pluralDays(spanDays)} обменник отвечал на запросы курсов в ${pct} % ежечасных проверок` +
      (uptime.downHours
        ? ` (недоступен суммарно около ${uptime.downHours} ч).`
        : " — без сбоев."),
    `В среднем отдавал ${Math.round(uptime.ratesAvg)} направлений обмена.`,
    uptime.lastError
      ? `Сейчас курсы не отвечают (${uptime.lastError})${lastOk ? `, последний успешный ответ — ${lastOk} МСК` : ""}.`
      : lastOk
        ? `Последняя успешная проверка — ${lastOk} МСК.`
        : "",
  ].filter(Boolean);

  return (
    <BoxWrapper variant="no_contrast">
      <Box w="100%">
        <TitleH2 isLong={false}>
          <>{locale === "en" ? "Availability according to our monitoring" : "Доступность по данным мониторинга"}</>
        </TitleH2>
        <ResponsiveText variant="contrast" whiteSpace="unset">
          {sentences.join(" ")}
        </ResponsiveText>
      </Box>
    </BoxWrapper>
  );
};

export default Uptime;
