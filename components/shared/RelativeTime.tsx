import { useEffect, useState } from "react";

const plural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};

export const relativeRu = (ms: number, now: number) => {
  const sec = Math.max(0, Math.round((now - ms) / 1000));
  if (sec < 60) return "только что";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} ${plural(min, "минуту", "минуты", "минут")} назад`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} ${plural(h, "час", "часа", "часов")} назад`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} ${plural(d, "день", "дня", "дней")} назад`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} ${plural(mo, "месяц", "месяца", "месяцев")} назад`;
  const y = Math.floor(d / 365);
  return `${y} ${plural(y, "год", "года", "лет")} назад`;
};

const absolute = (ms: number) =>
  new Intl.DateTimeFormat("ru-RU", {
    // Fixed zone so the server and the browser render the same string (no hydration mismatch).
    timeZone: "Europe/Moscow",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms));

// "1 час назад". The static (ISR) HTML carries the absolute date; the relative form is computed in the browser
// after mount and refreshed every minute, so a cached page never shows a stale "5 минут назад".
const RelativeTime = ({ date }: { date?: string | null }) => {
  const ms = date ? Date.parse(date) : NaN;
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  if (!Number.isFinite(ms)) return null;
  return (
    <time dateTime={new Date(ms).toISOString()} title={`${absolute(ms)} МСК`}>
      {now === null ? absolute(ms) : relativeRu(ms, now)}
    </time>
  );
};

export default RelativeTime;
