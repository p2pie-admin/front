import { ICurrency, IImage } from "./selector";

export interface IPhysicalRate {
  id: string;
  currency?: ICurrency;
  selling: number;
  buying: number;
}

export interface IPhysicalExchanger {
  id: string;
  name?: string;
  lng: number;
  lat: number;
  contact: string;
  opened: boolean;
  photo?: IImage;
  days_off?: string[];
  updatedAt: string;
  physical_rates?: IPhysicalRate[];
}
