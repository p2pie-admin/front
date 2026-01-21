import { cmsLinkDEV, cmsLinkPROD } from "../../../services/utils";
import { IMaker, IMakerPreview } from "../../../types/p2p";

type MakerLike = IMaker | IMakerPreview;

export const getMakerDisplayName = (maker: MakerLike) =>
  maker.telegram_name || maker.telegram_username || maker.slug || maker.id;

export const getMakerSlug = (maker: MakerLike) =>
  maker.slug || maker.telegram_username || maker.id;

export const getMakerStatusColor = (maker: MakerLike) =>
  maker.status === "active" ? "green" : "orange";

export const getAvatarSrc = (url?: string | null) => {
  if (!url) return "";
  const env = process.env.NODE_ENV;
  const base = env === "production" ? cmsLinkPROD : cmsLinkDEV;
  return `${base}${url}`;
};
