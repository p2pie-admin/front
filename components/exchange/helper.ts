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
