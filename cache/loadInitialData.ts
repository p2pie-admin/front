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
  if (process.env.NODE_ENV == "production" && cache[key])
    return cache[key] as T;

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

export const loadArticleCodes = async () => {
  const articleCodes = (await safeFetch("articleCodes", () =>
    cmsFetcher(articleCodesQuery)
  )) as Promise<{ id: undefined; code: string }[]>;
  return (await articleCodes).map((res) => res.code);
};

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
  )) as Promise<IExchanger[]>;
  return (await exchanger)[0];
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

export const fetchPmLayouts = async (
  locale: "en" | "ru"
): Promise<IPmLayout[]> => {
  const fetcher = initCMSFetcher();
  const pmLayoutsRes = await fetcher(pmLayoutsQuery, { locale });
  return pmLayoutsRes as IPmLayout[];
};

export const fetchDirsTexts = async (
  locale: "en" | "ru"
): Promise<IDirText[]> => {
  const fetcher = initCMSFetcher();
  const dirsTextsRes = await fetcher(dirsTextsQuery, { locale });
  return dirsTextsRes as IDirText[];
};
//// SELECTORS

export const emptyProps = (locale: "en" | "ru") => ({
  pm: null,
  locale,
  article: null,
  otherDirs: null,
});
