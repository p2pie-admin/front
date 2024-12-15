import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { initCMSFetcher, initParserFetcher } from "../services/fetchers";
import {
  articleCodesQuery,
  citiesQuery,
  dirsTextsQuery,
  pmLayoutsQuery,
  selectorQuery,
} from "../services/initialQueries";
import { IPmGroup, IPm, ISelector, ISection } from "../types/selector";
import { readCache, writeCache } from "../cache";
import React from "react";
import Exchange from "../components/exchange";
import {
  ICache,
  ICity,
  IDirText,
  IDonors,
  IPmData,
  IPmLayout,
  IPossiblePmPair,
} from "../types/exchange";
import {
  exchangeToSlugCity,
  findSimilarPmPairs,
} from "../components/exchange/helper";
import {
  extractPmsFromPmGroup,
  pmsToSlug,
} from "../components/main/side/selector/section/PmGroup/helper";

const prerenderCountries = ["ukraine", "russia", "belarus"];

const ExchangePage = (props: {
  //article?: IArticle | null;
  //cities: ICity[];
  possiblePairs: { [key: string]: string[] };
  givePmData: IPmData;
  getPmData: IPmData;
  locale: "en" | "ru";
  slug?: string;
  dirText?: IDirText;
  city?: ICity;
  similarPmPairs: IPm[][];
  donorCity?: ICity;
}) => {
  return <Exchange {...props} />;
};

export async function getStaticProps({
  locale,
  params,
}: {
  locale: "en" | "ru";
  params: { exchange: string };
}) {
  try {
    const { exchange } = params;

    const [slug, cityParam] = exchangeToSlugCity(exchange);

    const cachedData = readCache() as ICache;
    const { pms, slugToCodes, cities, ruData, enData } = cachedData;
    const dir = cachedData?.slugToCodes?.[slug];
    if (!dir)
      return {
        notFound: true,
      };
    const givePm = pms.find((pm) => pm.code == dir?.split("_")?.[0]);
    const getPm = pms.find((pm) => pm.code == dir?.split("_")?.[1]);

    if (!dir || !givePm || !getPm)
      return {
        notFound: true,
      };
    const similarPmPairs = findSimilarPmPairs(
      givePm,
      getPm,
      pms,
      Object.values(slugToCodes)
    );

    // обработка городов

    const city = cityParam
      ? cachedData.cities.find((c) => c.en_name.toLowerCase() == cityParam)
      : null;

    // города доноры это те, у которых нет курса по нарпавлению но есть в соседнем
    const donorName =
      (city?.en_name && cachedData.donors[dir]?.[city?.en_name]) || null;
    const donorCity = donorName
      ? cachedData.cities.find(
          (c) => c.en_name.toLowerCase() == donorName.toLowerCase()
        ) || null
      : null;

    // обработка текстов

    const localData = locale == "en" ? enData : ruData;
    // первое : достаем коробки описания секций пм, это также ссылки на артиклы пм
    // и втрое : достаем шаблоны для направления с местами для вставки
    const { pmLayouts, dirsTexts, articleCodes } = localData;

    const givePmLayout =
      pmLayouts.find((l) => l.section == givePm.section) || null;
    const getPmLayout =
      pmLayouts.find((l) => l.section == getPm?.section) || null;

    const dirText =
      dirsTexts.find(
        (t) =>
          t.section_give == givePm.section && t.section_get == getPm?.section
      ) || null;

    let [giveArticleExists, getArticleExists] = [false, false];
    console.log("articleCodes", articleCodes);
    if (articleCodes.length) {
      giveArticleExists = !!articleCodes.find(
        (ac) => ac?.toUpperCase() == givePm.code.toUpperCase()
      );
      getArticleExists = !!articleCodes.find(
        (ac) => ac?.toUpperCase() == getPm.code.toUpperCase()
      );
    }

    const givePmData = {
      pm: givePm,
      pmLayout: givePmLayout,
      articleExists: giveArticleExists,
      // possiblePairs: possiblePairs[givePm.code],
    } as IPmData;

    const getPmData = {
      pm: getPm,
      pmLayout: getPmLayout,
      articleExists: getArticleExists,
      // possiblePairs: possiblePairs[getPm.code],
    } as IPmData;

    return {
      props: {
        locale,
        slug,
        cities,
        givePmData,
        getPmData,
        dirText,
        city,
        similarPmPairs,
        donorCity,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
      revalidate: 600,
    };
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
}

//.....................................................................................................
export async function getStaticPaths() {
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

  // забираем все необходимое
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

  const slugToCodes = dirs.reduce((res: { [key: string]: string }, dir) => {
    const pmPairFromDir = {
      givePm: pms.find((pm) => pm.code.toUpperCase() === dir.split("_")[0]),
      getPm: pms.find((pm) => pm.code.toUpperCase() === dir.split("_")[1]),
    } as IPossiblePmPair;
    const slug = pmsToSlug(pmPairFromDir);
    if (!slug) return res;
    return { ...res, [slug]: dir };
  }, {});

  const locales = ["en", "ru"];
  const cities = parserSetting.cities as ICity[];
  console.log(`received ${Object.keys(cities).length} cities`);
  console.log(`received ${dirs.length} dirs`);
  console.log(`received ${Object.keys(slugToCodes).length} slugToCodes`);

  // сперва обычные направления добавляем
  const allPaths = Object.keys(slugToCodes).reduce(
    (
      res: {
        params: { exchange: string };
        locale: string;
      }[],
      slug: string
    ) => [
      ...res,
      ...locales.map((locale) => ({
        params: { exchange: slug },
        locale,
      })),
    ],
    []
  );

  const nonEmpty = (await parserFetcher(`non_empty_cities`)) as {
    [key: string]: { [key: string]: number };
  };

  const tryDonor = (city: ICity) => {
    return city.closest_cities.find((c) =>
      Object.keys(nonEmpty).find(
        (nnc) => nnc.toLowerCase() == c.en_name.toLowerCase()
      )
    )?.en_name;
  };

  let donors = {} as IDonors;

  cities.map(async (city) => {
    Object.entries(slugToCodes).forEach(([slug, dir]) => {
      // если направление не кэш или город имеет меньше 2 курсов  - скипаем его
      if (!(slug.startsWith("cash-") || slug.includes("-cash-"))) return;
      const rateIsEmpty = nonEmpty?.[city?.en_name.toLowerCase()]?.[dir] < 2;
      const donorName = tryDonor(city);
      if (rateIsEmpty && !donorName) return;
      if (rateIsEmpty && donorName && dir) {
        donors[dir] = donors[dir] || {};
        donors[dir][donorName] = city.en_name;
      }

      locales.forEach((locale) => {
        allPaths.push({
          params: {
            exchange: `${slug}-in-${[city.en_name.toLowerCase()]}`,
          },
          locale,
        });
      });
    });
  });

  const needPrerender = (exchangePath: string) => {
    if (!exchangePath.includes("-in-")) return true;
    const city = cities.find((city) =>
      exchangePath.includes(city.en_name.toLowerCase())
    );
    if (!city?.en_name) return false;
    const countryName = city?.en_country_name?.toLowerCase();
    return city?.population > 3 && prerenderCountries.includes(countryName);
  };

  const slicedPaths = allPaths
    .filter((p) => needPrerender(p.params.exchange))
    .slice(0, 20);
  // срезаем 2к

  // ПУТИ ЕСТЬ ПОЛНЫЕ ДЛЯ САЙТМАП, А  ЕСТЬ ДЛЯ ПРЕРЕНДЕРИНГА

  // ДАЛЕЕ СОХРАНЯЕМ ДАННЫЕ ДЛЯ getStaticProps
  const ruCmsFetcher = initCMSFetcher({ locale: "ru" });
  const enCmsFetcher = initCMSFetcher({ locale: "en" });

  const ruPmLayouts = (await ruCmsFetcher(pmLayoutsQuery)) as {
    pmLayouts: IPmLayout[];
  };
  const enPmLayouts = (await enCmsFetcher(pmLayoutsQuery)) as {
    pmLayouts: IPmLayout[];
  };
  const ruDirsTexts = (await ruCmsFetcher(dirsTextsQuery)) as {
    dirsTexts: IDirText[];
  };
  const enDirsTexts = (await ruCmsFetcher(dirsTextsQuery)) as {
    dirsTexts: IDirText[];
  };
  const enArticleCodes = (await ruCmsFetcher(articleCodesQuery)) as {
    articles: { code: string }[];
  };
  const ruArticleCodes = (await enCmsFetcher(articleCodesQuery)) as {
    articles: { code: string }[];
  };

  console.log("enArticleCodes", enArticleCodes.articles.length);
  console.log("ruArticleCodes", ruArticleCodes.articles.length);

  const cachedData = {} as ICache;
  cachedData.enData = {} as any;
  cachedData.ruData = {} as any;
  cachedData.slugToCodes = slugToCodes;
  cachedData.cities = cities;
  cachedData.pms = pms;
  //cachedData.possiblePairs = possiblePairs;
  cachedData.exchangePaths = allPaths;
  cachedData.donors = donors;
  cachedData.enData.pmLayouts = enPmLayouts.pmLayouts;
  cachedData.ruData.pmLayouts = ruPmLayouts.pmLayouts;
  cachedData.enData.dirsTexts = enDirsTexts.dirsTexts;
  cachedData.ruData.dirsTexts = ruDirsTexts.dirsTexts;
  cachedData.enData.articleCodes = enArticleCodes.articles?.map((a) => a.code);
  cachedData.ruData.articleCodes = ruArticleCodes.articles?.map((a) => a.code);

  writeCache(cachedData); // Save to cache

  return {
    paths: slicedPaths,
    fallback: "blocking",
  };
}

export default ExchangePage;
