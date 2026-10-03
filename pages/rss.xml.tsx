import { GetServerSideProps } from "next";
import {
  absoluteUrl,
  collectSitemapEntries,
  escapeXml,
  SITE_URL,
} from "../cache/sitemap";

const RSS_PATH = `${SITE_URL}/rss.xml`;
// Only pages with a real change date make sense in a feed.
const RSS_LIMIT = 100;

type SitemapEntry = {
  loc: string;
  lastmod?: string | null;
};

const humanizeSegment = (segment: string) =>
  String(segment || "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());

const toItemTitle = (url: string) => {
  try {
    const pathname = new URL(url).pathname.replace(/\/+$/, "") || "/";
    if (pathname === "/") return "P2PIE";

    const segments = pathname.split("/").filter(Boolean).map(humanizeSegment);
    return `P2PIE: ${segments.join(" / ")}`;
  } catch {
    return "P2PIE";
  }
};

const toItemDescription = (url: string) => {
  try {
    const pathname = new URL(url).pathname.replace(/\/+$/, "") || "/";
    if (pathname === "/") return "Главная страница P2PIE";
    return `Страница P2PIE: ${pathname}`;
  } catch {
    return "Страница P2PIE";
  }
};

const toRssItem = (entry: SitemapEntry) => {
  const pubDate = new Date(entry.lastmod || Date.now()).toUTCString();
  const title = toItemTitle(entry.loc);
  const description = toItemDescription(entry.loc);

  return [
    "<item>",
    `<title>${escapeXml(title)}</title>`,
    `<link>${entry.loc}</link>`,
    `<guid isPermaLink="true">${entry.loc}</guid>`,
    `<description>${escapeXml(description)}</description>`,
    `<pubDate>${pubDate}</pubDate>`,
    "</item>",
  ].join("");
};

const RssPage = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let entries: SitemapEntry[] = [];

  try {
    entries = (await collectSitemapEntries())
      .filter((entry) => entry.lastmod)
      .map((entry) => ({ loc: absoluteUrl(entry.loc), lastmod: entry.lastmod }))
      .sort(
        (a, b) =>
          new Date(b.lastmod || 0).getTime() - new Date(a.lastmod || 0).getTime(),
      )
      .slice(0, RSS_LIMIT);
  } catch (error) {
    console.error("[rss] Failed to collect sitemap entries:", error);
  }

  const lastBuildDate = new Date(entries[0]?.lastmod || Date.now()).toUTCString();

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    "<title>P2PIE Pages</title>",
    `<link>${SITE_URL}</link>`,
    "<description>Все страницы P2PIE из sitemap.xml</description>",
    "<language>ru-RU</language>",
    `<atom:link href="${RSS_PATH}" rel="self" type="application/rss+xml" />`,
    `<lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    ...entries.map(toRssItem),
    "</channel>",
    "</rss>",
  ].join("");

  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default RssPage;
