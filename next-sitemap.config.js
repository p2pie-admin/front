// FETCHERS

import { readCache, writeCache } from "./cache";
import { getPmsFromSelector, mergeExchangers } from "./cache/helper";
import { initParserFetcher, initCMSFetcher } from "./services/fetchers";
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
} from "./services/initialQueries";

const parserFetcher = initParserFetcher();
const cmsFetcher = initCMSFetcher();

// кешируем только при билде, чтобы не грузить лишний раз
const isBuildTime = process.env.NEXT_PHASE === "phase-production-build";

// ✅ Safe read cache helper
const safeReadCache = () => {
  try {
    const cache = readCache();
    if (cache && typeof cache === "object") {
      return cache;
    }
    return {};
  } catch (e) {
    console.error("Error reading cache:", e);
    return {};
  }
};

const safeFetch = async (key, fetcher) => {
  const shouldUseCache = isBuildTime;

  if (shouldUseCache) {
    const cache = safeReadCache();

    if (cache[key]) {
      return cache[key];
    }

    try {
      const data = await fetcher();
      writeCache({ ...cache, [key]: data });
      return data;
    } catch (e) {
      console.error(`Failed to fetch ${key}:`, e);
      return {};
    }
  }

  // Not build time: fetch without caching
  try {
    return await fetcher();
  } catch (e) {
    console.error(`Failed to fetch ${key}:`, e);
    return {};
  }
};

export const loadRootText = async (locale) =>
  await safeFetch("root_text", async () => {
    const textBoxes = await cmsFetcher(TextBoxQuery, { locale, key: "root" });
    return textBoxes[0] || null;
  });

export const loadMainTexts = async (locale) =>
  await safeFetch("main_texts", async () => {
    const mainTexts = await cmsFetcher(MainTextsQuery, { locale });
    return mainTexts || null;
  });

export const loadParserExchangers = () =>
  safeFetch("exchangers", () => parserFetcher("exchangers"));

export const loadPmLayouts = () =>
  safeFetch("pmLayouts", () => cmsFetcher(pmLayoutsQuery));

export const loadDirsTexts = () =>
  safeFetch("dirsTexts", () => cmsFetcher(dirsTextsQuery));

export const loadArticleCodes = async () => {
  const articleCodes = await safeFetch("articleCodes", () =>
    cmsFetcher(articleCodesQuery)
  );
  return (articleCodes || []).map((res) => res.code);
};

export const loadArticles = () =>
  safeFetch("articles", () => cmsFetcher(articlesQuery));

export const loadArticle = (code, locale) =>
  safeFetch(`article_${code}_${locale}`, () =>
    cmsFetcher(articleQuery, { code, locale })
  );

export const loadPossiblePairs = () =>
  safeFetch("possible_pairs", () => parserFetcher("possible_pairs"));

export const loadPms = async () => {
  const selector = await safeFetch("selector", () => cmsFetcher(selectorQuery));
  const pms = getPmsFromSelector(selector);
  return pms;
};

export const loadExchanger = async (name) => {
  const exchanger = await safeFetch(`exchanger_${name}`, async () =>
    cmsFetcher(exchangerQuery, { name })
  );
  return exchanger?.[0] || null;
};

export const loadExchangers = async () => {
  const [cmsExchangers, parserExchangers] = await Promise.all([
    safeFetch("cms_exchangers", () => cmsFetcher(exchangersQuery)),
    safeFetch("parser_exchangers", () => parserFetcher("exchangers")),
  ]);
  return mergeExchangers(cmsExchangers, parserExchangers);
};

export const loadCities = () =>
  safeFetch("cities", async () => {
    const parserSettings = await cmsFetcher(citiesQuery);
    return parserSettings?.cities || [];
  });

export const fetchPmLayouts = async (locale) => {
  const fetcher = initCMSFetcher();
  const pmLayoutsRes = await fetcher(pmLayoutsQuery, { locale });
  return pmLayoutsRes;
};

export const fetchDirsTexts = async (locale) => {
  const fetcher = initCMSFetcher();
  const dirsTextsRes = await fetcher(dirsTextsQuery, { locale });
  return dirsTextsRes;
};

// SELECTORS

export const emptyProps = (locale) => ({
  pm: null,
  locale,
  article: null,
  otherDirs: null,
});
