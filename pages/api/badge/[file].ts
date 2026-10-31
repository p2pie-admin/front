import type { NextApiRequest, NextApiResponse } from "next";
import { loadExchanger } from "../../../cache/loadX";
import { redisIncr } from "../../../cache/redisClient";
import { LOGO_BODY, LOGO_VIEWBOX } from "../../../services/badgeLogo";
import { IRatingDetails, isTrustLevel, reviewsText } from "../../../components/shared/trust";

// Rating badge for an exchanger's own website: GET /badge/<slug>-<88x31|150x50|240x90>.svg
// (rewritten here from next.config.js). Shows what anyone sees on the exchanger's page: stars, the number of reviews
// across monitorings and their names, the trust level. Wrapped by the exchanger in a link to /exchangers/<slug>.
const SIZES = { "88x31": [88, 31], "150x50": [150, 50], "240x90": [240, 90] } as const;
type Size = keyof typeof SIZES;

const VIOLET = "#2b2270";
const VIOLET_2 = "#4637b9";
const PEACH = "#fbb597";
const INK = "#ffffff";
const MUTED = "#c9c3f0";
const FONT = "Verdana, 'DejaVu Sans', Arial, sans-serif";

const LEVEL_TEXT: Record<string, { ru: string; color: string }> = {
  reliable: { ru: "Надёжный", color: "#68d391" },
  verified: { ru: "Проверенный", color: "#90cdf4" },
  unknown: { ru: "Мало данных", color: "#cbd5e0" },
  caution: { ru: "Осторожно", color: "#f6ad55" },
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Rough width of Verdana text, to shrink long names instead of letting them overflow.
const fit = (text: string, size: number, maxWidth: number) => {
  const width = text.length * size * 0.62;
  return width <= maxWidth ? size : Math.max(7, Math.floor((size * maxWidth) / width));
};

const logo = (x: number, y: number, size: number) =>
  `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 ${LOGO_VIEWBOX.w} ${LOGO_VIEWBOX.h}">${LOGO_BODY}</svg>`;

const compact = (n: number) => (n >= 10000 ? `${Math.round(n / 1000)}k` : n.toLocaleString("ru-RU"));

type Data = { name: string; stars: number | null; total: number; sources: string[]; level: string | null };

const render = (size: Size, d: Data) => {
  const [w, h] = SIZES[size];
  const starsText = d.stars && d.total > 0 ? d.stars.toFixed(2).replace(".", ",") : "—";
  const level = d.level && LEVEL_TEXT[d.level] ? LEVEL_TEXT[d.level] : null;
  const bg = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${VIOLET_2}"/><stop offset="1" stop-color="${VIOLET}"/></linearGradient></defs>
<rect width="${w}" height="${h}" rx="${h > 40 ? 8 : 4}" fill="url(#g)"/>`;
  const title = `<title>${esc(`${d.name}: рейтинг ${starsText}, ${reviewsText(d.total)} на p2pie.com`)}</title>`;
  let body = "";

  if (size === "88x31") {
    body = `${logo(4, 5, 21)}
<text x="30" y="13" font-family="${FONT}" font-size="9" font-weight="bold" fill="${INK}">p2pie</text>
<text x="30" y="25" font-family="${FONT}" font-size="9" fill="${PEACH}">★ ${esc(starsText)}</text>
<text x="84" y="25" font-family="${FONT}" font-size="8" fill="${MUTED}" text-anchor="end">${esc(d.total ? compact(d.total) : "")}</text>`;
  } else if (size === "150x50") {
    const nameSize = fit(d.name, 11, 104);
    body = `${logo(6, 9, 32)}
<text x="44" y="17" font-family="${FONT}" font-size="${nameSize}" font-weight="bold" fill="${INK}">${esc(d.name)}</text>
<text x="44" y="31" font-family="${FONT}" font-size="10" fill="${PEACH}">★ ${esc(starsText)}${level ? `<tspan fill="${level.color}" font-size="9">  ${esc(level.ru)}</tspan>` : ""}</text>
<text x="44" y="43" font-family="${FONT}" font-size="8.5" fill="${MUTED}">${esc(d.total ? `${reviewsText(d.total)} · p2pie.com` : "p2pie.com")}</text>`;
  } else {
    const nameSize = fit(d.name, 15, 170);
    const src = d.sources.length ? d.sources.slice(0, 4).join(", ") + (d.sources.length > 4 ? "…" : "") : "";
    const srcSize = fit(src, 9, 222);
    body = `${logo(10, 10, 48)}
<text x="66" y="27" font-family="${FONT}" font-size="${nameSize}" font-weight="bold" fill="${INK}">${esc(d.name)}</text>
<text x="66" y="48" font-family="${FONT}" font-size="15" font-weight="bold" fill="${PEACH}">★ ${esc(starsText)}${level ? `<tspan fill="${level.color}" font-size="11" font-weight="normal">  ${esc(level.ru)}</tspan>` : ""}</text>
<text x="10" y="69" font-family="${FONT}" font-size="10" fill="${INK}">${esc(d.total ? reviewsText(d.total) + (src ? ":" : "") : "Отзывов пока нет")}</text>
<text x="10" y="82" font-family="${FONT}" font-size="${srcSize}" fill="${MUTED}">${esc(src || "мониторинг обменников p2pie.com")}</text>
<text x="${w - 8}" y="69" font-family="${FONT}" font-size="9" fill="${MUTED}" text-anchor="end">${src ? "p2pie.com" : ""}</text>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img">${title}${bg}${body}</svg>`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const file = String(req.query.file || "");
  const m = file.match(/^([a-z0-9._-]+?)-(88x31|150x50|240x90)\.svg$/i);
  if (!m) return res.status(404).send("not found");
  const slug = m[1].toLowerCase();
  const size = m[2] as Size;
  const exchanger = await loadExchanger(slug).catch(() => null);
  if (!exchanger) return res.status(404).send("not found");

  const details = (exchanger.rating_details || null) as IRatingDetails | null;
  const total = details?.reviews?.total ?? exchanger.reviews_count ?? 0;
  const data: Data = {
    name: exchanger.display_name || exchanger.name,
    stars: Number(exchanger.admin_rating) || null,
    total,
    sources: (details?.reviews?.sources || []).filter((s) => s.total > 0).map((s) => s.name),
    level: isTrustLevel(exchanger.trust_level) ? exchanger.trust_level : null,
  };

  // Impressions per exchanger per day, for the partner report; never blocks the response.
  const day = new Date().toISOString().slice(0, 10);
  redisIncr(`badge:views:${slug}:${day}`).catch(() => undefined);

  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("X-Robots-Tag", "noindex");
  return res.status(200).send(render(size, data));
}
