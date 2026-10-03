import { gql } from "graphql-request";
import { cachedFetch } from "./cache";
import { getCitySlugs, getSlugToCodes, convertMassDirTextIntoSlug } from "./helper";
import {
  loadMassDirTextIds,
  loadPms,
  loadPossibleDirs,
  TTL,
} from "./loadX";
import { initCMSFetcher, initParserFetcher } from "../services/fetchers";
import { exchangerNameToSlug } from "../components/exchangers/helper";
import { SSR_NOINDEX_BELOW } from "../components/exchange/ssrRates";
import { IMassDirTextId } from "../types/mass";
import { ParserCityDirections } from "../types/map";

// Sitemap entries are collected at request time (pages/sitemap.xml.tsx) instead of at
// build time, so the list follows the data: directions appear/disappear with their offers,
// and lastmod is a real CMS timestamp where one exists (articles, exchangers, makers).
// Pages whose change date we do not know carry no lastmod rather than a fake one.

export type SitemapEntry = { loc: string; lastmod?: string | null };

export const SITE_URL = process.env.SITE_URL || "https://p2pie.com";

const STATIC_PATHS = [
  "/",
  "/about",
  "/articles",
  "/contacts",
  "/exchangers",
  "/faq",
  "/map",
  "/map/moscow",
  "/p2p",
  "/partnership",
];

const articlesQuery = gql`
  query SitemapArticles($locale: I18NLocaleCode) {
    articles(
      locale: $locale
      pagination: { start: 0, limit: 1000 }
      filters: { or: [{ type: { ne: "page" } }, { type: { null: true } }] }
    ) {
      data {
        id
        attributes {
          code
          updatedAt
        }
      }
    }
  }
`;

const exchangersQuery = gql`
  query SitemapExchangers {
    exchangers(
      pagination: { start: 0, limit: 2000 }
      filters: {
        status: { in: ["active", "suspended"] }
        ref_link: { notNull: true }
        rates_link: { notNull: true }
      }
    ) {
      data {
        id
        attributes {
          name
          updatedAt
        }
      }
    }
  }
`;

const makersQuery = gql`
  query SitemapP2PMakers {
    p2PMakers(
      pagination: { start: 0, limit: 2000 }
      filters: { status: { in: ["active", "suspended", "disabled"] } }
    ) {
      data {
        id
        attributes {
          telegram_username
          updatedAt
        }
      }
    }
  }
`;

const toIso = (value: unknown): string | null => {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const asArray = <T>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : value ? [value as T] : [];

const safe = async <T>(label: string, fn: () => Promise<T>, fallback: T) => {
  try {
    return await fn();
  } catch (error) {
    console.error(`[sitemap] ${label} failed:`, error);
    return fallback;
  }
};

const collectDirectionEntries = async (): Promise<SitemapEntry[]> => {
  const parserFetcher = initParserFetcher();
  const [dirs, pms, cityDirections] = await Promise.all([
    loadPossibleDirs() as Promise<Record<string, number>>,
    loadPms(),
    parserFetcher("non_empty_cities") as Promise<ParserCityDirections | null>,
  ]);
  if (!pms || !Array.isArray(pms)) return [];

  // Same threshold as the page-level noindex: a direction is listed only when it has offers.
  const liveDirs = Object.entries(dirs || {})
    .filter(([, count]) => Number(count) >= SSR_NOINDEX_BELOW)
    .map(([dir]) => dir);
  const slugToCodes = getSlugToCodes(liveDirs, pms);
  const citySlugs = getCitySlugs(slugToCodes, cityDirections);

  return [...Object.keys(slugToCodes), ...citySlugs].map((slug) => ({
    loc: `/${slug}`,
  }));
};

const collectMassEntries = async (): Promise<SitemapEntry[]> => {
  const [buy, sell] = await Promise.all([
    loadMassDirTextIds({ isSell: false }) as Promise<IMassDirTextId[]>,
    loadMassDirTextIds({ isSell: true }) as Promise<IMassDirTextId[]>,
  ]);
  const entries: SitemapEntry[] = [];
  asArray<IMassDirTextId>(buy).forEach((id) =>
    entries.push({ loc: `/buy/${convertMassDirTextIntoSlug(id)}` }),
  );
  asArray<IMassDirTextId>(sell).forEach((id) =>
    entries.push({ loc: `/sell/${convertMassDirTextIntoSlug(id)}` }),
  );
  return entries;
};

const collectCmsEntries = async (): Promise<SitemapEntry[]> => {
  const cms = initCMSFetcher();
  const [articles, exchangers, makers] = await Promise.all([
    cms(articlesQuery, { locale: "ru" }),
    cms(exchangersQuery),
    cms(makersQuery),
  ]);

  const entries: SitemapEntry[] = [];
  asArray<{ code?: string; updatedAt?: string }>(articles).forEach((a) => {
    if (a?.code)
      entries.push({
        loc: `/articles/${a.code.toLowerCase()}`,
        lastmod: toIso(a.updatedAt),
      });
  });
  asArray<{ name?: string; updatedAt?: string }>(exchangers).forEach((e) => {
    if (e?.name)
      entries.push({
        loc: `/exchangers/${exchangerNameToSlug(e.name)}`,
        lastmod: toIso(e.updatedAt),
      });
  });
  asArray<{ id?: string; telegram_username?: string; updatedAt?: string }>(
    makers,
  ).forEach((m) => {
    const slug = (m?.telegram_username || "").trim().replace(/^@/, "") || m?.id;
    if (slug) entries.push({ loc: `/p2p/${slug}`, lastmod: toIso(m.updatedAt) });
  });
  return entries;
};

const dedupe = (entries: SitemapEntry[]) => {
  const seen = new Map<string, SitemapEntry>();
  for (const entry of entries) {
    const loc = entry.loc.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
    const existing = seen.get(loc);
    if (!existing || (!existing.lastmod && entry.lastmod)) {
      seen.set(loc, { loc, lastmod: entry.lastmod ?? null });
    }
  }
  return Array.from(seen.values());
};

export const collectSitemapEntries = (): Promise<SitemapEntry[]> =>
  cachedFetch("sitemap_entries_v1", TTL.fast, async () => {
    const [directions, mass, cmsEntries] = await Promise.all([
      safe("directions", collectDirectionEntries, [] as SitemapEntry[]),
      safe("mass", collectMassEntries, [] as SitemapEntry[]),
      safe("cms", collectCmsEntries, [] as SitemapEntry[]),
    ]);
    return dedupe([
      ...STATIC_PATHS.map((loc) => ({ loc })),
      ...directions,
      ...mass,
      ...cmsEntries,
    ]);
  }) as Promise<SitemapEntry[]>;

export const escapeXml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const absoluteUrl = (loc: string) =>
  loc === "/" ? `${SITE_URL}/` : `${SITE_URL}${loc}`;

export const renderSitemapXml = (entries: SitemapEntry[]) =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map((entry) =>
      [
        "<url>",
        `<loc>${escapeXml(absoluteUrl(entry.loc))}</loc>`,
        entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : "",
        "</url>",
      ].join(""),
    ),
    "</urlset>",
  ].join("\n");
