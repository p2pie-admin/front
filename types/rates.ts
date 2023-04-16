import { IImage } from "./selector";

export type ISides = "give" | "get";
export type ILimit = { [key in ISides]: number };

export interface IRate {
  exchangerId: string;
  name: string;
  tag?: string; // pro , p2p, new ...
  admin_rating: number;
  course: number;
  min_fee: string;
  from_fee: string;
  to_fee: string;
  min: ILimit;
  max: ILimit;
  reserve: ILimit;
  parameterCodes: string[];
  cities?: { [key: string]: string[] };
}

export interface IParam {
  id: string;
  ru_description?: string;
  en_description?: string;
  code: string;
  en_name?: string;
  ru_name?: string;
  icon: IImage;
}
export type ExchangerId = string;
