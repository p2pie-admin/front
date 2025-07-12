import { readCache, writeCache } from ".";
import exchangers from "../components/exchangers";
import {
  extractPmsFromPmGroup,
  pmsToSlug,
} from "../components/main/side/selector/section/PmGroup/helper";
import {
  ICity,
  IPossiblePmPair,
  IDirText,
  ICache,
  IParserSetting,
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
} from "../services/initialQueries";
import { mylog } from "../services/utils";
import { IArticle } from "../types/pages";
import { exchangerNameToSlug } from "../components/exchangers/helper";

// Helper to fetch localized content
const fetchLocalizedData = async (locale: "en" | "ru"): Promise<ILocalData> => {
  const fetcher = initCMSFetcher({ locale });

  const [pmLayoutsRes, dirsTextsRes, articlesRes] = await Promise.all([
    fetcher(pmLayoutsQuery),
    fetcher(dirsTextsQuery),
    fetcher(articlesQuery),
  ]);

  return {
    pmLayouts: (pmLayoutsRes as { pmLayouts: IPmLayout[] }).pmLayouts,
    dirsTexts: (dirsTextsRes as { dirsTexts: IDirText[] }).dirsTexts,
    articles: (articlesRes as { articles: IArticle[] }).articles,
  };
};

// Load data once and cache it for 15 min
export const loadInitialData = async () => {
  try {
    const timestamp = Date.now();
    const parserFetcher = initParserFetcher();
    const cmsFetcher = initCMSFetcher();

    // Start all async operations in parallel
    const possiblePairsPromise = parserFetcher("possible_pairs");
    const selectorPromise = cmsFetcher(selectorQuery);
    const exchangersPromise = cmsFetcher(exchangersQuery);
    const parserExchangersPromise = parserFetcher("exchangers");
    const parserSettingPromise = cmsFetcher(citiesQuery);
    const localizedDataPromise = Promise.all([
      fetchLocalizedData("en"),
      fetchLocalizedData("ru"),
    ]);

    // Wait for all to complete
    const [
      possiblePairs,
      { selector },
      { exchangers: allExchangers },
      parserExchangers,
      { parserSetting },
      [enData, ruData],
    ] = await Promise.all([
      possiblePairsPromise,
      selectorPromise,
      exchangersPromise,
      parserExchangersPromise,
      parserSettingPromise,
      localizedDataPromise,
    ]);

    const dirs = Object.entries(
      possiblePairs as Record<string, string[]>
    ).flatMap(([code, pairs]) => pairs.map((pair) => `${code}_${pair}`));

    // Merge exchangers
    const exchangers: (IExchanger & IParserExchanger)[] = (
      allExchangers || []
    ).map((exchanger: IExchanger & IParserExchanger) => {
      const parserExchanger = parserExchangers?.[exchanger.id];
      return {
        ...parserExchanger,
        ...exchanger,
      } as IExchanger & IParserExchanger;
    });

    // Flatten PM groups and extract PMs
    const pmGroups: IPmGroup[] = selector.sections.flatMap(
      (section: ISection) =>
        section.pm_groups.map((pmg) => ({
          ...pmg,
          section: section.en_title.toLowerCase(),
        }))
    );

    const pms: IPm[] = pmGroups.flatMap((pmGroup) => {
      const extracted = extractPmsFromPmGroup(pmGroup);
      if (!extracted?.length) console.log("Missing PMs in group:", pmGroup);
      return extracted || [];
    });

    // Pre-index PMs by code for faster lookup
    const pmMap = new Map(pms.map((pm) => [pm.code.toUpperCase(), pm]));

    // Map slugs to pair codes
    const slugToCodes: Record<string, string> = dirs.reduce((acc, dir) => {
      const [give, get] = dir.split("_");
      const pair: IPossiblePmPair = {
        givePm: pmMap.get(give),
        getPm: pmMap.get(get),
      };
      const slug = pmsToSlug(pair);
      return slug ? { ...acc, [slug]: dir } : acc;
    }, {});

    const cities = parserSetting.cities as ICity[];

    const exchangerSlugs = allExchangers.map(
      (exchanger: IExchanger & IParserExchanger) =>
        exchangerNameToSlug(exchanger.name)
    );

    const finalCache: ICache = {
      timestamp,
      possiblePairs,
      pms,
      slugToCodes,
      parserSetting,
      cities,
      enData,
      ruData,
      exchangers,
      exchangerSlugs,
    };

    writeCache(finalCache);
  } catch (e) {
    mylog(`[loadInitialData] Error: ${String(e)}`, "error");
  }
};

export const getCachedData = async ({
  isHard,
}: {
  isHard: boolean;
}): Promise<ICache | undefined> => {
  const now = Date.now();
  const cache = readCache();
  // Check if the cache is still valid (5 minutes)
  if (cache?.timestamp && now - cache.timestamp < 1000 * 60 * 5) {
    return cache;
  }
  if (isHard) {
    await loadInitialData();
    return readCache();
  }
  loadInitialData();
  return cache; // Return old cache while new data loads
};
