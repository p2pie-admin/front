import { IImage } from "./selector";

export type ISides = "give" | "get";
export type ILimit = { [key in ISides]: number };

export interface IDirRates {
  [key: string]: IRate;
}

export interface IRate {
  name: string;
  tags?: string[];
  admin_rating: number;
  course: number;
  min_fee: string;
  from_fee: string;
  to_fee: string;
  min: ILimit;
  max: ILimit;
  reserve: ILimit;
  param: string;
  cities?: { [key: string]: string[] };
}

export interface ITop {
  ru_description: string;
  en_description: string;
  code: string;
  title: string;
  color: string;
  image?: IImage;
}
export type ExchangerId = string;

export interface IDirParserResp {
  uniqueRates: IDirRates;
  bestRates: IDirRates; // это задачка с дождем, чтобы в зависимости от суммы выдавался результат
}
