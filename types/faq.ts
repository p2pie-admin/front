import { IImage } from "./selector";

export interface IFaq {
  id: string;
  question: string;
  response: string;
}

export interface IFaqCategory {
  id: string;
  code: string;
  description?: string;
  color?: string;
  x_faq: IFaq[];
  image?: IImage;
}
