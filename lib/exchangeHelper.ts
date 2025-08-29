import { useRouter } from "next/router";
import { capitalize } from "../components/main/side/selector/section/PmGroup/helper";
import { mylog } from "../services/utils";
import { ICity, IDirText, ISeoData } from "../types/exchange";
import { IPm } from "../types/selector";
import { loadDirText } from "../cache/loadX";

export const generateH1 = (
  givePm: IPm,
  getPm: IPm,
  locale: string,
  city: ICity | null
) => {
  const giveCur = givePm.currency.code.toUpperCase();
  const getCur = getPm.currency.code.toUpperCase();
  let [description, cityAddon, site_name] = ["", "", ""];
  if (locale == "ru") {
    description = `Обмен ${givePm.ru_name || givePm.en_name} ${giveCur} ${
      givePm.subgroup_name || ""
    } на ${getPm.ru_name || getPm.en_name} ${getCur}`;
    if (city) cityAddon = ` в ${city.ru_name}, ${city.ru_country_name}`;
    site_name = `${process.env.NEXT_PUBLIC_NAME} мониторинг обменников`;
  } else {
    if (city) cityAddon = ` в ${city.en_name}, ${city.en_country_name}`;
    description = `Exchange ${givePm.en_name} ${giveCur} ${
      givePm.subgroup_name || ""
    } for ${getPm.en_name} ${getCur}`;
    site_name = `${process.env.NEXT_PUBLIC_NAME} Exchange Monitoring`;
  }
  return description + cityAddon;
};

export const dirTextHandler = async (
  customDirText: IDirText,
  description: string,
  givePm: IPm,
  getPm: IPm
) => {
  if (!customDirText.id) {
    // генерируем из шаблонов
    const dirTextLayout = await loadDirText();
  }
  if (!customDirText.title) {
    // генерируем из шаблонов
    mylog("description was generated from default layout", "warning");
    return { ...customDirText, title: description };
  }
  return customDirText;
};

export const fillWords = ({
  givePm,
  getPm,
  cityCountry,
  title,
}: {
  givePm: IPm;
  getPm: IPm;
  cityCountry?: string;
  title?: string;
}) => {
  const { locale } = useRouter() as { locale: "en" | "ru" };

  return (title || "")
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
    .replaceAll(
      "city_name",
      cityCountry
        ? `${cityCountry.split(" / ")[0]}, ${cityCountry.split(" / ")[1]}`
        : ""
    );
};

// export const convertCities = (cities: ICity[]): ICities => {
//   const newCities = {} as ICities; //changes key from BTM -> batumi
//   mylog(cities);
//   for (const key in cities) {
//     if (cities.hasOwnProperty(key)) {
//       const newKey = cities[key][1].toLowerCase().split(", ")[0];
//       newCities[newKey] = cities[key];
//     }
//   }

//   return newCities;
// };

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

// export const createLocation = (fullCity?: [string, string]) => {
//   if (!fullCity || !fullCity.length) return null;
//   const location = {
//     en_city_name: fullCity[1].split(", ")[0],
//     en_country_name: fullCity[1].split(", ")[1],
//     ru_city_name: fullCity[0].split(", ")[0],
//     ru_country_name: fullCity[0].split(", ")[1],
//   } as ICity;
//   return location;
// };

// const createURL = ({slug, locale, city}: {slug: string, locale: "en" | "ru", city: string}) => {
//   const startWord = locale == "ru" ? "obmen" : "exchange"
//   const middleWord = locale == "ru" ? "na" : "to"
//   return `${locale}/${startWord}-${slug}`
// }

export const generateExchangeSeo = (seoData: ISeoData) => {
  const { givePm, getPm, locale, customDescription, slug, city } = seoData;

  const title = generateH1({
    locale,
    givePm,
    getPm,
    city,
  });

  return {
    title,
    description,
    canonicalPath: `${locale}/${slugCityToExchange(slug, city?.en_name)}`,
    locale,
    alternateLangs: [
      {
        rel: "alternate",
        hrefLang: "en",
        href: `https://${
          process.env.NEXT_PUBLIC_NAME
        }.com/en/${slugCityToExchange(slug, city?.en_name)}`,
      },
      {
        rel: "alternate",
        hrefLang: "ru",
        href: `https://${
          process.env.NEXT_PUBLIC_NAME
        }.com/ru/${slugCityToExchange(slug, city?.en_name)}`,
      },
    ],
    breadcrumbs: [
      {
        position: 1,
        name: locale === "en" ? "Home" : "Главная",
        item: `https://${process.env.NEXT_PUBLIC_NAME}.com/${locale}`,
      },
      {
        position: 2,
        name: title,
        item: `https://${
          process.env.NEXT_PUBLIC_NAME
        }.com/${locale}/${slugCityToExchange(slug, city?.en_name)}`,
      },
    ],
  };
};
