export type ITone =
  | "shaded"
  | "dark"
  | "black"
  | "error"
  | "primary"
  | "secondary"
  | "gray"
  | "light"
  | "white";

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
