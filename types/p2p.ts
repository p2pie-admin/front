import { IPm } from "./selector";

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
  currencyConverterRate?: ICurrencyConverterRate;
  usersRate?: IUsersRate;
  mainCur?: string;
  secondaryCur?: string;
  expanded: boolean;
  toUsdRate?: number;
  defRate?: number;
  giveBiggerValueThanGet?: boolean;
}

export interface IP2PRegulation {
  en_title: string;
  ru_title: string;
  en_description: string;
  ru_description: string;
  default_checked: boolean;
}

export interface IP2PRegulationGroup {
  id: string;
  en_title: string;
  ru_title: string;
  regulations: IP2PRegulation[];
}
