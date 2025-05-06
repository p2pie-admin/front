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
  console.info("[getStaticProps] Starting with params:", params);
  try {
    const { exchange } = params;
    const [slug, cityParam] = exchangeToSlugCity(exchange);

    const cachedData = readCache() as ICache;
    console.info("[getStaticProps] Cached data:", cachedData);

    const { pms, slugToCodes, cities, ruData, enData } = cachedData;
    const dir = cachedData?.slugToCodes?.[slug];

    const givePm = pms.find((pm) => pm.code == dir?.split("_")?.[0]);
    const getPm = pms.find((pm) => pm.code == dir?.split("_")?.[1]);

    if (!dir || !givePm || !getPm) {
      console.warn("[getStaticProps] Missing data for slug:", slug);
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const similarPmPairs = findSimilarPmPairs(
      givePm,
      getPm,
      pms,
      Object.values(slugToCodes)
    );

    const city = cityParam
      ? cachedData.cities.find((c) => c.en_name.toLowerCase() == cityParam)
      : null;

    const donorName =
      (city?.en_name && cachedData.donors[dir]?.[city?.en_name]) || null;
    const donorCity = donorName
      ? cachedData.cities.find(
          (c) => c.en_name.toLowerCase() == donorName.toLowerCase()
        ) || null
      : null;

    const localData = locale == "en" ? enData : ruData;
    const { pmLayouts, dirsTexts, articleCodes } = localData;

    const givePmLayout =
      pmLayouts.find((l) => l.section == givePm.section) || null;
    const getPmLayout =
      pmLayouts.find((l) => l.section == getPm?.section) || null;

    const dirText =
      dirsTexts.find(
        (t) =>
          t?.section_give == givePm.section && t?.section_get == getPm?.section
      ) || null;

    let [giveArticleExists, getArticleExists] = [false, false];
    if (articleCodes.length) {
      giveArticleExists = !!articleCodes.find(
        (ac) => ac?.toUpperCase() == givePm.en_name.toUpperCase()
      );
      getArticleExists = !!articleCodes.find(
        (ac) => ac?.toUpperCase() == getPm.en_name.toUpperCase()
      );
    }

    const givePmData = {
      pm: givePm,
      pmLayout: givePmLayout,
      articleExists: giveArticleExists,
    } as IPmData;

    const getPmData = {
      pm: getPm,
      pmLayout: getPmLayout,
      articleExists: getArticleExists,
    } as IPmData;

    console.info("[getStaticProps] Returning props:", {
      locale,
      slug,
      cities,
      givePmData,
      getPmData,
      dirText,
      city,
      similarPmPairs,
      donorCity,
    });

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
    console.error("[getStaticProps] Error:", e);
    return {
      notFound: true,
    };
  }
}
/////////////////////////////////////////////////////////////
export async function getStaticPaths() {
  console.info("[getStaticPaths] Generating paths...");
  try {
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

    const cmsFetcher = initCMSFetcher();
    const { selector } = (await cmsFetcher(selectorQuery)) as {
      selector: ISelector;
    };
    const { parserSetting } = (await cmsFetcher(citiesQuery)) as {
      parserSetting: { cities: ICity[] };
    };

    const pmGroups = selector.sections.reduce(
      (res: IPmGroup[], section: ISection) => [
        ...res,
        ...section.pm_groups.map((pmg) => ({
          ...pmg,
          section: section.en_title.toLowerCase(),
        })),
      ],
      []
    );

    const pms = pmGroups.reduce((res: IPm[], pmGroup: IPmGroup) => {
      const pms = extractPmsFromPmGroup(pmGroup);
      if (!pms || !pms.length) console.log("cant get pms from: ", pmGroup);
      return !pms ? res : [...res, ...pms];
    }, []);

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
    const cities = parserSetting.cities;
    const allPaths: { params: { exchange: string }; locale: string }[] = [];

    Object.keys(slugToCodes).forEach((slug) => {
      locales.forEach((locale) => {
        allPaths.push({
          params: { exchange: slug },
          locale,
        });
      });
    });

    console.info("[getStaticPaths] Generated paths:", allPaths);

    return {
      paths: allPaths,
      fallback: "blocking",
    };
  } catch (e) {
    console.error("[getStaticPaths] Error:", e);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
}

export default ExchangePage;
