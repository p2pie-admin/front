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
export type ITextVariant =
  | "contrast"
  | "extra_contrast"
  | "no_contrast"
  | "shaded"
  | "red"
  | "green"
  | "primary";

export interface IFingerprint {
  ip: string;
}
