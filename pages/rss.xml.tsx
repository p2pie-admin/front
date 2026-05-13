import { GetServerSideProps } from "next";
import { loadBlog } from "../cache/loadX";
import { IArticle } from "../types/pages";

const RSS_PATH = "https://p2pie.com/rss.xml";
const SITE_URL = "https://p2pie.com";

const escapeXml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toArticleUrl = (code: string) =>
  `${SITE_URL}/articles/${String(code || "").toLowerCase()}`;

const toRssItem = (article: IArticle) => {
  const url = toArticleUrl(article.code);
  const description = article.subheader || article.seo_description || "";
  const pubDate = new Date(article.updatedAt || Date.now()).toUTCString();

  return [
    "<item>",
    `<title>${escapeXml(article.header || article.code)}</title>`,
    `<link>${url}</link>`,
    `<guid isPermaLink="true">${url}</guid>`,
    `<description>${escapeXml(description)}</description>`,
    `<pubDate>${pubDate}</pubDate>`,
    "</item>",
  ].join("");
};

const RssPage = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const loaded = (await loadBlog()) as IArticle[] | null;
  const articles = Array.isArray(loaded)
    ? [...loaded]
        .filter((article) => article?.code && article?.header)
        .sort((a, b) => {
          const left = new Date(b.updatedAt || 0).getTime();
          const right = new Date(a.updatedAt || 0).getTime();
          return left - right;
        })
    : [];

  const lastBuildDate = new Date(
    articles[0]?.updatedAt || Date.now(),
  ).toUTCString();

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    "<title>P2PIE Articles</title>",
    `<link>${SITE_URL}/articles</link>`,
    "<description>Новые статьи и обновления блога P2PIE</description>",
    "<language>ru-RU</language>",
    `<atom:link href="${RSS_PATH}" rel="self" type="application/rss+xml" />`,
    `<lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    ...articles.map(toRssItem),
    "</channel>",
    "</rss>",
  ].join("");

  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default RssPage;
