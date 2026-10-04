import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { ResponsiveText } from "../../styles/theme/custom";
import { buildRateString } from "../shared/helper";
import { IDirHistory, IDirHistoryPoint } from "./ssrRates";

const DAY_MS = 24 * 60 * 60 * 1000;
const WIDTH = 320;
const HEIGHT = 64;
const PAD = 4;

// The rate as users read it: "1 BTC = X RUB" when course < 1, else "X give = 1 get".
const displayed = (course: number) => (course < 1 ? 1 / course : course);

const pct = (from: number, to: number) =>
  from > 0 ? ((to - from) / from) * 100 : 0;

const signed = (value: number) =>
  `${value > 0 ? "+" : ""}${value.toFixed(2).replace(".", ",")} %`;

const dayLabel = (ms: number) =>
  new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "numeric",
    month: "short",
  }).format(new Date(ms));

// Inline SVG sparkline of the best displayed rate; rendered on the server, no JS needed.
const Sparkline = ({
  points,
  stroke,
}: {
  points: IDirHistoryPoint[];
  stroke: string;
}) => {
  const values = points.map((p) => displayed(p.best));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const t0 = points[0].t;
  const t1 = points[points.length - 1].t || t0 + 1;
  const tspan = t1 - t0 || 1;
  const coords = points.map((p, i) => {
    const x = PAD + ((p.t - t0) / tspan) * (WIDTH - PAD * 2);
    const y = HEIGHT - PAD - ((values[i] - min) / span) * (HEIGHT - PAD * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width="100%"
      height={HEIGHT}
      role="img"
      aria-label="График лучшего курса за период"
      preserveAspectRatio="none"
    >
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={coords.join(" ")}
      />
    </svg>
  );
};

const RateHistory = ({
  history,
  giveCur,
  getCur,
}: {
  history: IDirHistory | null | undefined;
  giveCur: string;
  getCur: string;
}) => {
  const stroke = useColorModeValue("#6b46c1", "#f6ad55");
  const frameBg = useColorModeValue("blackAlpha.50", "whiteAlpha.50");
  const frameBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
  if (!history || !history.summary || history.points.length < 2) return null;

  const { points, summary } = history;
  const last = points[points.length - 1];
  const first = points[0];
  const dayAgo = points.find((p) => p.t >= last.t - DAY_MS) || first;
  const spanDays = Math.max(1, Math.round((last.t - first.t) / DAY_MS));

  // Range of the best offer, expressed as the user reads it.
  const bestHigh = buildRateString({ course: summary.bestMin, giveCur, getCur });
  const bestLow = buildRateString({ course: summary.bestMax, giveCur, getCur });
  const now = buildRateString({ course: last.best, giveCur, getCur });
  const change24h =
    dayAgo !== last ? pct(displayed(dayAgo.best), displayed(last.best)) : null;
  const changePeriod = pct(displayed(first.best), displayed(last.best));

  const sentences = [
    `Динамика за ${spanDays} ${spanDays === 1 ? "день" : spanDays < 5 ? "дня" : "дней"} (${dayLabel(
      first.t,
    )} — ${dayLabel(last.t)}): лучшее предложение колебалось от ${bestLow} до ${bestHigh}.`,
    `Сейчас ${now}${
      change24h !== null ? `, за сутки ${signed(change24h)}` : ""
    }, за период ${signed(changePeriod)}.`,
    `В среднем направление обслуживали ${Math.round(summary.offersAvg)} ${
      Math.round(summary.offersAvg) === 1 ? "обменник" : "обменников"
    } (от ${summary.offersMin} до ${summary.offersMax}). Снимки берутся раз в час.`,
  ];

  const high = buildRateString({ course: summary.bestMin, giveCur, getCur });
  const low = buildRateString({ course: summary.bestMax, giveCur, getCur });

  return (
    <Box mb="3">
      <ResponsiveText variant="contrast" whiteSpace="unset">
        {sentences.join(" ")}
      </ResponsiveText>
      {/* Framed like the other cards: label row, the line, then the date range underneath. */}
      <Box
        mt="3"
        maxW={`${WIDTH + 32}px`}
        p="3"
        borderRadius="xl"
        bg={frameBg}
        border="1px solid"
        borderColor={frameBorder}
      >
        <Flex justify="space-between" mb="1" gap="2" wrap="wrap">
          <ResponsiveText size="xs" variant="no_contrast">
            Лучший курс, почасово
          </ResponsiveText>
          <ResponsiveText size="xs" variant="no_contrast" whiteSpace="nowrap">
            {`${low} … ${high}`}
          </ResponsiveText>
        </Flex>
        <Sparkline points={points} stroke={stroke} />
        <Flex justify="space-between" mt="1">
          <ResponsiveText size="xs" variant="no_contrast">
            {dayLabel(first.t)}
          </ResponsiveText>
          <ResponsiveText size="xs" variant="no_contrast">
            {dayLabel(last.t)}
          </ResponsiveText>
        </Flex>
      </Box>
    </Box>
  );
};

export default RateHistory;
