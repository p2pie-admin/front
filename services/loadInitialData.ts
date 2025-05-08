import { initParserFetcher } from "./fetchers";
import { mylog } from "./utils";

export const loadInitialData = async () => {
  try {
    const parserFetcher = initParserFetcher();
    const possiblePairs = (await parserFetcher("possible_pairs")) as {
      [key: string]: string[];
    };
  } catch (e) {
    mylog(String(e), "error");
  }
};
