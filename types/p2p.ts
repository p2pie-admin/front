import { IImage, IPm } from "./selector";
import { ILocation } from "./shared";

export interface ICurrencyConverterRate {
  rate: number;
  giveToUSD: number;
  getToUSD: number;
}

export interface IUsersRate {
  rate: [string, number, number];
  min: [string, number, number];
  max: [string, number, number];
}

export interface IP2PDir {
  deleted: boolean;
  give?: IPm[];
  get?: IPm[];
  ccRates?: ICurrencyConverterRate;
  usersRate?: IUsersRate;
  mainCur?: string;
  secondaryCur?: string;
  expanded: boolean;
  toUsdRate?: number;
  defRate?: number;
  giveBiggerValueThanGet?: boolean;
}

export interface IP2PRegulation {
  id: string;
  en_title: string;
  ru_title: string;
  en_description: string;
  ru_description: string;
  default_checked: boolean;
  has_article: boolean;
}

export type IP2PRegulationCodes = { [key: string]: boolean };

export interface IP2PRegulationGroup {
  id: string;
  en_title: string;
  ru_title: string;
  regulations: IP2PRegulation[];
}

export interface IP2PStep {
  en_title: string;
  ru_title: string;
  en_description: string;
  ru_description: string;
  en_stepper_title: string;
  ru_stepper_title: string;
  en_stepper_description: string;
  ru_stepper_description: string;
  component: any;
}

export interface IOrder {
  uid: string;
  id?: string;
  dirs: IP2PDir[];
  regulationCodes?: IP2PRegulationCodes;
  locations: ILocation[];
  name?: string;
  status?: "active" | "suspended" | "disabled";
  info?: string;
}

export interface IOrderIntro {
  id: string;
  en_header: string;
  ru_header: string;
  en_description: string;
  ru_description: string;
  image: IImage;
}
