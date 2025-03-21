import { IImage } from "./selector";

export type IToast = {
  title: string;
  status: "success" | "error" | "warning" | "info";
};

export type IDirRatesStatus = "fulfilled" | "rejected" | "pending";

export type IExchanger = {
  name: string;
  id: string;
  ref_link: string;
  tag?: string | null;
  admin_rating?: number;
  ru_description?: string;
  en_description?: string;
  email?: string;
  telegram?: string;
  working_time?: string;
  date_listed?: string;
};
