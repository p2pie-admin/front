import { IPm } from "./selector";

export interface ICurrencyConverterRate {
  rate: number;
  giveToUSD: number;
  getToUSD: number;
}

export interface IUsersRate {
  rate: number[];
  min: number[];
  max: number[];
}

export interface IP2PDir {
  give?: IPm[];
  get?: IPm[];
  currencyConverterRate?: ICurrencyConverterRate;
  usersRate?: IUsersRate;
  mainCur?: string;
  secondaryCur?: string;
  isVisible: boolean;
  toUsdRate?: number;
  defRate?: number;
  giveBiggerValueThanGet?: boolean;
}

export interface IP2P {
  dirs: IP2PDir[];
}
