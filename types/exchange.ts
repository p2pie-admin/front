import { IPm } from "./selector";

export interface ITextLayout {
  id: string;
  en_layout: string;
  ru_layout: string;
  section_pair: string;
}

export interface ICache {
  dirSlugPairs: { [key: string]: { givePm: IPm; getPm: IPm } };
  articleCodes: { id: string; code: string }[];
  textLayouts: ITextLayout[];
  cities: {
    [key: string]: [string, string];
  };
}

export interface IPossiblePmPair {
  givePm?: IPm;
  getPm?: IPm;
}

export interface ICities {
  [key: string]: [string, string];
}
