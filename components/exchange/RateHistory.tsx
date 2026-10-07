import { Box, Flex, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import { ResponsiveText } from "../../styles/theme/custom";
import { buildRateString } from "../shared/helper";
import { format } from "../../redux/amountsHelper";
import { IDirHistory, IDirHistoryPoint } from "./ssrRates";

const DAY_MS = 24 * 60 * 60 * 1000;
// The line/area SVG is stretched to the container (preserveAspectRatio="none"); everything that must not be
// distorted (labels, dots, tooltip) is HTML positioned in percent on top of it, so the server render is final.
const VB_W = 1000;
const VB_H = 100;
const CHART_H = { base: "180px", lg: "240px" };

// The rate as users read it: "1 BTC = X RUB" when course < 1, else "X give = 1 get".
const displayed = (course: number) => (course < 1 ? 1 / course : course);

const pct = (from: number, to: number) =>
  from > 0 ? ((to - from) / from) * 100 : 0;

const signed = (value: number) =>
  `${value > 0 ? "+" : ""}${value.toFixed(2).replace(".", ",")} %`;

const fmtDate = (ms: number, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("ru-RU", { timeZone: "Europe/Moscow", ...opts }).format(
    new Date(ms),
  );
const dayLabel = (ms: number) => fmtDate(ms, { day: "numeric", month: "short" });
const timeLabel = (ms: number) =>
  fmtDate(ms, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

// Moscow midnights inside [t0, t1] for the vertical day ticks (MSK = UTC+3, no DST).
const MSK_OFFSET = 3 * 60 * 60 * 1000;
const midnights = (t0: number, t1: number) => {
  const out: number[] = [];
  let m = Math.ceil((t0 + MSK_OFFSET) / DAY_MS) * DAY_MS - MSK_OFFSET;
  for (; m <= t1; m += DAY_MS) out.push(m);
  return out;
};

// Three or four "round" grid values between min and max.
const niceTicks = (min: number, max: number) => {
  const span = max - min || Math.abs(max) || 1;
  const raw = span / 3;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((k) => k * pow).find((s) => span / s <= 4) || raw;
  const ticks: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) ticks.push(v);
  return ticks;
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <Box
    px="3"
    py="2"
    borderRadius="lg"
    bg="blackAlpha.200"
    _dark={{ bg: "whiteAlpha.50" }}
  >
    <ResponsiveText size="xs" variant="no_contrast">
      {label}
    </ResponsiveText>
    <ResponsiveText size="sm" variant="contrast" fontWeight="semibold" whiteSpace="nowrap">
      {value}
    </ResponsiveText>
  </Box>
);

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
  const gridColor = useColorModeValue("rgba(0,0,0,0.08)", "rgba(255,255,255,0.07)");
  const frameBg = useColorModeValue(
    "linear-gradient(180deg, rgba(107,70,193,0.06) 0%, rgba(0,0,0,0.02) 100%)",
    "linear-gradient(180deg, rgba(246,173,85,0.07) 0%, rgba(255,255,255,0.02) 100%)",
  );
  const frameBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
  const tipBg = useColorModeValue("white", "#2a2725");
  const plotRef = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  const geo = useMemo(() => {
    const points = history?.points || [];
    if (points.length < 2) return null;
    const values = points.map((p) => displayed(p.best));
    const vMin = Math.min(...values);
    const vMax = Math.max(...values);
    const pad = (vMax - vMin || vMax * 0.001 || 1) * 0.12;
    const lo = vMin - pad;
    const hi = vMax + pad;
    const t0 = points[0].t;
    const t1 = points[points.length - 1].t;
    const tspan = t1 - t0 || 1;
    const x = (t: number) => ((t - t0) / tspan) * 100; // percent
    const y = (v: number) => ((hi - v) / (hi - lo)) * 100; // percent from top
    const xy = points.map((p, i) => [x(p.t), y(values[i])] as const);
    const line = xy
      .map(([px, py], i) => `${i ? "L" : "M"}${((px * VB_W) / 100).toFixed(1)},${py.toFixed(2)}`)
      .join(" ");
    const area = `${line} L${VB_W},${VB_H} L0,${VB_H} Z`;
    const iMax = values.indexOf(vMax);
    const iMin = values.indexOf(vMin);
    return { points, values, vMin, vMax, t0, t1, x, y, xy, line, area, iMax, iMin, lo, hi };
  }, [history]);

  if (!history || !history.summary || !geo) return null;

  const { points, values, summary } = { ...geo, summary: history.summary };
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
  // Unit of the plotted number: "RUB за 1 USDT" or "RUB за 1 BTC" etc.
  const unit = last.best < 1 ? `${getCur} за 1 ${giveCur}` : `${giveCur} за 1 ${getCur}`;
  const num = (v: number) => format(v, 1);

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

  const ticks = niceTicks(geo.lo, geo.hi).filter((v) => {
    const py = geo.y(v);
    return py > 4 && py < 96;
  });
  const days = midnights(geo.t0, geo.t1);
  const up = (change24h ?? changePeriod) >= 0;
  // Green when the move is good for the user: more received per unit (course < 1) or less paid (course >= 1).
  const good = last.best < 1 ? up : !up;

  const onMove = (clientX: number) => {
    const node = plotRef.current;
    if (!node) return;
    const r = node.getBoundingClientRect();
    const fx = ((clientX - r.left) / r.width) * 100;
    let best = 0;
    geo.xy.forEach(([px], i) => {
      if (Math.abs(px - fx) < Math.abs(geo.xy[best][0] - fx)) best = i;
    });
    setHover(best);
  };

  const h = hover !== null ? points[hover] : null;
  const hxy = hover !== null ? geo.xy[hover] : null;

  const marker = (i: number, label: string, preferAbove: boolean) => {
    const [px, py] = geo.xy[i];
    // Flip the label when it would leave the plot (min near the bottom edge, max near the top).
    const above = preferAbove ? py > 15 : py > 80;
    return (
      <Box
        key={label}
        pos="absolute"
        left={`${px}%`}
        top={`${py}%`}
        transform={`translate(${px > 85 ? "-100%" : px < 15 ? "0" : "-50%"}, ${above ? "-150%" : "60%"})`}
        fontSize="xs"
        color="bg.500"
        whiteSpace="nowrap"
        pointerEvents="none"
      >
        {`${label} ${num(geo.values[i])}`}
      </Box>
    );
  };

  return (
    <Box mb="4">
      <ResponsiveText variant="contrast" whiteSpace="unset">
        {sentences.join(" ")}
      </ResponsiveText>
      <Box
        mt="4"
        w="100%"
        p={{ base: "3", lg: "5" }}
        borderRadius="2xl"
        bg={frameBg}
        border="1px solid"
        borderColor={frameBorder}
      >
        <Flex justify="space-between" align="flex-start" gap="3" wrap="wrap" mb="4">
          <Box>
            <ResponsiveText size="sm" variant="contrast" fontWeight="semibold">
              Лучший курс, почасово
            </ResponsiveText>
            <ResponsiveText size="xs" variant="no_contrast">
              {`${unit} · ${spanDays} ${spanDays === 1 ? "день" : spanDays < 5 ? "дня" : "дней"} · снимок раз в час`}
            </ResponsiveText>
          </Box>
          <Flex align="baseline" gap="2" wrap="wrap" justify="flex-end">
            <ResponsiveText
              fontSize={{ base: "xl", lg: "2xl" }}
              fontWeight="bold"
              variant="contrast"
              whiteSpace="nowrap"
            >
              {`${num(values[values.length - 1])} ${last.best < 1 ? getCur : giveCur}`}
            </ResponsiveText>
            <Box
              as="span"
              px="2"
              py="0.5"
              borderRadius="full"
              fontSize="xs"
              fontWeight="semibold"
              bg={good ? "green.500" : "red.500"}
              color="white"
              opacity={0.85}
              whiteSpace="nowrap"
            >
              {`${up ? "▲" : "▼"} ${signed(change24h ?? changePeriod)} ${change24h !== null ? "за сутки" : "за период"}`}
            </Box>
          </Flex>
        </Flex>

        <Flex gap="2">
          <Box
            ref={plotRef}
            pos="relative"
            flex="1"
            h={CHART_H}
            onMouseMove={(e) => onMove(e.clientX)}
            onTouchMove={(e) => onMove(e.touches[0].clientX)}
            onMouseLeave={() => setHover(null)}
            onTouchEnd={() => setHover(null)}
            cursor="crosshair"
          >
            {/* Recessive grid: round-value rows and Moscow midnights. */}
            {ticks.map((v) => (
              <Box
                key={v}
                pos="absolute"
                left="0"
                right="0"
                top={`${geo.y(v)}%`}
                borderTop="1px dashed"
                borderColor={gridColor}
              />
            ))}
            {days.map((d) => (
              <Box
                key={d}
                pos="absolute"
                top="0"
                bottom="0"
                left={`${geo.x(d)}%`}
                borderLeft="1px solid"
                borderColor={gridColor}
              />
            ))}
            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              role="img"
              aria-label={`График лучшего курса: от ${bestLow} до ${bestHigh}`}
              style={{ position: "absolute", inset: 0, overflow: "visible" }}
            >
              <defs>
                <linearGradient id="rateHistoryFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={stroke} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={geo.area} fill="url(#rateHistoryFill)" />
              <path
                d={geo.line}
                fill="none"
                stroke={stroke}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {marker(geo.iMax, "макс", true)}
            {geo.iMin !== geo.iMax && marker(geo.iMin, "мин", false)}
            {/* Current value: dot with a halo at the end of the line. */}
            <Box
              pos="absolute"
              left={`${geo.xy[geo.xy.length - 1][0]}%`}
              top={`${geo.xy[geo.xy.length - 1][1]}%`}
              w="10px"
              h="10px"
              borderRadius="full"
              bg={stroke}
              boxShadow={`0 0 0 4px ${stroke}33`}
              transform="translate(-50%, -50%)"
              pointerEvents="none"
            />
            {h && hxy && (
              <>
                <Box
                  pos="absolute"
                  top="0"
                  bottom="0"
                  left={`${hxy[0]}%`}
                  borderLeft="1px solid"
                  borderColor={stroke}
                  opacity={0.5}
                  pointerEvents="none"
                />
                <Box
                  pos="absolute"
                  left={`${hxy[0]}%`}
                  top={`${hxy[1]}%`}
                  w="10px"
                  h="10px"
                  borderRadius="full"
                  bg={stroke}
                  border="2px solid"
                  borderColor={tipBg}
                  transform="translate(-50%, -50%)"
                  pointerEvents="none"
                />
                <Box
                  pos="absolute"
                  top="0"
                  left={`${hxy[0]}%`}
                  transform={`translateX(${hxy[0] > 60 ? "calc(-100% - 10px)" : "10px"})`}
                  bg={tipBg}
                  px="3"
                  py="2"
                  borderRadius="lg"
                  boxShadow="lg"
                  border="1px solid"
                  borderColor={frameBorder}
                  pointerEvents="none"
                  zIndex={2}
                  minW="170px"
                >
                  <ResponsiveText size="xs" variant="no_contrast">
                    {`${timeLabel(h.t)} МСК`}
                  </ResponsiveText>
                  <ResponsiveText size="sm" variant="contrast" fontWeight="bold" whiteSpace="nowrap">
                    {buildRateString({ course: h.best, giveCur, getCur })}
                  </ResponsiveText>
                  <ResponsiveText size="xs" variant="no_contrast" whiteSpace="nowrap">
                    {`Обменников: ${h.n}`}
                  </ResponsiveText>
                </Box>
              </>
            )}
          </Box>
          {/* Y labels outside the plot so they never sit on the line. */}
          <Box pos="relative" w={{ base: "44px", lg: "64px" }} h={CHART_H} flexShrink={0}>
            {ticks.map((v) => (
              <Box
                key={v}
                pos="absolute"
                top={`${geo.y(v)}%`}
                transform="translateY(-50%)"
                fontSize="xs"
                color="bg.500"
                whiteSpace="nowrap"
              >
                {num(v)}
              </Box>
            ))}
          </Box>
        </Flex>
        <Box pos="relative" h="5" mt="1" mr={{ base: "52px", lg: "72px" }}>
          {days
            .filter((d) => geo.x(d) > 4 && geo.x(d) < 96)
            .map((d) => (
              <Box
                key={d}
                pos="absolute"
                left={`${geo.x(d)}%`}
                transform="translateX(-50%)"
                fontSize="xs"
                color="bg.500"
                whiteSpace="nowrap"
              >
                {dayLabel(d)}
              </Box>
            ))}
        </Box>

        <SimpleGrid columns={{ base: 2, md: 4 }} spacing="2" mt="4">
          <Stat label="Сейчас" value={now} />
          <Stat label="Лучший за период" value={bestHigh} />
          <Stat label="Худший за период" value={bestLow} />
          <Stat
            label="Обменников"
            value={`${Math.round(summary.offersAvg)} (${summary.offersMin}–${summary.offersMax})`}
          />
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default RateHistory;
