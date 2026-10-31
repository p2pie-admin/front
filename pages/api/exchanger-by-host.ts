import type { NextApiRequest, NextApiResponse } from "next";
import { loadExchangers } from "../../cache/loadX";
import { exchangerNameToSlug } from "../../components/exchangers/helper";
import { IExchangerPreview } from "../../types/exchanger";

const hostOf = (url?: string | null) => {
  try {
    return new URL(url || "").hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
};

// Which listed exchanger owns a website host: GET ?host=example.com -> { slug, name } or 404.
// Used by the review prompt, which only remembers the host of the outbound click.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const host = String(req.query.host || "").replace(/^www\./, "").toLowerCase();
  if (!/^[a-z0-9.-]{3,100}$/.test(host)) return res.status(400).json({ error: "bad host" });
  const list = ((await loadExchangers().catch(() => [])) || []) as IExchangerPreview[];
  const hit = list.find((e) => hostOf(e.ref_link) === host);
  if (!hit) return res.status(404).json({ error: "not found" });
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return res.status(200).json({ slug: exchangerNameToSlug(hit.name), name: hit.display_name || hit.name });
}
