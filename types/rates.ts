import { IImage } from "./selector";

export type ISides = "give" | "get";
export type ILimit = { [key in ISides]: number };

export interface IRate {
  exchangerId: string;
  name: string;
  tag?: string; // pro , p2p, new ...
  admin_rating: number;
  course: number;
  p2pRatio?: number;
  min_fee: string;
  from_fee: string;
  to_fee: string;
  min: ILimit;
  max: ILimit;
  reserve: ILimit;
  parameterCodes?: string[];
  cities?: { [key: string]: string[] };
  ref_link?: string;
}

export interface IParameter {
  id: string;
  code: string;
  en_name: string;
  ru_name: string;
  color: string;
  parameter: {
    id: string;
    en_description: string;
    ru_description: string;
    icon: IImage;
  };
}

export type ExchangerId = string;

export interface IPopularDirRates {
  [key: string]: {
    buy: IPopularRate[];
    sell: IPopularRate[];
  };
}

export interface IPopularRate {
  exchangerId: string;
  course: number;
  fiat: string;
}
