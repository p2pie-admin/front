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

  const { pmLayouts } = (await fetcher(pmLayoutsQuery)) as {
    pmLayouts: IPmLayout[];
  };
  const { dirsTexts } = (await fetcher(dirsTextsQuery)) as {
    dirsTexts: IDirText[];
  };

  const { articles } = (await fetcher(articlesQuery)) as {
    articles: IArticle[];
  };

  return { pmLayouts, dirsTexts, articles };
};

// Load data once and cache it for 5 hours
export const loadInitialData = async (): Promise<ICache | undefined> => {
  const cachedData = readCache() as ICache;
  const now = Date.now();

  if (
    cachedData?.timestamp &&
    now - cachedData.timestamp < 1000 * 60 * 60 * 5
  ) {
    return cachedData; // Return if cache is fresh
  }

  try {
    const parserFetcher = initParserFetcher();
    const cmsFetcher = initCMSFetcher();

    const timestamp = Date.now();
    const possiblePairs = (await parserFetcher("possible_pairs")) as Record<
      string,
      string[]
    >;
    const dirs = Object.entries(possiblePairs).flatMap(([code, pairs]) =>
      pairs.map((pair) => `${code}_${pair}`)
    );

    const { selector } = (await cmsFetcher(selectorQuery)) as {
      selector: ISelector;
    };

    const { exchangers: allExchangers } = (await cmsFetcher(
      exchangersQuery
    )) as {
      exchangers: IExchanger[];
    };
    const parserExchangers = await parserFetcher("exchangers");

    // объединяем данные из двух источников
    let exchangers = [] as (IExchanger & IParserExchanger)[];
    for (const exchanger of allExchangers || []) {
      const parserExchanger = parserExchangers?.[exchanger.id];
      const merged = {
        ...parserExchanger,
        ...exchanger,
      } as IExchanger & IParserExchanger;

      if (merged) {
        exchangers.push(merged);
      }
    }

    // Flatten and enrich PM groups with section info
    const pmGroups: IPmGroup[] = selector.sections.flatMap(
      (section: ISection) =>
        section.pm_groups.map((pmg) => ({
          ...pmg,
          section: section.en_title.toLowerCase(),
        }))
    );

    // Extract PMs
    const pms: IPm[] = pmGroups.flatMap((pmGroup) => {
      const extracted = extractPmsFromPmGroup(pmGroup);
      if (!extracted?.length) console.log("Missing PMs in group:", pmGroup);
      return extracted || [];
    });

    // Map slugs to pair codes
    const slugToCodes: Record<string, string> = dirs.reduce((acc, dir) => {
      const [give, get] = dir.split("_");
      const pair: IPossiblePmPair = {
        givePm: pms.find((pm) => pm.code.toUpperCase() === give),
        getPm: pms.find((pm) => pm.code.toUpperCase() === get),
      };
      const slug = pmsToSlug(pair);
      return slug ? { ...acc, [slug]: dir } : acc;
    }, {});

    // Fetch cities & parser settings
    const { parserSetting } = (await cmsFetcher(citiesQuery)) as {
      parserSetting: IParserSetting;
    };
    const cities = parserSetting.cities as ICity[];

    // Fetch localized content
    const [enData, ruData] = await Promise.all([
      fetchLocalizedData("en"),
      fetchLocalizedData("ru"),
    ]);

    // Exchanegr slugs нужны чтобы запихнуть в сайтмап

    const exchangerSlugs = allExchangers.map((exchanger) =>
      exchangerNameToSlug(exchanger.name)
    );

    // Finalize cache
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
    return finalCache;
  } catch (e) {
    mylog(`[loadInitialData] Error: ${String(e)}`, "error");
  }
};
