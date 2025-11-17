import { ISEO } from "../../types/general";
import { IMassDirText, IMassDirTextId, IMassRate } from "../../types/mass";
import { IPm } from "../../types/selector";
import { capitalize } from "../main/side/selector/section/PmGroup/helper";

export const generateMassSeo = ({
  title,
  description,
  slug,
  isSell,
}: {
  title: string;
  description: string;
  slug: string;
  isSell: boolean;
}) => {
  return {
    title,
    description,
    canonicalSlug: `${isSell ? "sell" : "buy"}/${slug}`,
  } as ISEO;
};

export const replaceCodesWithPms = (rates: IMassRate[], pms: IPm[]) => {
  return rates.map((r) => ({
    ...r,
    codes: r.codes.map((code) =>
      pms.find((pm) => pm.code.toUpperCase() == code)
    ),
  }));
};

export function getPmsByCodes(
  massRates: IMassRate[],
  pms: IPm[]
): Record<string, IPm> {
  // ✅ Collect all unique codes from massRates into a Set (fast lookups)
  const codes = new Set<string>();
  for (const rate of massRates) {
    for (const code of rate.codes) {
      codes.add(code.toUpperCase());
    }
  }

  // ✅ Filter and reduce pms into object keyed by code
  return pms.reduce((acc, pm) => {
    if (codes.has(pm.code)) {
      acc[pm.code] = pm; // duplicate code field preserved inside pm
    }
    return acc;
  }, {} as Record<string, IPm>);
}

export function pickKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  if (!obj) return {} as Pick<T, K>;
  return keys.reduce((acc, key) => {
    if (key in obj) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Pick<T, K>);
}

export const getCryptoPms = (pms: IPm[]) => {
  const cryptoPms = pms.filter((pm) => pm.section === "crypto");
  return cryptoPms;
};

const pickPmName = (code: string, pms: IPm[], locale: "en" | "ru") => {
  const pm = pms.find((item) => item.code.toUpperCase() === code.toUpperCase());
  if (!pm) return code.toUpperCase();
  return (
    (locale === "ru" ? pm.ru_name : pm.en_name) ||
    pm.en_name ||
    pm.ru_name ||
    code.toUpperCase()
  );
};

export const createDefaultMassDirText = ({
  massDirTextId,
  pms,
  isSell,
  locale,
}: {
  massDirTextId: IMassDirTextId;
  pms: IPm[];
  isSell: boolean;
  locale: "en" | "ru";
}): IMassDirText => {
  const assetName = pickPmName(massDirTextId.code, pms, locale);
  const fiatName = pickPmName(massDirTextId.currency.code, pms, locale);
  const actionWord =
    locale === "ru"
      ? isSell
        ? "Продать"
        : "Купить"
      : isSell
      ? "Sell"
      : "Buy";
  const actionVerb =
    locale === "ru"
      ? isSell
        ? "продать"
        : "купить"
      : isSell
      ? "sell"
      : "buy";
  const connector = locale === "ru" ? "за" : "for";
  const header = `${actionWord} ${assetName} ${connector} ${fiatName}`;
  const subheader =
    locale === "ru"
      ? `${actionWord} ${assetName} ${connector} ${fiatName} у надежных обменников и выбирайте лучшие условия.`
      : `${actionWord} ${assetName} ${connector} ${fiatName} across verified exchangers and pick the best offer.`;
  const seoTitleSuffix =
    locale === "ru" ? "— лучшие курсы обменников" : "— best exchange rates";
  const descriptionLead =
    locale === "ru"
      ? `Сравните выгодные предложения, чтобы ${actionVerb} ${assetName} ${connector} ${fiatName}.`
      : `Compare trusted offers to ${actionVerb} ${assetName} ${connector} ${fiatName}.`;
  const defaultText =
    locale === "ru"
      ? `${actionWord} ${assetName} ${connector} ${fiatName} онлайн: отсортируйте обменники, следите за резервами и выберите подходящий курс.`
      : `${actionWord} ${assetName} ${connector} ${fiatName} online: sort exchangers, track reserves, and choose the rate that works for you.`;

  return {
    ...massDirTextId,
    header,
    subheader,
    seo_title: `${header} ${seoTitleSuffix}`,
    seo_description: descriptionLead,
    text: defaultText,
  };
};
