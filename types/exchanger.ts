import { ICurrency, IImage } from "./selector";

export interface IExchangerData {
  id: string;
  name: string;
  description?: string;
  logo: IImage;
  status: string;
  tag: string;
  date_listed: string;
  ref_link: string;
  admin_rating: number;
}

export interface IPhysicalRate {
  id: string;
  currency: ICurrency;
  buy_price: number;
  sell_price: number;
}

export interface IPhysicalExchanger {
  id: string;
  name: string;
  lng: number;
  lat: number;
  contact: string;
  opened: boolean;
  photo: IImage;
  days_off: string[];
  updatedAt: string;
  physical_rates: IPhysicalRate[];
}
