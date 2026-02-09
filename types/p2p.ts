import { IImage, IPm } from "./selector";

export interface IMakerTag {
  id: string;
  name?: string | null;
  description?: string | null;
  color?: string | null;
}

export interface IMakerOffer {
  id: string;
  dir: string;
  side?: "give" | "get";
  isActive?: boolean | null;
  follow_market?: boolean | null;
  fee_enabled?: boolean | null;
  course: number;
  min?: number | null;
  max?: number | null;
  fee_type?: "give" | "get" | "percentage";
  fee_amount?: number | null;
  city_from?: string;
  city_to?: string;
}

export interface IFullOffer extends IMakerOffer {
  index?: number;
  givePm: IPm;
  getPm: IPm;
  bestRate?: number;
  bestRateRev?: number;
  googleRate?: number;
  suggestedCourse?: number;
  giveToUSD?: number;
  getToUSD?: number;
}

export interface IMakerReviewReply {
  id: string;
  text?: string | null;
  from?: string | null;
  iaApproved?: boolean | null;
  updatedAt?: string | null;
  screenshots?: IImage[] | null;
}

export interface IMakerReviewCategory {
  id: string;
  title?: string | null;
  description?: string | null;
  isNegative?: boolean | null;
  image?: IImage[] | null;
}

export interface IMakerReview {
  id: string;
  fingerprint?: string | null;
  ipAddress?: string | null;
  name?: string | null;
  text?: string | null;
  type?: string | null;
  isDispute?: boolean | null;
  isClosed?: boolean | null;
  isApproved?: boolean | null;
  review_categories?: IMakerReviewCategory[] | null;
  userAgent?: string | null;
  location?: string | null;
  screenshots?: IImage[] | null;
  updatedAt?: string | null;
  review_replies?: IMakerReviewReply[] | null;
}

export interface IMakerPreview {
  id: string;
  telegram_name?: string | null;
  telegram_username: string;
  status?: "active" | "paused" | "disabled" | null;
  createdAt?: string | null;
  offers?: IMakerOffer[] | null;
  exchanger_tags?: IMakerTag[] | null;
  avatar?: IImage | null;
  reviews?: IMakerReview[] | null;
  p2p_level?: IP2PLevel | null;

  deals_finished?: number;
  deals_canceled?: number;
  rating?: number;
  need_ai_helper?: boolean;
  deposit_usd?: number;
}

export interface IMaker extends IMakerPreview {
  coordinates?: string | null;
  description?: string | null;
}

export interface IP2PLevel {
  id: string;
  level?: number | null;
  description?: string | null;
  limit_online_usd?: number | null;
  limit_offline_usd?: number | null;
  title?: string | null;
  deals_needed?: number | null;
  deposit_usd?: number | null;
  conditions?: IP2PCondition[] | null;
}

export interface IP2PCondition {
  description?: string | null;
  is_completed?: boolean | null;
}

export interface IP2PAd {
  id: string;
  title?: string | null;
  description?: string | null;
  details?: string | null;
  slug?: string | null;
  image?: IImage | null;
}
