import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { initCMSFetcher, initParserFetcher } from "../services/fetchers";
import {
  citiesQuery,
  dirsTextQuery,
  pmsTextQuery,
  selectorQuery,
} from "../services/initialQueries";
import { IPmGroup, IPm, ISelector, ISection } from "../types/selector";
import { readCache, writeCache } from "../cache";
import React from "react";
import Exchange from "../components/exchange";
import { ICache, IDirText, IPmsText, IPossiblePmPair } from "../types/exchange";
import {
  convertCities,
  createLocation,
  exchangeToSlugCity,
  findSimilarPmPairs,
} from "../components/exchange/helper";
import {
  extractPmsFromPmGroup,
  pmsToSlug,
} from "../components/main/side/selector/section/PmGroup/helper";
import { ILocation } from "../types/shared";

const ExchangePage = (props: {
  //article?: IArticle | null;
  locale: "en" | "ru";
  slug?: string;
  dirText?: IDirText;
  pmsTexts?: IPmsText[];
  givePm: IPm;
  getPm: IPm;
  location: ILocation;
  similarPmPairs: IPm[][];
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
    const pms = cachedData.pms;
    const dir = cachedData?.slugToCodes?.[slug];
    const givePm = pms.find((pm) => pm.code == dir?.split("_")?.[0]);
    const getPm = pms.find((pm) => pm.code == dir?.split("_")?.[1]);
    const [section_give, section_get] = [givePm?.section, getPm?.section];
    const cmsFetcherPmsText = initCMSFetcher({
      locale,
      sections: [section_give, section_get],
    });
    const res = (await cmsFetcherPmsText(pmsTextQuery)) as {
      pmsTexts: IPmsText[];
    };
    const pmsTexts = res?.pmsTexts || null;

    const cmsFetcherDirsText = initCMSFetcher({
      locale,
      section_give,
      section_get,
    });
    const { dirsTexts } = (await cmsFetcherDirsText(dirsTextQuery)) as {
      dirsTexts: [IDirText];
    };
    const dirText = dirsTexts[0] || null;

    if (!dir || !givePm || !getPm)
      return {
        notFound: true,
      };
    const similarPmPairs = findSimilarPmPairs(givePm, getPm, pms);
    const fullCity = cachedData.cities?.[cityParam];
    const location = createLocation(fullCity);

    return {
      props: {
        locale,
        slug,
        dirText,
        pmsTexts,
        givePm,
        getPm,
        location,
        similarPmPairs,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
      revalidate: 6000,
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
  const possiblePairsFetcher = initParserFetcher();
  const ppRes = (await possiblePairsFetcher("possible_pairs")) as {
    [key: string]: string[];
  };
  const dirs = Object.entries(ppRes).reduce(
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
    parserSetting: { cities: { [key: string]: [string, string] } };
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

  //console.log(possiblePmPairs.map(pmp => `${pmp.givePm?.code}_${pmp.getPm?.code}`));
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
  const cities = convertCities(parserSetting.cities);
  console.log(`received ${Object.keys(cities).length} cities`);
  console.log(`received ${dirs.length} dirs`);
  console.log(`received ${Object.keys(slugToCodes).length} slugToCodes`);

  const paths = Object.keys(slugToCodes).reduce(
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

  Object.keys(cities).forEach((city) => {
    Object.keys(slugToCodes).forEach((slug) => {
      locales.forEach((locale) => {
        if (!(slug.startsWith("cash-") || slug.includes("-cash-"))) return;
        paths.push({
          params: {
            exchange: `${slug}-in-${[city.replaceAll(" ", "-")]}`,
          },
          locale,
        });
      });
    });
  });
  const slicedPaths = paths.filter((p) => p.locale !== "en");

  const cachedData = readCache() as ICache;
  cachedData.slugToCodes = slugToCodes;
  cachedData.cities = cities;
  cachedData.pms = pms;
  cachedData.exchangePaths = paths;

  writeCache(cachedData); // Save to cache

  return {
    paths: slicedPaths,
    fallback: "blocking",
  };
}

export default ExchangePage;
