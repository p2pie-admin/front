import { ICurrency, IImage } from "./selector";

export interface ITopParameter {
  id: string;
  code?: string;
}

export interface IExchangerTemplate {
  id: string;
  include?: string | null;
  exclude?: string | null;
  cities?: string[] | null;
  top_parameter?: ITopParameter | null;
}

export interface IExchangerOffice {
  id: string;
  visible?: boolean;
  coordinates?: string | null;
  city?: string | null;
  exchanger?: string | null;
  working_time?: string | null;
  description?: string | null;
  address?: string | null;
  image?: IImage | null;
}

export type IExchanger = {
  id: string;
  name: string;
  ref_link: string;
  updatedAt?: string;
  tag?: string | null;
  admin_rating?: number | null;
  logo?: IImage | null;
  exchanger_card?: {
    en_description?: string;
    ru_description?: string;
    telegram?: string;
    email?: string;
    working_time?: string;
  } | null;
  exchanger_templates?: IExchangerTemplate[];
  offices?: IExchangerOffice[];
};

export type IExchangerPreview = {
  id: string;
  name: string;
  ref_link: string;
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

export type IExchangerMapOffice = {
  id: string;
  exchangerId: string;
  name: string;
  lat: number;
  lng: number;
  address?: string | null;
  description?: string | null;
  working_time?: string | null;
  ref_link?: string | null;
  tag?: string | null;
  exchanger_card?: IExchanger["exchanger_card"];
  image?: IImage | null;
  visible?: boolean | null;
  usdRate?: number | null;
  contact?: string | null;
  city?: string | null;
};

export type IDotColors = "green" | "orange";
