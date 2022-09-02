import { CurrencyType, ImageType } from "./selector";

export interface IPM {
  code: string;
  en_name: string;
  ru_name: string;
  short_name: string;
  icon: ImageType;
  currency: CurrencyType;
}

export interface IPopularGroup {
  id: string;
  pms: IPM[];
  icon: ImageType;
  en_name: string;
  ru_name: string;
}

export interface IPopular {
  id: string;
  popular_groups: IPopularGroup[];
}
