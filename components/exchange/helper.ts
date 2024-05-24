import { ICities, ITextLayout } from "../../types/exchange";
import { IPm } from "../../types/selector";
import { capitalize } from "../main/side/selector/section/PmGroup/helper";

export function ifMobile(userAgent: string): boolean {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
  return isMobile;
}

export const generateText = ({
  givePm,
  getPm,
  cityName,
  textLayouts,
  locale,
}: {
  givePm: IPm;
  getPm: IPm;
  cityName: string;
  textLayouts: ITextLayout[];
  locale: "ru" | "en";
}): string => {
  const getWeight = (giveSection: string, getSection: string) => {
    return giveSection === givePm.section && getSection === getPm.section
      ? 4
      : giveSection === givePm.section && getSection === "all"
      ? 3
      : giveSection === "all" && getSection === getPm.section
      ? 2
      : giveSection === "all" && getSection === "all"
      ? 1
      : 0;
  };

  const layoutWeights = textLayouts.map((ly) => {
    const [giveSection, getSection] = ly.section_pair.split("_");
    return { weight: getWeight(giveSection, getSection), ly };
  });
  let layout = layoutWeights[0];

  for (const lw of layoutWeights) {
    if (lw.weight > layout.weight) {
      layout = lw;
    }
  }

  const { en_name: giveName, currency: giveCurrency } = givePm;
  const { en_name: getName, currency: getCurrency } = getPm;

  return layout.ly
    ? layout.ly[`${locale}_layout`]
        .replaceAll("name1", capitalize(giveName))
        .replaceAll("name2", capitalize(getName))
        .replaceAll("cur1", giveCurrency.code.toUpperCase())
        .replaceAll("cur2", getCurrency.code.toUpperCase())
        .replaceAll("cityName", cityName)
    : "";
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
