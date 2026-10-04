import type { NextApiRequest, NextApiResponse } from "next";
import { fetchExchangerReviews, REVIEWS_PAGE_SIZE, ReviewTypeFilter } from "../../services/exchangerReviews";
import { maskReviewList } from "../../services/maskIP";

// "Show more" / filter for the reviews of one exchanger: GET ?id=<exchanger id>&start=<offset>[&type=positive|neutral|negative]
// Returns REVIEWS_PAGE_SIZE reviews (all sources merged, newest first) and the total for the filter.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "GET only" });
  const id = String(req.query.id ?? "");
  const start = Number(req.query.start ?? 0);
  const type = req.query.type ? String(req.query.type) : null;
  if (!/^\d{1,10}$/.test(id)) return res.status(400).json({ error: "bad id" });
  if (!Number.isInteger(start) || start < 0 || start > 5000) return res.status(400).json({ error: "bad start" });
  if (type && !["positive", "neutral", "negative"].includes(type)) return res.status(400).json({ error: "bad type" });

  const page = await fetchExchangerReviews({
    exchangerId: id,
    start,
    limit: REVIEWS_PAGE_SIZE,
    type: type as ReviewTypeFilter | null,
  });
  if (!page) return res.status(502).json({ error: "reviews unavailable" });
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  return res.status(200).json({ items: maskReviewList(page.items), total: page.total });
}
