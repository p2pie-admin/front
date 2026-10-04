import type { NextApiRequest, NextApiResponse } from "next";
import { timingSafeEqual } from "crypto";

// On-demand ISR for exchanger pages. Called by the `competitors` service when new external reviews
// arrive, and by the deploy checks. Header `x-revalidate-secret` must equal REVALIDATE_SECRET.
const MAX_PATHS = 60;

const secretOk = (given: string, expected: string) => {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const expected = (process.env.REVALIDATE_SECRET || "").trim();
  if (!expected) return res.status(503).json({ error: "revalidation disabled" });
  const given = String(req.headers["x-revalidate-secret"] || "");
  if (!secretOk(given, expected)) return res.status(401).json({ error: "unauthorized" });

  const raw = (req.body as { paths?: unknown })?.paths;
  const paths = Array.isArray(raw) ? raw.filter((p): p is string => typeof p === "string") : [];
  // Only exchanger pages: this endpoint must not become a general cache-busting tool.
  const allowed = paths.filter((p) => /^\/exchangers\/[a-z0-9_-]+$/.test(p)).slice(0, MAX_PATHS);
  if (!allowed.length) return res.status(400).json({ error: "no valid /exchangers/<slug> paths" });

  const results: Record<string, "ok" | "error"> = {};
  for (const path of allowed) {
    try {
      await res.revalidate(path);
      results[path] = "ok";
    } catch {
      results[path] = "error";
    }
  }
  return res.status(200).json({ results });
}
