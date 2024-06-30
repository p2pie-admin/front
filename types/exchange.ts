import { IPm } from "./selector";

export type ISectionName = "crypto" | "bank" | "cash" | "digital" | "transfer";

export interface IPmsText {
  id: string;
  section: ISectionName;
  description: string;
  articles: { code: string }[];
}

export interface IDirText {
  id: string;
  section_give: ISectionName;
  section_get: ISectionName;
  text: string;
  title: string;
  updatedAt: string;
}

export interface IPath {
  params: {
    exchange: string;
  };
  locale: string;
}
export interface ICache {
  pms: IPm[];
  slugToCodes: { [key: string]: string }; // для запроса курсов
  articleCodes: string[];
  cities: ICities;
  exchangePaths: IPath[];
}

export interface IPossiblePmPair {
  givePm?: IPm;
  getPm?: IPm;
}

export interface ICities {
  [key: string]: [string, string];
}

export interface IPmPairs {
  slug: string;
  givePm?: IPm;
  getPm?: IPm;
}
