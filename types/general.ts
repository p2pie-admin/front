import { IImage } from "./selector";

export type IToast = {
  title: string;
  status: "success" | "error" | "warning" | "info";
};

export type IDirRatesStatus = "fulfilled" | "rejected" | "pending";

export type IExchanger = {
  name: string;
  id: string;
  rates_link: string;
  ref_link?: string;
  tag?: string | null;
  admin_rating?: number;
  description: string;
};
