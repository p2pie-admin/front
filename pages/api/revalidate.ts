import type { NextApiRequest, NextApiResponse } from "next";
import { timingSafeEqual } from "crypto";
import { redisDel } from "../../cache/redisClient";

// On-demand ISR. Called by the `competitors` service when new external reviews arrive, by the
// editorial scripts after an article is published/refreshed, and by the deploy checks.
// Header `x-revalidate-secret` must equal REVALIDATE_SECRET.
// Allowed paths: /exchangers/<slug>, /articles/<code>, /articles, direction pages
// /<give>-to-<get>[-in-<city>], P2P pages /p2p, /p2p/<maker> and /p2p/edit/<maker> (the trade bot re-prices offers). Nothing else: this endpoint must not become a general
// cache-busting tool.
const MAX_PATHS = 60;
const LOCALE = "ru";

const secretOk = (given: string, expected: string) => {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
};

const EXCHANGER_RE = /^\/exchangers\/[a-z0-9_-]+$/;
const ARTICLE_RE = /^\/articles\/([A-Za-z0-9_-]+)$/;
const ARTICLES_LIST = "/articles";
// Direction pages (pages/[exchange].tsx): used to drop a stale 404 after a server/parser blip.
const DIRECTION_RE = /^\/[a-z0-9]+(?:-[a-z0-9]+)*-to-[a-z0-9]+(?:-[a-z0-9]+)*$/;

const P2P_LIST = "/p2p";
const P2P_MAKER_RE = /^\/p2p\/([A-Za-z0-9_]+)$/;
const P2P_EDIT_RE = /^\/p2p\/edit\/([A-Za-z0-9_]+)$/;

const isAllowed = (p: string) =>
  EXCHANGER_RE.test(p) ||
  ARTICLE_RE.test(p) ||
  p === ARTICLES_LIST ||
  DIRECTION_RE.test(p) ||
  p === P2P_LIST ||
  P2P_MAKER_RE.test(p) ||
  P2P_EDIT_RE.test(p);

// Article pages read Strapi through the Redis SWR cache (cache/loadX.ts: `article_<code>_ru`,
// `articleCodes`, `articles`), so ISR alone would re-render stale data. Drop those keys first.
const cacheKeysFor = (p: string): string[] => {
  const m = p.match(ARTICLE_RE);
  if (m) return [`article_${m[1].toLowerCase()}_${LOCALE}`, "articleCodes"];
  if (p === ARTICLES_LIST) return ["articles", "articleCodes"];
  const maker = p.match(P2P_MAKER_RE) || p.match(P2P_EDIT_RE);
  if (maker) return [`p2p_maker_v4_${maker[1].toLowerCase()}`, "p2p_makers_v4"];
  if (p === P2P_LIST) return ["p2p_makers_v4"];
  return [];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const expected = (process.env.REVALIDATE_SECRET || "").trim();
  if (!expected) return res.status(503).json({ error: "revalidation disabled" });
  const given = String(req.headers["x-revalidate-secret"] || "");
  if (!secretOk(given, expected)) return res.status(401).json({ error: "unauthorized" });

  const raw = (req.body as { paths?: unknown })?.paths;
  const paths = Array.isArray(raw) ? raw.filter((p): p is string => typeof p === "string") : [];
  const allowed = Array.from(new Set(paths.filter(isAllowed))).slice(0, MAX_PATHS);
  if (!allowed.length) {
    return res
      .status(400)
      .json({ error: "no valid paths (/exchangers/<slug>, /articles/<code>, /articles, /<a>-to-<b>)" });
  }

  const keys = Array.from(new Set(allowed.flatMap(cacheKeysFor)));
  const purged = keys.length ? await redisDel(...keys) : 0;

  const results: Record<string, "ok" | "error"> = {};
  for (const path of allowed) {
    try {
      await res.revalidate(path);
      results[path] = "ok";
      // The English copy is rendered on demand: refresh it too, ignoring "not generated yet".
      await res.revalidate(path === "/" ? "/xen" : `/xen${path}`).catch(() => undefined);
    } catch {
      results[path] = "error";
    }
  }
  return res.status(200).json({ results, purged });
}
