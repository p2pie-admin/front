import { ICurrency, IImage } from "./selector";

export type IExchanger = {
  id: string;
  name: string;
  ref_link: string;
  updatedAt: string;
  tag?: string;
  admin_rating?: string;
  exchanger_card: {
    en_description?: string;
    ru_description?: string;
    telegram?: string;
    email?: string;
    working_time?: string;
  };
};

export type IExchangerStatus = "active" | "suspended" | "disabled";

export type IErrorCode =
  | "no-rates"
  | "ENOTFOUND"
  | "ECONNREFUSED"
  | "ECONNRESET"
  | "ETIMEDOUT"
  | "EPERM"
  | "ECONNABORTED"
  | "CERT_HAS_EXPIRED"
  | "ERR_FR_TOO_MANY_REDIRECTS"
  | "307"
  | "403"
  | "404"
  | "500"
  | "503"
  | "522"
  | "json-parsing-error"
  | "data-error"
  | "exchanger-custom-error"
  | "unknown";

export interface IExchangerParsingError {
  comment?: string;
  autoMessage?: string;
  code?: IErrorCode;
  codeExplanation?: string;
}

export interface IExchangerParsingInfo {
  rates: number;
  comment?: string;
}

export type IParserExchanger = {
  name: string;
  id: string;
  status: IExchangerStatus;
  total_rates?: number;
  skip?: number;
  error?: IExchangerParsingError;
  info?: IExchangerParsingInfo;
  warnings?: { [key: string]: string };
};

export interface IPhysicalRate {
  id: string;
  currency?: ICurrency;
  selling: number;
  buying: number;
}

export interface IPhysicalExchanger {
  id: string;
  name?: string;
  lng: number;
  lat: number;
  contact: string;
  opened: boolean;
  photo?: IImage;
  days_off?: string[];
  updatedAt: string;
  physical_rates?: IPhysicalRate[];
}

export type IDotColors = "green" | "orange";
