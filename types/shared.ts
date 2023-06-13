export type ITone =
  | "shaded"
  | "dark"
  | "black"
  | "error"
  | "primary"
  | "secondary"
  | "gray"
  | "light"
  | "white";

export interface ICitiesList {
  [key: string]: [string, string];
}
