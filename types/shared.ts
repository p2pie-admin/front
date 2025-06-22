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
