import { IImage } from "./selector";

export type IToast = {
  title: string;
  status: "success" | "error" | "warning" | "info";
};

export type IDirRatesStatus = "fulfilled" | "rejected" | "pending";
