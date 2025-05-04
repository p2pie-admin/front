import { ICurrency, IImage } from "./selector";

export type IExchanger = {
  id: string;
  name: string;
  ref_link: string;
  tag?: string;
  admin_rating?: string;
  exchanger_card: {
    en_description?: string;
    ru_description?: string;
    telegram?: string;
    email?: string;
    working_time?: string;
  };
};

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
