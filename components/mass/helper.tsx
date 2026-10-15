import { ISEO } from "../../types/general";
import { IMassDirText, IMassDirTextId, IMassRate } from "../../types/mass";
import { IPm } from "../../types/selector";
import { capitalize } from "../main/side/selector/section/PmGroup/helper";
import { Locale, pickName } from "../../services/i18n";

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

const pickPmName = (code: string, pms: IPm[], locale: Locale = "ru") => {
  const pm = pms.find((item) => item.code.toUpperCase() === code.toUpperCase());
  if (!pm) return code.toUpperCase();
  if (locale === "en") return pickName(pm, locale) || code.toUpperCase();
  return (
    pm.ru_name ||
    pm.en_name ||
    code.toUpperCase()
  );
};

export const createDefaultMassDirText = ({
  massDirTextId,
  pms,
  isSell,
  locale = "ru",
}: {
  massDirTextId: IMassDirTextId;
  pms: IPm[];
  isSell: boolean;
  locale?: Locale;
}): IMassDirText => {
  const assetName = pickPmName(massDirTextId.code, pms, locale);
  const fiatName = pickPmName(massDirTextId.currency.code, pms, locale);
  if (locale === "en") {
    // English pages: template header/SEO only, the long text stays Russian-only (empty here).
    const action = isSell ? "Sell" : "Buy";
    const header = `${action} ${assetName} for ${fiatName}`;
    return {
      ...massDirTextId,
      header,
      subheader: `${action} ${assetName} for ${fiatName} with reliable exchangers and pick the best terms.`,
      seo_title: `${header}: best exchanger rates`,
      seo_description: `Compare the best offers to ${action.toLowerCase()} ${assetName} for ${fiatName}.`,
      text: "",
    };
  }
  const actionWord = isSell ? "Продать" : "Купить";
  const actionVerb = isSell ? "продать" : "купить";
  const connector = "за";
  const header = `${actionWord} ${assetName} ${connector} ${fiatName}`;
  const subheader = `${actionWord} ${assetName} ${connector} ${fiatName} у надежных обменников и выбирайте лучшие условия.`;
  const seoTitleSuffix = "— лучшие курсы обменников";
  const descriptionLead = `Сравните выгодные предложения, чтобы ${actionVerb} ${assetName} ${connector} ${fiatName}.`;
  const defaultText = `${actionWord} ${assetName} ${connector} ${fiatName} онлайн: отсортируйте обменники, следите за резервами и выберите подходящий курс.`;

  return {
    ...massDirTextId,
    header,
    subheader,
    seo_title: `${header} ${seoTitleSuffix}`,
    seo_description: descriptionLead,
    text: defaultText,
  };
};
