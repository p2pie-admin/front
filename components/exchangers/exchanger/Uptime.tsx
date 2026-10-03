import { Box } from "@chakra-ui/react";
import { BoxWrapper } from "../../shared/BoxWrapper";
import { ResponsiveText } from "../../../styles/theme/custom";
import { TitleH2 } from "../../shared/TitleH2";

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

const formatMoscow = (ms: number | null) => {
  if (!ms) return null;
  return new Intl.DateTimeFormat("ru-RU", {
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
  if (!uptime) return null;
  const spanDays = Math.max(1, Math.round(uptime.points / 24));
  const pct = uptime.uptimePct.toFixed(1).replace(".", ",");
  const lastOk = formatMoscow(uptime.lastOk);

  const sentences = [
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
          <>Доступность по данным мониторинга</>
        </TitleH2>
        <ResponsiveText variant="contrast" whiteSpace="unset">
          {sentences.join(" ")}
        </ResponsiveText>
      </Box>
    </BoxWrapper>
  );
};

export default Uptime;
