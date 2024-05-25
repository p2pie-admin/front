import { IPm } from "./selector";

export interface ITextLayout {
  id: string;
  en_layout: string;
  ru_layout: string;
  section_pair: string;
}

export interface ICache {
  slugPmsObject: { [key: string]: IPossiblePmPair };
  articleCodes: { id: string; code: string }[];
  textLayouts: ITextLayout[];
  cities: {
    [key: string]: [string, string];
  };
  paths: {
    params: {
      slug: string;
      city?: string[];
    };
    locale: string;
  }[];
}

export interface IPossiblePmPair {
  givePm?: IPm;
  getPm?: IPm;
}

export interface ICities {
  [key: string]: [string, string];
}
