export type ITone =
  | "shaded"
  | "dark"
  | "black"
  | "error"
  | "peach"
  | "violet"
  | "gray"
  | "light"
  | "white";

export type IVariant = "contrast" | "extra_contrast" | "no_contrast";
export interface ICityCodesList {
  [key: string]: [string, string];
}

export interface ICity {
  ru_name: string;
  en_name: string;
  code: string;
}

export interface IFormattedCountry {
  cities: ICity[];
  ru_name: string;
  en_name: string;
}

export interface ILocation {
  en_country_name: string;
  ru_country_name?: string;
  en_city_name: string;
  ru_city_name?: string;
  code?: string;
}
