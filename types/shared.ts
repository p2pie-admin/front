export type ITone =
  | "shaded"
  | "dark"
  | "black"
  | "error"
  | "peach"
  | "violet"
  | "gray"
  | "light"
  | "white";

export type IVariant = "contrast" | "extra_contrast" | "no_contrast";

export interface IFingerprint {
  ip: string;
}

export type SeoProps = {
  title: string;
  description: string;
  canonical: string;
  locale: "en" | "ru";
  type?: "article" | "website";
  openGraphData?: Record<string, any>;
  breadcrumbs?: { name: string; item: string }[];
};
