import { IImage } from "./selector";

export interface IFaq {
  id: string;
  question: string;
  response: string;
  // English versions; may be missing (then the Russian text is shown).
  en_question?: string | null;
  en_response?: string | null;
}

export interface IFaqCategory {
  id: string;
  code: string;
  description?: string;
  en_description?: string | null;
  color?: string;
  x_faqs: IFaq[];
  image?: IImage;
}
