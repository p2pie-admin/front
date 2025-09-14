import { useRouter } from "next/router";
import { capitalize } from "../main/side/selector/section/PmGroup/helper";
import { mylog } from "../../services/utils";
import { ICity, IDirText, ISeoData } from "../../types/exchange";
import { IPm } from "../../types/selector";
import { loadDirText } from "../../cache/loadX";

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
  const default_header = generateExchangeHeader(locale, givePm, getPm, city);
  const replacer = (text?: string) =>
    fillWords({
      locale,
      givePm,
      getPm,
      cityName: city?.[`${locale}_name`],
      text,
    });

  const fields = ["seo_description", "seo_title"] as const;

  const base = customDirText?.seo_title
    ? customDirText
    : await loadDirText(locale, givePm.section, getPm.section);

  return {
    ...base,
    ...Object.fromEntries(fields.map((f) => [f, replacer(base[f])])),
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
    .slice(0, 4);
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

export const generateExchangeHeader = (
  locale: string,
  givePm: IPm,
  getPm: IPm,
  city: ICity | null
) => {
  const giveCur = givePm.currency.code.toUpperCase();
  const getCur = getPm.currency.code.toUpperCase();
  let [description, cityAddon, site_name] = ["", "", ""];
  if (locale == "ru") {
    description = `Обмен ${capitalize(
      givePm.ru_name || givePm.en_name
    )} ${giveCur} ${givePm.subgroup_name || ""} на ${capitalize(
      getPm.ru_name || getPm.en_name
    )} ${getCur}`;
    if (city) cityAddon = ` в ${city.ru_name}, ${city.ru_country_name}`;
    site_name = `${process.env.NEXT_PUBLIC_NAME} мониторинг обменников`;
  } else {
    if (city) cityAddon = ` в ${city.en_name}, ${city.en_country_name}`;
    description = `Exchange ${capitalize(givePm.en_name)} ${giveCur} ${
      givePm.subgroup_name || ""
    } for ${capitalize(getPm.en_name)} ${getCur}`;
    site_name = `${process.env.NEXT_PUBLIC_NAME} Exchange Monitoring`;
  }
  return description + cityAddon;
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
    alternateLangs: ["en", "ru"].map((l) => ({
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
