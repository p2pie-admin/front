import { IImage } from "./selector";

export interface IExchangerData {
  id: string;
  name: string;
  description?: string;
  logo: IImage;
  status: string;
  tag: string;
  date_listed: string;
  ref_link: string;
  admin_rating: number;
}
