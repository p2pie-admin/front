import { IPm } from "../types/selector";

// Offers that touch a sanctioned payment group (pm-group.sanctioned in Strapi) are not shown or accepted in P2P.
export const sanctionedCodes = (pms: IPm[] | null | undefined) =>
  new Set((pms || []).filter((pm) => pm?.sanctioned).map((pm) => pm.code.toUpperCase()));

export const isDirAllowed = (dir: string | null | undefined, codes: Set<string>) =>
  !(dir || "")
    .toUpperCase()
    .split("_")
    .some((code) => codes.has(code));

export const filterAllowedOffers = <T extends { dir: string }>(
  offers: T[] | null | undefined,
  pms: IPm[] | null | undefined,
): T[] => {
  const codes = sanctionedCodes(pms);
  return (offers || []).filter((offer) => isDirAllowed(offer.dir, codes));
};

export const P2P_TRADE_BOT = process.env.NEXT_PUBLIC_P2P_TRADE_BOT || "p2pie_trade_bot";
export const dealLink = (offerId: string | number) => `https://t.me/${P2P_TRADE_BOT}?start=deal_${offerId}`;
