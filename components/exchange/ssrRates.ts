import { IRate } from "../../types/rates";

// Offers rendered into the HTML of a direction page (server side), so that crawlers
// and users without JS see real exchangers, not "Найдено 0 предложений".
// Keep the payload small: only the fields the table and the summary need.

export const SSR_RATES_LIMIT = 40;
// Directions with fewer live offers than this are thin pages: noindex them.
export const SSR_NOINDEX_BELOW = 3;

export type ISsrRate = Pick<
  IRate,
  | "exchangerId"
  | "name"
  | "display_name"
  | "admin_rating"
  | "course"
  | "min"
  | "max"
  | "reserve"
  | "ref_link"
  | "logo"
  | "last_time_updated"
  | "parameterCodes"
  | "tag"
>;

export type IRatesSummary = {
  count: number;
  bestCourse: number;
  medianCourse: number;
  worstCourse: number;
  spreadPercent: number;
  totalReserveGet: number;
  minAmount: number | null;
  updatedAt: number | null; // ms epoch of the freshest offer
};

const normalizeCityKey = (value?: string | null) =>
  value ? value.trim().toLowerCase() : "";

// Same override the client reducer applies for cash directions with a city.
const applyCityRateOverride = (rate: IRate, cityKey: string): IRate => {
  if (!cityKey) return rate;
  const override = rate.cityRates?.[cityKey]?.rate;
  if (!override) return rate;
  return { ...rate, ...override, cityRates: rate.cityRates };
};

const toNumber = (value: unknown): number | null => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

export const pickSsrRate = (rate: IRate): ISsrRate => ({
  exchangerId: rate.exchangerId,
  name: rate.name,
  display_name: rate.display_name,
  admin_rating: rate.admin_rating,
  course: rate.course,
  min: rate.min,
  max: rate.max,
  reserve: rate.reserve,
  ref_link: rate.ref_link,
  logo: rate.logo ?? null,
  last_time_updated: rate.last_time_updated ?? undefined,
  parameterCodes: rate.parameterCodes ?? undefined,
  tag: rate.tag ?? null,
});

// Sort like the client does (ascending course = best offer first), apply the city
// override for cash directions and keep only serialisable fields.
export const prepareSsrRates = (
  rates: unknown,
  cityName?: string | null,
): ISsrRate[] | null => {
  if (!Array.isArray(rates)) return null;
  const cityKey = normalizeCityKey(cityName);
  return (rates as IRate[])
    .filter((rate) => rate && toNumber(rate.course) !== null)
    .map((rate) => applyCityRateOverride(rate, cityKey))
    .sort((a, b) => a.course - b.course)
    .map(pickSsrRate);
};

const median = (values: number[]) => {
  if (!values.length) return 0;
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

export const buildRatesSummary = (
  rates: ISsrRate[] | null,
): IRatesSummary | null => {
  if (!rates || !rates.length) return null;
  const courses = rates.map((r) => r.course);
  const bestCourse = Math.min(...courses);
  const worstCourse = Math.max(...courses);
  const spreadPercent =
    bestCourse > 0 ? ((worstCourse - bestCourse) / bestCourse) * 100 : 0;

  const totalReserveGet = rates.reduce((sum, r) => {
    const reserve = toNumber(r.reserve?.get);
    return sum + (reserve && reserve > 0 ? reserve : 0);
  }, 0);

  // The amount the user actually enters is on the "small" side (see ExchangerCard).
  const minAmounts = rates
    .map((r) => {
      const side = r.course > 1 ? "give" : "get";
      return toNumber(r.min?.[side]);
    })
    .filter((v): v is number => v !== null && v > 0);
  const minAmount = minAmounts.length ? Math.min(...minAmounts) : null;

  const timestamps = rates
    .map((r) => toNumber(r.last_time_updated))
    .filter((v): v is number => v !== null && v > 0);
  const updatedAt = timestamps.length ? Math.max(...timestamps) : null;

  return {
    count: rates.length,
    bestCourse,
    medianCourse: median(courses),
    worstCourse,
    spreadPercent,
    totalReserveGet,
    minAmount,
    updatedAt,
  };
};

// Full numbers with ru-RU grouping for the crawlable table/summary (the swiper's
// kFormatter abbreviates and gives up on very large reserves).
export const formatAmount = (value: number | null | undefined, cur: string) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "—";
  const abs = Math.abs(num);
  const maximumFractionDigits = abs >= 1000 ? 0 : abs >= 1 ? 2 : 6;
  const formatted = new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits,
  }).format(num);
  return `${formatted} ${cur}`;
};

export const formatMoscowTime = (ms: number | null) => {
  if (!ms) return null;
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      timeZone: "Europe/Moscow",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(ms));
  } catch {
    return null;
  }
};
