import { IImage } from "./selector";

export interface IArticle {
  id: string;
  time_to_read?: number;
  updatedAt?: string;
  header: string;
  subheader: string;
  stats: { [key: string]: string };
  chapters: {
    title: string;
    text: string;
  }[];
}

export interface ILink {
  id: string;
  text: string;
  href: string;
  isExternal: boolean;
  isBlank: boolean;
}

export interface IDisclaimer {
  id: string;
  title: string;
  text: string;
  color: "green" | "yellow" | "red";
}

export interface IMainText {
  id: string;
  title?: string;
  description?: string;
  image?: IImage;
  link: ILink;
}

export interface ITextBox {
  id: string;
  title?: string;
  subtitle?: string;
  text?: string;
}
