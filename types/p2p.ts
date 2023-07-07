import { IPm } from "./selector";

export interface ICurrencyConverterRate {
  rate: number;
  giveToUSD: number;
  getToUSD: number;
}

export interface IP2PDir {
  give?: IPm;
  get?: IPm;
  currencyConverterRate?: ICurrencyConverterRate;
  isVisible?: boolean;
}

export interface IP2P {
  dirs: IP2PDir[];
}
