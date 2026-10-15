import { GraphQLClient } from "graphql-request";
import normalize from "./normalizer";
import { cmsLinkDEV, cmsLinkPROD, internalCmsLink, resolveInternalUrl } from "./utils";
import { exchangerReviewCountsQuery, exchangerReviewsQuery } from "./queries";
import { IExchangerReview } from "../types/exchanger";
import { Locale } from "./i18n";

// review-category is a Strapi-i18n type: a review links the Russian entry; on English pages take the
// title/description of its "en" localization when it exists.
const localizeReviewCategories = (items: any[], locale: Locale) => {
  if (locale !== "en") return items;
  return items.map((review) => {
    if (!Array.isArray(review?.review_categories)) return review;
    return {
      ...review,
      review_categories: review.review_categories.map((cat: any) => {
        const list = Array.isArray(cat?.localizations) ? cat.localizations : [];
        const en = cat?.locale === "en" ? cat : list.find((l: any) => l?.locale === "en");
        return en ? { ...cat, title: en.title || cat.title, description: en.description || cat.description } : cat;
      }),
    };
  });
};

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
  locale = "ru",
}: {
  exchangerId: string | number;
  start?: number;
  limit?: number;
  type?: ReviewTypeFilter | null;
  locale?: Locale;
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
    return { items: Array.isArray(items) ? (localizeReviewCategories(items, locale) as IExchangerReview[]) : [], total };
  } catch (error) {
    console.error("fetchExchangerReviews failed:", { exchangerId, start, type, message: (error as any)?.message });
    return null;
  }
};

export type ReviewCounts = { all: number; positive: number; neutral: number; negative: number };

// Exact per-tone totals of an exchanger's approved reviews (all sources). null when the CMS is unreachable.
export const fetchExchangerReviewCounts = async (exchangerId: string | number): Promise<ReviewCounts | null> => {
  const publicBase = process.env.NODE_ENV === "production" ? cmsLinkPROD : cmsLinkDEV;
  const url = resolveInternalUrl(publicBase, internalCmsLink) + "/graphql";
  try {
    const client = new GraphQLClient(url, { timeout: 15000 });
    const raw = (await client.request(exchangerReviewCountsQuery, { id: String(exchangerId) })) as any;
    const n = (k: string) => Number(raw?.[k]?.meta?.pagination?.total ?? 0);
    return { all: n("all"), positive: n("positive"), neutral: n("neutral"), negative: n("negative") };
  } catch (error) {
    console.error("fetchExchangerReviewCounts failed:", { exchangerId, message: (error as any)?.message });
    return null;
  }
};
