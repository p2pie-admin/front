import { IImage } from "./selector";

export type IToast = {
  title: string;
  status: "success" | "error" | "warning" | "info";
};

export type IDirRatesStatus = "fulfilled" | "rejected" | "pending";

export type BreadcrumbItem = {
  position: number;
  name: string;
  item: string;
};
export type ISEO = {
  title: string;
  description: string;
  canonicalPath: string;
  locale: "en" | "ru";
  updatedAt: string;
  breadcrumbs?: BreadcrumbItem[];
  alternateLangs?: { rel: string; hrefLang: string; href: string }[];
};
