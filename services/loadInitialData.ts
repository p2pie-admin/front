import { readCache, writeCache } from "../cache";
import {
  extractPmsFromPmGroup,
  pmsToSlug,
} from "../components/main/side/selector/section/PmGroup/helper";
import {
  ICity,
  IPossiblePmPair,
  IDonors,
  IPmLayout,
  IDirText,
  ICache,
} from "../types/exchange";
import { ISelector, IPmGroup, ISection, IPm } from "../types/selector";
import { initCMSFetcher, initParserFetcher } from "./fetchers";
import {
  selectorQuery,
  citiesQuery,
  pmLayoutsQuery,
  dirsTextsQuery,
  articleCodesQuery,
} from "./initialQueries";
import { mylog } from "./utils";

// чтобы подгружать данные заранее для всех страниц, сперва вызываем эту функцию в каждом getStaticPaths()

export const loadInitialData = async (): Promise<ICache | undefined> => {
  const cachedData = readCache() as ICache;
  const now = +new Date(); // if cachedData exists and not older than 5h use it
  if (
    cachedData &&
    cachedData.timestamp &&
    now - cachedData.timestamp < 1000 * 60 * 60 * 5
  ) {
    return cachedData; // Use cached data if it's not older than 5 hours
  }

  try {
    // otherwise getting all initial data
    cachedData.timestamp = now;

    const parserFetcher = initParserFetcher();
    const possiblePairs = (await parserFetcher("possible_pairs")) as {
      [key: string]: string[];
    };

    const dirs = Object.entries(possiblePairs).reduce(
      (res: string[], [code, pairs]) => [
        ...res,
        ...pairs.map((pair) => `${code}_${pair}`),
      ],
      []
    );

    console.log(`received ${dirs.length} dirs`);

    const slugToCodes = dirs.reduce((res: { [key: string]: string }, dir) => {
      const pmPairFromDir = {
        givePm: pms.find((pm) => pm.code.toUpperCase() === dir.split("_")[0]),
        getPm: pms.find((pm) => pm.code.toUpperCase() === dir.split("_")[1]),
      } as IPossiblePmPair;
      const slug = pmsToSlug(pmPairFromDir);
      if (!slug) return res;
      return { ...res, [slug]: dir };
    }, {});

    cachedData.slugToCodes = slugToCodes;
    console.log(`received ${Object.keys(slugToCodes).length} slugToCodes`);

    const cmsFetcher = initCMSFetcher();
    const { selector } = (await cmsFetcher(selectorQuery)) as {
      selector: ISelector;
    };
    const { parserSetting } = (await cmsFetcher(citiesQuery)) as {
      parserSetting: { cities: ICity[] };
    };

    const pmGroups = selector.sections.reduce(
      (res: IPmGroup[], section: ISection) => [
        ...res, // adding section names
        ...section.pm_groups.map((pmg) => ({
          ...pmg,
          section: section.en_title.toLowerCase(),
        })),
      ],
      []
    );

    console.log("pmGroups fetched: ", pmGroups.length);
    console.log(`extracting pms from  ${pmGroups.length} pmGroups`);

    const pms = pmGroups.reduce((res: IPm[], pmGroup: IPmGroup) => {
      const pms = extractPmsFromPmGroup(pmGroup);
      if (!pms || !pms.length) console.log("cant get pms from: ", pmGroup);
      return !pms ? res : [...res, ...pms];
    }, []);
    console.log(`received ${pms.length} pms`);

    cachedData.pms = pms;

    const cities = parserSetting.cities as ICity[];
    console.log(`received ${Object.keys(cities).length} cities`);
    cachedData.cities = cities;

    // ДАЛЕЕ СОХРАНЯЕМ ДАННЫЕ ДЛЯ getStaticProps
    const ruCmsFetcher = initCMSFetcher({ locale: "ru" });
    const enCmsFetcher = initCMSFetcher({ locale: "en" });

    const ruPmLayouts = (await ruCmsFetcher(pmLayoutsQuery)) as {
      pmLayouts: IPmLayout[];
    };
    if (!ruPmLayouts || !ruPmLayouts.pmLayouts) {
      console.error("[loadInitialData] Failed to fetch RU PM layouts.");
      return;
    }
    const enPmLayouts = (await enCmsFetcher(pmLayoutsQuery)) as {
      pmLayouts: IPmLayout[];
    };
    const ruDirsTexts = (await ruCmsFetcher(dirsTextsQuery)) as {
      dirsTexts: IDirText[];
    };
    const enDirsTexts = (await enCmsFetcher(dirsTextsQuery)) as {
      dirsTexts: IDirText[];
    };
    const enArticleCodes = (await enCmsFetcher(articleCodesQuery)) as {
      articles: { code: string }[];
    };
    const ruArticleCodes = (await ruCmsFetcher(articleCodesQuery)) as {
      articles: { code: string }[];
    };

    console.log("enArticleCodes", enArticleCodes.articles.length);
    console.log("ruArticleCodes", ruArticleCodes.articles.length);

    cachedData.enData = {} as any;
    cachedData.ruData = {} as any;
    cachedData.enData.pmLayouts = enPmLayouts.pmLayouts;
    cachedData.ruData.pmLayouts = ruPmLayouts.pmLayouts;
    cachedData.enData.dirsTexts = enDirsTexts.dirsTexts;
    cachedData.ruData.dirsTexts = ruDirsTexts.dirsTexts;
    cachedData.enData.articleCodes = enArticleCodes.articles?.map(
      (a) => a.code
    );
    cachedData.ruData.articleCodes = ruArticleCodes.articles?.map(
      (a) => a.code
    );

    writeCache(cachedData); // Save to cache
    return cachedData;
  } catch (e) {
    mylog(`[loadInitialData] Error: ${String(e)}`, "error");
  }
};
