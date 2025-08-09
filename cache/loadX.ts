import { initCMSFetcher, initParserFetcher } from "../services/fetchers";
import {
  TextBoxQuery,
  MainTextsQuery,
  pmLayoutsQuery,
  dirsTextsQuery,
  articleCodesQuery,
  articlesQuery,
  articleQuery,
  selectorQuery,
  exchangerQuery,
  exchangersQuery,
  citiesQuery,
} from "../services/initialQueries";
import { getPmsFromSelector, mergeExchangers } from "./helper";
import { cachedFetch } from "./cache";
import { ICity, IDirText, IPmLayout } from "../types/exchange";

const cmsFetcher = initCMSFetcher();
const parserFetcher = initParserFetcher();

export const TTL = {
  root_text: 3600,
  main_texts: 3600,
  exchangers: 600,
  pmLayouts: 3600,
  dirsTexts: 3600,
  articleCodes: 1800,
  articles: 1800,
  article: 1800,
  possible_pairs: 300,
  selector: 3600,
  exchanger: 600,
  cms_exchangers: 600,
  parser_exchangers: 600,
  cities: 86400,
};

export const loadRootText = (locale: "en" | "ru") =>
  cachedFetch(`root_text_${locale}`, TTL.root_text, async () => {
    const res = await cmsFetcher(TextBoxQuery, { locale, key: "root" });
    return res?.[0] || null;
  });

export const loadMainTexts = (locale: "en" | "ru") =>
  cachedFetch(`main_texts_${locale}`, TTL.main_texts, () =>
    cmsFetcher(MainTextsQuery, { locale })
  );

export const loadParserExchangers = () =>
  cachedFetch("exchangers", TTL.exchangers, () => parserFetcher("exchangers"));

export const loadPmLayouts = (locale: "en" | "ru") =>
  cachedFetch(
    `pmLayouts_${locale}`,
    TTL.pmLayouts,
    () => cmsFetcher(pmLayoutsQuery, { locale }) as Promise<IPmLayout[]>
  );

export const loadDirsTexts = (locale: "en" | "ru") =>
  cachedFetch(
    `dirsTexts_${locale}`,
    TTL.dirsTexts,
    () => cmsFetcher(dirsTextsQuery, { locale }) as Promise<IDirText[]>
  );

export const loadArticleCodes = () =>
  cachedFetch("articleCodes", TTL.articleCodes, async () => {
    const res = await cmsFetcher(articleCodesQuery);
    return res.map((a: any) => a.code) as string[];
  });

export const loadArticles = () =>
  cachedFetch("articles", TTL.articles, () => cmsFetcher(articlesQuery));

export const loadArticle = (code: string, locale: "en" | "ru") =>
  cachedFetch(`article_${code}_${locale}`, TTL.article, () =>
    cmsFetcher(articleQuery, { code, locale })
  );

export const loadPossiblePairs = () =>
  cachedFetch("possible_pairs", TTL.possible_pairs, () =>
    parserFetcher("possible_pairs")
  );

export const loadPms = async () => {
  const selector = await cachedFetch("selector", TTL.selector, () =>
    cmsFetcher(selectorQuery)
  );
  return getPmsFromSelector(selector);
};

export const loadExchanger = (name: string) =>
  cachedFetch(`exchanger_${name}`, TTL.exchanger, async () => {
    const res = await cmsFetcher(exchangerQuery, { name });
    return res?.[0] || null;
  });

export const loadExchangers = async () => {
  const [cmsExchangers, parserExchangers] = await Promise.all([
    cachedFetch("cms_exchangers", TTL.cms_exchangers, () =>
      cmsFetcher(exchangersQuery)
    ),
    cachedFetch("parser_exchangers", TTL.parser_exchangers, () =>
      parserFetcher("exchangers")
    ),
  ]);
  return mergeExchangers(cmsExchangers, parserExchangers);
};

export const loadCities = () =>
  cachedFetch("cities", TTL.cities, async () => {
    const res = await cmsFetcher(citiesQuery);
    return (res?.cities || []) as ICity[];
  });
