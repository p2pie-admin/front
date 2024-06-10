import { IImage } from "./selector";

export interface IArticle {
  id: string;
  header: string;
  subheader?: string;
  section?: string;
  time_to_read?: number;
  updatedAt?: string;
  chapters: IChapter[];
}

export interface IChapter {
  id: string;
  title?: string;
  text: string;
  link?: ILink[];
  disclaimer?: IDisclaimer;
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
