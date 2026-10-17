import { cmsLinkDEV, cmsLinkPROD } from "../../../services/utils";
import { IMaker, IMakerPreview } from "../../../types/p2p";

type MakerLike = IMaker | IMakerPreview;

export const getMakerDisplayName = (maker: MakerLike) =>
  maker.telegram_name || maker.slug || maker.id;

export const getMakerSlug = (maker: MakerLike) => maker.slug || maker.id;

export const getMakerStatusColor = (maker: MakerLike) =>
  maker.status === "active" ? "green" : "orange";

export const getAvatarSrc = (url?: string | null) => {
  if (!url) return "";
  const env = process.env.NODE_ENV;
  const base = env === "production" ? cmsLinkPROD : cmsLinkDEV;
  return `${base}${url}`;
};

// Offer cities are stored as lowercase English codes ("tbilisi"); this key also matches "Nizhny Novgorod".
export const cityKey = (value?: string | null) =>
  (value || "").toLowerCase().replace(/[^a-z]/g, "");

// Cities a maker works in, taken from the from/to cities of its offers.
export const getMakerCityKeys = (maker: MakerLike) => {
  const keys = new Set<string>();
  (maker.offers || []).forEach((offer) => {
    [offer?.city_from, offer?.city_to].forEach((city) => {
      const key = cityKey(city);
      if (key) keys.add(key);
    });
  });
  return Array.from(keys);
};
