import { IconType } from "react-icons";
import {
  MdGppGood,
  MdGppMaybe,
  MdOutlineShield,
  MdVerifiedUser,
} from "react-icons/md";
import { intlLocale, Locale } from "../../services/i18n";

// Trust level of an exchanger: how much evidence stands behind it (not how good its reviews are).
// Computed by the `competitors` service (core/rating.ts) and stored in Strapi; the method is described on /rating.
export type ITrustLevel = "unknown" | "caution" | "verified" | "reliable";

export type IRatingFactorKey =
  | "reviews"
  | "age"
  | "monitorings"
  | "check"
  | "live"
  | "claims"
  | "negative";

export type IRatingDetails = {
  v: number;
  stars: number | null;
  score: number;
  level: ITrustLevel;
  reviews: {
    positive: number;
    negative: number;
    total: number;
    sources: {
      source: string;
      name: string;
      positive: number | null;
      negative: number | null;
      total: number;
    }[];
  };
  ageMonths: number | null;
  monitorings: number;
  claimsOpen: number;
  check: "green" | "yellow" | "red" | "block" | null;
  factors: { key: IRatingFactorKey; points: number; max: number }[];
  flags: ("check_red" | "check_block" | "claims" | "negative_share")[];
};

export const TRUST_LEVELS: Record<
  ITrustLevel,
  {
    label: string;
    hint: string;
    en_label: string;
    en_hint: string;
    color: string;
    glow: boolean;
    icon: IconType;
  }
> = {
  reliable: {
    label: "Надёжный",
    hint: "Много отзывов, долгая история и несколько независимых площадок",
    en_label: "Reliable",
    en_hint: "Many reviews, a long history and several independent platforms",
    color: "green.300",
    glow: true,
    icon: MdVerifiedUser,
  },
  verified: {
    label: "Проверенный",
    hint: "Данных достаточно, серьёзных замечаний нет",
    en_label: "Verified",
    en_hint: "Enough data and no serious issues",
    color: "blue.300",
    glow: true,
    icon: MdGppGood,
  },
  unknown: {
    label: "Мало данных",
    hint: "Отзывов и истории пока недостаточно для вывода. Это не значит, что обменник плохой",
    en_label: "Little data",
    en_hint: "Not enough reviews and history to draw a conclusion yet. This does not mean the exchanger is bad",
    color: "bg.300",
    glow: false,
    icon: MdOutlineShield,
  },
  caution: {
    label: "Осторожно",
    hint: "Есть открытые претензии, заметная доля негатива или замечания нашей проверки",
    en_label: "Caution",
    en_hint: "Open claims, a notable share of negative reviews or issues found by our check",
    color: "orange.300",
    glow: true,
    icon: MdGppMaybe,
  },
};

// Label and hint of a trust level in the given language.
export const trustLabel = (meta: (typeof TRUST_LEVELS)[ITrustLevel], locale: Locale = "ru") =>
  locale === "en" ? meta.en_label : meta.label;
export const trustHint = (meta: (typeof TRUST_LEVELS)[ITrustLevel], locale: Locale = "ru") =>
  locale === "en" ? meta.en_hint : meta.hint;

export const isTrustLevel = (v: unknown): v is ITrustLevel =>
  typeof v === "string" && v in TRUST_LEVELS;

export const FACTOR_LABELS: Record<IRatingFactorKey, string> = {
  reviews: "Отзывы",
  age: "Возраст",
  monitorings: "Мониторинги",
  check: "Проверка P2PIE",
  live: "Курсы сейчас",
  claims: "Открытые претензии",
  negative: "Доля негатива",
};

export const FLAG_LABELS: Record<IRatingDetails["flags"][number], string> = {
  check_red: "наша проверка нашла серьёзные замечания",
  check_block: "наша проверка нашла серьёзные замечания",
  claims: "три и более открытых претензий на мониторингах",
  negative_share: "больше 10 % отзывов отрицательные",
};

export const FACTOR_LABELS_EN: Record<IRatingFactorKey, string> = {
  reviews: "Reviews",
  age: "Age",
  monitorings: "Monitorings",
  check: "P2PIE check",
  live: "Live rates",
  claims: "Open claims",
  negative: "Negative share",
};

export const FLAG_LABELS_EN: Record<IRatingDetails["flags"][number], string> = {
  check_red: "our check found serious issues",
  check_block: "our check found serious issues",
  claims: "three or more open claims on monitorings",
  negative_share: "more than 10% of reviews are negative",
};

const pluralEn = (n: number, one: string, many: string) => (n === 1 ? one : many);

const plural = (n: number, one: string, few: string, many: string) =>
  n % 10 === 1 && n % 100 !== 11
    ? one
    : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
      ? few
      : many;

export const reviewsText = (n: number, locale: Locale = "ru") =>
  locale === "en"
    ? `${n.toLocaleString(intlLocale(locale))} ${pluralEn(n, "review", "reviews")}`
    : `${n.toLocaleString("ru-RU")} ${plural(n, "отзыв", "отзыва", "отзывов")}`;

export const sourcesText = (n: number, locale: Locale = "ru") =>
  locale === "en"
    ? `${n} ${pluralEn(n, "platform", "platforms")}`
    : `${n} ${plural(n, "площадке", "площадках", "площадках")}`;

export const ageText = (months: number | null | undefined, locale: Locale = "ru") => {
  if (months == null) return null;
  if (months < 12)
    return locale === "en"
      ? `${months} ${pluralEn(months, "month", "months")}`
      : `${months} ${plural(months, "месяц", "месяца", "месяцев")}`;
  const years = Math.floor(months / 12);
  return locale === "en"
    ? `${years} ${pluralEn(years, "year", "years")}`
    : `${years} ${plural(years, "год", "года", "лет")}`;
};
