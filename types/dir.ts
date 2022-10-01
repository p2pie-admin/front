import { CurrencyType, ImageType, PmType } from "./selector";

export interface IDirGroup {
  id: string;
  pms: PmType[];
  icon: ImageType;
  en_name: string;
  ru_name: string;
}

export interface IDir {
  id: string;
  groups: IDirGroup[];
}
