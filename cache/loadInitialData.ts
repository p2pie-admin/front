import {
  ICity,
  IPossiblePmPair,
  IDirText,
  ICache,
  IPmLayout,
  ILocalData,
} from "../types/exchange";
import { IExchanger, IParserExchanger } from "../types/exchanger";
import { ISelector, IPmGroup, ISection, IPm } from "../types/selector";
import { initCMSFetcher, initParserFetcher } from "../services/fetchers";
import {
  selectorQuery,
  citiesQuery,
  pmLayoutsQuery,
  dirsTextsQuery,
  exchangersQuery,
  articleCodesQuery,
  articlesQuery,
  articleQuery,
  MainTextsQuery,
  TextBoxQuery,
  exchangerQuery,
} from "../services/initialQueries";
import { mylog } from "../services/utils";
import { IArticle, IMainText, ITextBox } from "../types/pages";

import { getPmsFromSelector, getSlugToCodes, mergeExchangers } from "./helper";
import { readCache, writeCache } from ".";
import exchanger from "../components/exchangers/exchanger";

// FETCHERS

const parserFetcher = initParserFetcher();
const cmsFetcher = initCMSFetcher();

type FetchKey = string;

// кешируем только при билде, чтобы не грузить лишний раз
const safeFetch = async <T>(
  key: FetchKey,
  fetcher: () => Promise<T>
): Promise<T> => {
  const cache = readCache() || {};
  if (cache[key]) return cache[key] as T;

  try {
    const data = await fetcher();
    writeCache({ ...cache, [key]: data });
    return data;
  } catch (e) {
    console.error(`Failed to fetch ${key}:`, e);
    return {} as T;
  }
};

export const loadRootText = async (locale: "en" | "ru") =>
  await safeFetch("root_text", async () => {
    const textBoxes = await cmsFetcher(TextBoxQuery, { locale, key: "root" });
    return textBoxes[0] || null;
  });
export const loadMainTexts = async (locale: "en" | "ru") =>
  await safeFetch("main_texts", async () => {
    const mainTexts = await cmsFetcher(MainTextsQuery, { locale });
    return mainTexts || null;
  });

export const loadParserExchangers = () =>
  safeFetch("exchangers", () => parserFetcher("exchangers"));

export const loadPmLayouts = () =>
  safeFetch("pmLayouts", () => cmsFetcher(pmLayoutsQuery)) as Promise<
    IPmLayout[]
  >;
export const loadDirsTexts = () =>
  safeFetch("dirsTexts", () => cmsFetcher(dirsTextsQuery)) as Promise<
    IDirText[]
  >;

export const loadArticlesCodes = () =>
  safeFetch("articleCodes", () => cmsFetcher(articleCodesQuery)) as Promise<
    string[]
  >;

export const loadArticles = () =>
  safeFetch("articles", () => cmsFetcher(articlesQuery)) as Promise<IArticle[]>;

export const loadArticle = (code: string, locale: "en" | "ru") =>
  safeFetch(`article_${code}_${locale}`, () =>
    cmsFetcher(articleQuery, { code, locale })
  ) as Promise<IArticle[]>;

export const loadPossiblePairs = () =>
  safeFetch("possible_pairs", () => parserFetcher("possible_pairs")) as Promise<
    Record<string, string[]>
  >;
export const loadPms = async () => {
  const selector = (await safeFetch("selector", () =>
    cmsFetcher(selectorQuery)
  )) as ISelector;
  const pms = getPmsFromSelector(selector);
  return pms;
};

export const loadExchanger = async (
  name: string
): Promise<IExchanger | null> => {
  const exchanger = (await safeFetch(`exchanger_${name}`, async () =>
    cmsFetcher(exchangerQuery, { name })
  )) as Promise<IExchanger>;
  return exchanger;
};

export const loadExchangers = async () => {
  const [cmsExchangers, parserExchangers] = await Promise.all([
    safeFetch("cms_exchangers", () => cmsFetcher(exchangersQuery)) as Promise<
      IExchanger[]
    >,
    safeFetch("parser_exchangers", () =>
      parserFetcher("exchangers")
    ) as Promise<Record<string, IParserExchanger>>,
  ]);
  const exchangers = mergeExchangers(cmsExchangers, parserExchangers);
  return exchangers;
};

export const loadCities = () =>
  safeFetch("cities", async () => {
    const parserSettings = (await cmsFetcher(citiesQuery)) as {
      cities: ICity[] | null;
    };
    return parserSettings?.cities;
  }) as Promise<ICity[]>;

export const fetchLocalizedData = async (
  locale: "en" | "ru"
): Promise<ILocalData> => {
  const fetcher = initCMSFetcher();

  const [pmLayoutsRes, dirsTextsRes, articlesRes] = await Promise.all([
    fetcher(pmLayoutsQuery, { locale }),
    fetcher(dirsTextsQuery, { locale }),
    fetcher(articlesQuery, { locale }),
  ]);

  return {
    pmLayouts: pmLayoutsRes as IPmLayout[],
    dirsTexts: dirsTextsRes as IDirText[],
    articles: articlesRes as IArticle[],
  };
};

//// SELECTORS

export const emptyProps = (locale: "en" | "ru") => ({
  pm: null,
  locale,
  article: null,
  otherDirs: null,
});

// грузит все подряд, универсальная, для getStaticPaths
// export const loadStaticData = async () => {
//   try {
//     const cache = (await readCache()) as ICache | undefined;
//     if (cache) {
//       return cache;
//     }

//     // Wait for all to complete
//     const [
//       possiblePairs,
//       selector,
//       exchangers,
//       enData,
//       ruData,
//     ] = await Promise.all([
//       loadPossiblePairs(),
//       loadSelector(),
//       loadExchangers(),
//       fetchLocalizedData("en"),
//       fetchLocalizedData("ru"),
//     ]);

//     const pms: IPm[] = getPmsFromSelector(selector);
//     const slugToCodes = getSlugToCodes(
//       possiblePairs as Record<string, string[]>,
//       pms
//     );

//     const cities = parserSetting.cities as ICity[];

//     const staticCache: ICache = {
//       possiblePairs,
//       pms,
//       slugToCodes,
//       cities,
//       enData,
//       ruData,
//       exchangers,
//     };

//     writeCache(staticCache);
//     return staticCache;
//   } catch (e) {
//     mylog(`[staticCache] Error: ${String(e)}`, "error");
//   }
// };
