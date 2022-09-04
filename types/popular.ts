import { CurrencyType, ImageType, PmType } from "./selector";

export interface IPopularGroup {
  id: string;
  pms: PmType[];
  icon: ImageType;
  en_name: string;
  ru_name: string;
}

export interface IPopular {
  id: string;
  popular_groups: IPopularGroup[];
}
