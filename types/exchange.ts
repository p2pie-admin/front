import { IPm } from "./selector";

export interface ICache {
  dirSlugPairs: { [key: string]: { givePm: IPm; getPm: IPm } };
  articleCodes: { id: string; code: string }[];
}
