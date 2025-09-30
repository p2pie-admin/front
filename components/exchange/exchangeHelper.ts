import { useRouter } from "next/router";
import { capitalize } from "../main/side/selector/section/PmGroup/helper";
import { mylog } from "../../services/utils";
import { ICity, IDirText, ISeoData } from "../../types/exchange";
import { IPm } from "../../types/selector";
import { loadDirText } from "../../cache/loadX";

export const generateExchangeHeader = (
  locale: "en" | "ru",
  givePm: IPm,
  getPm: IPm,
  city: ICity | null
) => {
  const giveCur = givePm.currency.code.toUpperCase();
  const getCur = getPm.currency.code.toUpperCase();

  // Proper locale-specific names
  const giveName =
    locale === "ru" ? givePm.ru_name ?? "" : givePm.en_name ?? "";
  const getName = locale === "ru" ? getPm.ru_name ?? "" : getPm.en_name ?? "";

  // City addon
  const cityAddon = city
    ? locale === "ru"
      ? ` в ${city.ru_name ?? ""}, ${city.ru_country_name ?? ""}`
      : ` in ${city.en_name ?? ""}, ${city.en_country_name ?? ""}`
    : "";

  // Subgroup
  const subgroup = givePm.subgroup_name ? ` ${givePm.subgroup_name}` : "";

  return locale === "ru"
    ? `Обмен ${capitalize(giveName)} ${giveCur}${subgroup} на ${capitalize(
        getName
      )} ${getCur}${cityAddon}`
    : `Exchange ${capitalize(giveName)} ${giveCur}${subgroup} for ${capitalize(
        getName
      )} ${getCur}${cityAddon}`;
};

// -----------------------------------
// dirTextHandler.ts
// -----------------------------------
export const dirTextHandler = async ({
  locale,
  givePm,
  getPm,
  customDirText,
  city,
  pms,
  articleCodes,
}: {
  locale: "en" | "ru";
  givePm: IPm;
  getPm: IPm;
  customDirText?: IDirText;
  city: ICity | null;
  pms: IPm[];
  articleCodes: string[];
}) => {
  // Default header
  const default_header = generateExchangeHeader(locale, givePm, getPm, city);

  // City name for fillWords
  const cityName = city?.[`${locale}_name`] ?? city?.en_name ?? "";

  // Placeholder replacer
  const replacer = (text?: string) =>
    fillWords({
      locale,
      givePm,
      getPm,
      cityName,
      text,
    });

  // SEO fields
  const fields = ["seo_description", "seo_title"] as const;

  let base = {} as IDirText;
  if (customDirText?.header) {
    base = customDirText;
  } else {
    const fallbackDirText = await loadDirText(
      locale,
      givePm.section,
      getPm.section
    );
    base = fallbackDirText;
  }

  // Replace placeholders in SEO fields
  const replacedFields = Object.fromEntries(
    fields.map((f) => [
      f,
      replacer(
        base[f] ?? `${givePm[`${locale}_name`]} → ${getPm[`${locale}_name`]}`
      ),
    ])
  );

  return {
    ...base,
    ...replacedFields,
    default_header,
  };
};

export const fillWords = ({
  locale,
  givePm,
  getPm,
  cityName,
  text,
}: {
  locale: "en" | "ru";
  givePm: IPm;
  getPm: IPm;
  cityName?: string;
  text?: string;
}) =>
  (text || "")
    .replaceAll(
      "give_name",
      capitalize(givePm[`${locale}_name`] || givePm.en_name)
    )
    .replaceAll(
      "get_name",
      capitalize(getPm[`${locale}_name`] || getPm.en_name)
    )
    .replaceAll("give_currency", givePm.currency.code.toUpperCase())
    .replaceAll("get_currency", getPm.currency.code.toUpperCase())
    .replaceAll("city_name", cityName || "");

export const findSimilarPmPairs = (
  givePm: IPm,
  getPm: IPm,
  pms: IPm[],
  dirs: string[]
) => {
  const similarLevel1 = pms.reduce((res: IPm[][], pm: IPm) => {
    let [pair1, pair2] = [[], []] as [IPm[], IPm[]];
    if (
      pm.currency.code == givePm.currency.code &&
      pm.section == givePm.section &&
      dirs.find((dir) => dir === `${pm.code}_${getPm.code}`)
    ) {
      pair1 = [pm, getPm];
    }
    if (
      pm.currency.code == getPm.currency.code &&
      pm.section == getPm.section &&
      dirs.find((dir) => dir === `${givePm.code}_${pm.code}`)
    ) {
      pair2 = [givePm, pm];
    }
    return [
      ...res,
      ...(pair1.length ? [pair1] : []),
      ...(pair2.length ? [pair2] : []),
    ];
  }, []);

  const similarLevel2 = pms.reduce((res: IPm[][], pm: IPm) => {
    let [pair1, pair2] = [[], []] as [IPm[], IPm[]];
    if (
      pm.currency.code == givePm.currency.code &&
      dirs.find((dir) => dir === `${pm.code}_${getPm.code}`)
    ) {
      pair1 = [pm, getPm];
    }
    if (
      pm.currency.code == getPm.currency.code &&
      dirs.find((dir) => dir === `${givePm.code}_${pm.code}`)
    ) {
      pair2 = [givePm, pm];
    }
    return [
      ...res,
      ...(pair1.length ? [pair1] : []),
      ...(pair2.length ? [pair2] : []),
    ];
  }, []);

  const similarLevel3 = pms.reduce((res: IPm[][], pm: IPm) => {
    let [pair1, pair2] = [[], []] as [IPm[], IPm[]];
    if (
      pm.section == givePm.section &&
      dirs.find((dir) => dir === `${pm.code}_${getPm.code}`)
    ) {
      pair1 = [pm, getPm];
    }
    if (
      pm.section == getPm.section &&
      dirs.find((dir) => dir === `${givePm.code}_${pm.code}`)
    ) {
      pair2 = [givePm, pm];
    }
    return [
      ...res,
      ...(pair1.length ? [pair1] : []),
      ...(pair2.length ? [pair2] : []),
    ];
  }, []);
  const allPairs = [...similarLevel1, ...similarLevel2, ...similarLevel3];
  const uniquePairs = allPairs.filter((pair, index, self) => {
    // Remove pairs with identical elements or already present pairs in reverse
    return (
      index ===
      self.findIndex(
        (otherPair) =>
          (pair[0].code === otherPair[0].code &&
            pair[1].code === otherPair[1].code) ||
          (pair[0].code === otherPair[1].code &&
            pair[1].code === otherPair[0].code)
      )
    );
  });

  return uniquePairs
    .filter(
      (pair) =>
        !(
          (pair[0].code == givePm.code && pair[1].code == getPm.code) ||
          pair[0].code == pair[1].code
        )
    )
    .slice(0, 11);
};

export const exchangeToSlugCity = (exchange: string) => {
  return exchange.includes("-in-")
    ? [exchange.split("-in-")[0], exchange.split("-in-")[1]]
    : [exchange, ""];
};

export const slugCityToExchange = (slug: string, city?: string) => {
  return `${slug}${
    (slug.startsWith("cash-") || slug.includes("-cash-")) && city
      ? "-in-" + city?.replaceAll(" ", "-").toLowerCase()
      : ""
  }`;
};

export const generateExchangeSeo = (seoData: ISeoData) => {
  const { givePm, getPm, locale, seo_description, seo_title, slug, city } =
    seoData;

  const defaultTitle = generateExchangeHeader(locale, givePm, getPm, city);

  const slugPath = slugCityToExchange(slug, city?.en_name);

  return {
    title: seo_title || defaultTitle,
    description: seo_description || "",
    canonical: `https://${process.env.NEXT_PUBLIC_NAME}.com/${locale}/${slugPath}`,
    locale,
    alternateLangs: ["ru"].map((l) => ({
      rel: "alternate",
      hrefLang: l,
      href: `https://${process.env.NEXT_PUBLIC_NAME}.com/${l}/${slugPath}`,
    })),
    breadcrumbs: [
      {
        position: 1,
        name: locale === "en" ? "Home" : "Главная",
        item: `https://${process.env.NEXT_PUBLIC_NAME}.com/${locale}`,
      },
      {
        position: 2,
        name: seo_title || `${givePm} → ${getPm}`,
        item: `https://${process.env.NEXT_PUBLIC_NAME}.com/${locale}/${slugPath}`,
      },
    ],
  };
};

export const getOtherMass = (
  pairs: IPm[][],
  givePm?: IPm,
  getPm?: IPm
): IPm[] => {
  if (!pairs.length) return [];

  const seen = new Set<string>();
  const result: IPm[] = [];

  const excludeKeys = new Set<string>();
  if (givePm) excludeKeys.add(givePm.code + "|" + (givePm.subgroup_name ?? ""));
  if (getPm) excludeKeys.add(getPm.code + "|" + (getPm.subgroup_name ?? ""));

  for (const pair of pairs) {
    for (const pm of pair) {
      const key = pm.code + "|" + (pm.subgroup_name ?? "");
      if (!seen.has(key) && !excludeKeys.has(key)) {
        seen.add(key);
        result.push(pm);
      }
    }
  }

  return result;
};
