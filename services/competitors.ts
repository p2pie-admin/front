import axios from "axios";

// Reviews of OUR exchangers collected by the `competitors` service from other monitorings.
// Optional by design: any failure returns null and the page simply renders without the block.

export type IExternalReview = {
  id: number;
  source: string;
  author: string | null;
  country: string | null;
  rating: number | null;
  type: "positive" | "neutral" | "negative" | null;
  text: string;
  postedAt: number; // unix seconds
  url: string;
  reply: { author: string | null; text: string; at: number | null } | null;
};

export type IExternalSource = {
  source: string;
  name: string;
  exchangerName: string;
  url: string | null;
  stats: {
    positive: number | null;
    negative: number | null;
    reviewsTotal: number | null;
    claimsOpen: number | null;
    claimsClosed: number | null;
    age: string | null;
    onSource: string | null;
    fetchedAt: number;
  };
  reviewsAvailable: number;
  reviews: IExternalReview[];
};

export type IExternalReviews = {
  notice: string;
  textsEnabled: boolean;
  sources: IExternalSource[];
};

const baseUrl = () => {
  const v = (process.env.COMPETITORS_URL || "").trim().replace(/^['"]|['"]$/g, "");
  return v ? v.replace(/\/$/, "") : null;
};

export const loadExternalReviews = async (
  exchangerId: string | number | undefined | null,
  limit = 0 // counters only: the review texts live in Strapi
): Promise<IExternalReviews | null> => {
  const base = baseUrl();
  if (!base || exchangerId == null) return null;
  try {
    const { data } = await axios.get(
      `${base}/v1/exchangers/${encodeURIComponent(String(exchangerId))}/external`,
      { params: { limit }, timeout: 4000 }
    );
    if (!data || !Array.isArray(data.sources) || data.sources.length === 0) return null;
    return data as IExternalReviews;
  } catch {
    return null;
  }
};
