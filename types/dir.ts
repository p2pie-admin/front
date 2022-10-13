import { ImageType, PmGroupType } from "./selector";

export interface IPmPointer {
  id: string;
  code: string;
  pm_group: PmGroupType;
}

export interface IDirGroup {
  id: string;
  pms: IPmPointer[];
  icon: ImageType;
  en_name: string;
  ru_name: string;
}

export interface IDir {
  id: string;
  groups: IDirGroup[];
}
