import { ICities } from "../../types/exchange";
import { IPm } from "../../types/selector";
import { capitalize } from "../main/side/selector/section/PmGroup/helper";

export const fillWords = ({
  givePm,
  getPm,
  cityName,
  text,
}: {
  givePm: IPm;
  getPm: IPm;
  cityName: string;
  text?: string;
}) => {
  const { en_name: giveName, currency: giveCurrency } = givePm;
  const { en_name: getName, currency: getCurrency } = getPm;

  return (text || "")
    .replaceAll("give_name", capitalize(giveName))
    .replaceAll("get_name", capitalize(getName))
    .replaceAll("give_currency", giveCurrency.code.toUpperCase())
    .replaceAll("get_currency", getCurrency.code.toUpperCase())
    .replaceAll("city_name", cityName);
};

export const convertCities = (cities: ICities): ICities => {
  const newCities = {} as ICities;

  for (const key in cities) {
    if (cities.hasOwnProperty(key)) {
      const newKey = cities[key][1].toLowerCase().split(", ")[0];
      newCities[newKey] = cities[key];
    }
  }

  return newCities;
};

export const findSimilarPmPairs = (givePm: IPm, getPm: IPm, pms: IPm[]) => {
  const similar = pms.reduce((res: IPm[][], pm: IPm) => {
    let [pair1, pair2] = [[], []] as [IPm[], IPm[]];
    if (
      pm.currency.code == givePm.currency.code &&
      (pm.section == givePm.section ||
        (givePm.section == "cash" && pm.section == "bank"))
    ) {
      pair1 = [pm, getPm];
    }
    if (
      pm.currency.code == getPm.currency.code &&
      (pm.section == getPm.section ||
        (getPm.section == "cash" && pm.section == "bank"))
    ) {
      pair2 = [givePm, pm];
    }
    return [
      ...res,
      ...(pair1.length ? [pair1] : []),
      ...(pair2.length ? [pair2] : []),
    ];
  }, []);

  const rmInitialPm = similar
    .filter((pair) => {
      return pair[0].code !== givePm.code || pair[1].code !== getPm.code;
    })
    .slice(0, 3);
  return rmInitialPm;
};

export const generateTitle = ({
  locale,
  givePm,
  getPm,
}: {
  locale: "en" | "ru";
  givePm: IPm;
  getPm: IPm;
}) => {
  const U = (str?: string | null) => (str ? str.toUpperCase() : "");
  return locale === "ru"
    ? `Обмен ${capitalize(givePm.ru_name)} ${U(givePm.currency.code)} ${U(
        givePm.subgroup_name
      )} на ${capitalize(getPm.ru_name)} ${U(getPm.currency.code)} ${U(
        getPm.subgroup_name
      )}`
    : `Exchange ${capitalize(givePm.en_name)} ${U(givePm.currency.code)} ${U(
        givePm.subgroup_name
      )} to ${capitalize(getPm.en_name)} ${U(getPm.currency.code)} ${U(
        getPm.subgroup_name
      )}`;
};

export const exchangeToSlugCity = (exchange: string) => {
  return exchange.includes("-in-")
    ? [exchange.split("-in-")[0], exchange.split("-in-")[1]]
    : [exchange, ""];
};

export const slugCityToExchange = (slug: string, city?: string) => {
  return `${slug}${city ? "-in-" + city : ""}`;
};

// const createURL = ({slug, locale, city}: {slug: string, locale: "en" | "ru", city: string}) => {
//   const startWord = locale == "ru" ? "obmen" : "exchange"
//   const middleWord = locale == "ru" ? "na" : "to"
//   return `${locale}/${startWord}-${slug}`
// }
