import { ReactNode } from "react";
import { IImage } from "./selector";

export type IToast = {
  title: ReactNode;
  status: "success" | "error" | "warning" | "info";
  timeBeforeClosing?: number;
};

export type ILoadingStatus = "fulfilled" | "rejected" | "pending";

export type BreadcrumbItem = {
  position: number;
  name: string;
  item: string;
};
export type ISEO = {
  title: string;
  description: string;
  canonicalSlug: string;
  keywords?: string | null;
  updatedAt?: string | null;
  breadcrumbs?: BreadcrumbItem[];
  // Thin pages (e.g. a direction with almost no offers) are kept but hidden from search.
  noindex?: boolean;
};
