import { IconType } from "react-icons";
import {
  MdGppGood,
  MdGppMaybe,
  MdOutlineShield,
  MdVerifiedUser,
} from "react-icons/md";

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
  { label: string; hint: string; color: string; glow: boolean; icon: IconType }
> = {
  reliable: {
    label: "Надёжный",
    hint: "Много отзывов, долгая история и несколько независимых площадок",
    color: "green.300",
    glow: true,
    icon: MdVerifiedUser,
  },
  verified: {
    label: "Проверенный",
    hint: "Данных достаточно, серьёзных замечаний нет",
    color: "blue.300",
    glow: true,
    icon: MdGppGood,
  },
  unknown: {
    label: "Мало данных",
    hint: "Отзывов и истории пока недостаточно для вывода. Это не значит, что обменник плохой",
    color: "bg.300",
    glow: false,
    icon: MdOutlineShield,
  },
  caution: {
    label: "Осторожно",
    hint: "Есть открытые претензии, заметная доля негатива или замечания нашей проверки",
    color: "orange.300",
    glow: true,
    icon: MdGppMaybe,
  },
};

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

const plural = (n: number, one: string, few: string, many: string) =>
  n % 10 === 1 && n % 100 !== 11
    ? one
    : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
      ? few
      : many;

export const reviewsText = (n: number) =>
  `${n.toLocaleString("ru-RU")} ${plural(n, "отзыв", "отзыва", "отзывов")}`;

export const sourcesText = (n: number) =>
  `${n} ${plural(n, "площадке", "площадках", "площадках")}`;

export const ageText = (months: number | null | undefined) => {
  if (months == null) return null;
  if (months < 12)
    return `${months} ${plural(months, "месяц", "месяца", "месяцев")}`;
  const years = Math.floor(months / 12);
  return `${years} ${plural(years, "год", "года", "лет")}`;
};
