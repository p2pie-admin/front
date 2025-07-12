//  const possiblePairsPromise = parserFetcher("possible_pairs", 60 * m); // 1 hour
//  const selectorPromise = cmsFetcher(selectorQuery, 60 * m); // 1 hour
//  const exchangersPromise = cmsFetcher(exchangersQuery, 10 * m); // 10 min
//  const parserExchangersPromise = parserFetcher("exchangers"); // uses default TTL (or no cache)
//  const parserSettingPromise = cmsFetcher(citiesQuery, 30 * m); // 30 min
//  const localizedDataPromise = Promise.all([
//    fetchLocalizedData("en"),
//    fetchLocalizedData("ru"),
//  ]);

import { initCMSFetcher } from "../services/fetchers";
import { pmLayoutsQuery } from "../services/initialQueries";
import { getCache, setCache } from "./cache";

const TTL = 60 * 60 * 1000; // 1 hour

export const loadPmLayouts = async (locale: "en" | "ru") => {
  const key = `pmLayouts_${locale}`;
  const cached = getCache(key);
  if (cached) return cached;

  const fetcher = initCMSFetcher({ locale });
  const res = await fetcher(pmLayoutsQuery, TTL);
  const data = (res as any).pmLayouts;

  setCache(key, data, TTL);
  return data;
};
