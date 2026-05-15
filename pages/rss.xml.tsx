import { GetServerSideProps } from "next";
import { readFile } from "fs/promises";
import path from "path";

const RSS_PATH = "https://p2pie.com/rss.xml";
const SITE_URL = "https://p2pie.com";
const SITEMAP_PATH = path.join(process.cwd(), "public", "sitemap.xml");

const escapeXml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

type SitemapEntry = {
  loc: string;
  lastmod?: string;
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

const parseSitemapEntries = (xml: string): SitemapEntry[] => {
  const matches = Array.from(
    xml.matchAll(/<url><loc>(.*?)<\/loc>(?:<lastmod>(.*?)<\/lastmod>)?.*?<\/url>/g),
  );

  return matches
    .map((match) => ({
      loc: match[1],
      lastmod: match[2],
    }))
    .filter((entry) => entry.loc && entry.loc !== RSS_PATH);
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
    const sitemapXml = await readFile(SITEMAP_PATH, "utf8");
    entries = parseSitemapEntries(sitemapXml).sort((a, b) => {
      const left = new Date(b.lastmod || 0).getTime();
      const right = new Date(a.lastmod || 0).getTime();
      return left - right;
    });
  } catch (error) {
    console.error("[rss] Failed to read sitemap.xml:", error);
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
