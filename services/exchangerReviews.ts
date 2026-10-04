import { GraphQLClient } from "graphql-request";
import normalize from "./normalizer";
import { cmsLinkDEV, cmsLinkPROD, internalCmsLink, resolveInternalUrl } from "./utils";
import { exchangerReviewsQuery } from "./queries";
import { IExchangerReview } from "../types/exchanger";

export const REVIEWS_PAGE_SIZE = 10;

export type ReviewTypeFilter = "positive" | "neutral" | "negative";

export type ReviewsPage = { items: IExchangerReview[]; total: number };

// One page of an exchanger's reviews, all sources merged and sorted by review_date (newest first).
// Used by getStaticProps (first page) and by /api/exchanger-reviews ("show more", filters).
export const fetchExchangerReviews = async ({
  exchangerId,
  start = 0,
  limit = REVIEWS_PAGE_SIZE,
  type,
}: {
  exchangerId: string | number;
  start?: number;
  limit?: number;
  type?: ReviewTypeFilter | null;
}): Promise<ReviewsPage | null> => {
  const publicBase = process.env.NODE_ENV === "production" ? cmsLinkPROD : cmsLinkDEV;
  const url = resolveInternalUrl(publicBase, internalCmsLink) + "/graphql";
  const filters: Record<string, unknown> = {
    exchanger: { id: { eq: String(exchangerId) } },
    isApproved: { eq: true },
  };
  if (type) filters.type = { eq: type };
  try {
    const client = new GraphQLClient(url, { timeout: 15000 });
    const raw = (await client.request(exchangerReviewsQuery, { filters, start, limit })) as any;
    const total = Number(raw?.reviews?.meta?.pagination?.total ?? 0);
    const items = normalize(raw?.reviews?.data ?? []) as IExchangerReview[];
    return { items: Array.isArray(items) ? items : [], total };
  } catch (error) {
    console.error("fetchExchangerReviews failed:", { exchangerId, start, type, message: (error as any)?.message });
    return null;
  }
};
