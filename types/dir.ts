import { IImage, IPm, IPmGroup, ISide } from "./selector";

export interface IPmPointer {
  id: string;
  code: string;
  pm_group: IPmGroup;
}

export interface IDirGroup {
  id: string;
  pms: IPmPointer[];
  icon: IImage;
  en_name: string;
  ru_name: string;
}

export interface IDir {
  id: string;
  groups: IDirGroup[];
}

export interface IActivePetal {
  pm: IPm;
  side: ISide;
}

export interface IMassDirTextId {
  code: string;
  currency: {
    code: string;
  };
  isSell: boolean;
}

export type IMassDirText = {
  header: string;
  subheader: string;
  seo_title: string;
  seo_description: string;
  text: string;
} & IMassDirTextId;
