import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { initCMSFetcher, initParserFetcher } from "../../../services/fetchers";
import {
  citiesQuery,
  selectorQuery,
  textLayoutsQuery,
} from "../../../services/initialQueries";
import { IPmGroup, IPm, ISelector, ISection } from "../../../types/selector";
import { readCache, writeCache } from "../../../services/cache";
import React from "react";
import Exchange from "../../../components/exchange";
import { ICache, IPossiblePmPair, ITextLayout } from "../../../types/exchange";
import {
  convertCities,
  generateText,
} from "../../../components/exchange/helper";
import {
  extractPmsFromPmGroup,
  pmsToSlug,
} from "../../../components/main/side/selector/section/PmGroup/helper";

const ExchangePage = (props: any) => {
  return <Exchange {...props} />;
};

export async function getStaticProps({
  locale,
  params,
}: {
  locale: "en" | "ru";
  params: { slug: string; city?: string[] };
}) {
  const { slug, city } = params;
  const cityParam = city ? city[0] : "";

  const cachedData = readCache() as ICache;
  const { givePm, getPm } = cachedData.slugPmsObject[slug];

  if (!cachedData?.slugPmsObject?.[slug] || !givePm || !getPm)
    return {
      notFound: true,
    };

  const fullCity = cachedData.cities?.[cityParam];
  const cityName = !fullCity ? "" : locale === "ru" ? fullCity[0] : fullCity[1];
  const defaultDirText = generateText({
    givePm,
    getPm,
    cityName,
    textLayouts: cachedData.textLayouts,
    locale,
  });

  const isMobile = false;

  return {
    props: {
      locale,
      slug,
      defaultDirText,
      givePm,
      getPm,
      isMobile,
      ...(await serverSideTranslations(locale || "ru", ["home"])),
    },
    revalidate: 6000,
  };
}

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
  console.log(`received ${dirs.length} dirs`);

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
  const { textLayouts } = (await cmsFetcher(textLayoutsQuery)) as {
    textLayouts: ITextLayout[];
  };

  console.log("textLayouts fetched: ", textLayouts.length);
  console.log(`extracting pms from  ${pmGroups.length} pmGroups`);

  const pms = pmGroups.reduce((res: IPm[], pmGroup: IPmGroup) => {
    const pms = extractPmsFromPmGroup(pmGroup);
    if (!pms || !pms.length) console.log("cant get pms from: ", pmGroup);
    return !pms ? res : [...res, ...pms];
  }, []);
  console.log(`received ${pms.length} pms`);

  //console.log(possiblePmPairs.map(pmp => `${pmp.givePm?.code}_${pmp.getPm?.code}`));
  const slugPmsObject = dirs.reduce(
    (res: { [key: string]: IPossiblePmPair }, dir) => {
      const pmPairFromDir = {
        givePm: pms.find((pm) => pm.code.toUpperCase() === dir.split("_")[0]),
        getPm: pms.find((pm) => pm.code.toUpperCase() === dir.split("_")[1]),
      } as IPossiblePmPair;
      const slug = pmsToSlug(pmPairFromDir);
      return { ...res, [slug]: pmPairFromDir };
    },
    {}
  );

  const locales = ["en", "ru"];
  writeCache({});
  const cachedData = {} as ICache;
  const cities = convertCities(parserSetting.cities);
  cachedData.slugPmsObject = slugPmsObject;
  cachedData.textLayouts = textLayouts;
  cachedData.cities = cities;
  writeCache(cachedData); // Save to cache

  const paths = Object.keys(slugPmsObject).reduce(
    (
      res: {
        params: { slug: string; city?: string[] };
        locale: string;
      }[],
      slug: string
    ) => [
      ...res,
      ...locales.map((locale) => ({
        params: {
          slug,
          city: [],
        },
        locale,
      })),
    ],
    []
  );

  Object.keys(cities).forEach((city) => {
    Object.keys(slugPmsObject).forEach((slug) => {
      locales.forEach((locale) => {
        if (!(slug.startsWith("cash-") || slug.includes("-cash-"))) return;
        paths.push({
          params: {
            slug,
            city: [city.replaceAll(" ", "-")],
          },
          locale,
        });
      });
    });
  });

  console.log("total paths: ", paths.length);
  return {
    paths: paths.slice(0, 100),
    fallback: "blocking",
  };
}

export default ExchangePage;
// ДЛЯ КАСТОМНОГО ТЕКСТА
//let article = null as IArticle | null;
// if (!cachedData.articleCodes) {
//   const getAllArticleCodes = initCMSFetcher();
//   const res = (await getAllArticleCodes(articleCodesQuery)) as {
//     articles: { id: string; code: string }[];
//   };
//   const { articles } = res;
//   cachedData.articleCodes = articles;
//   writeCache(cachedData); // Save to cache
// }

// const articleCode = cachedData.articleCodes?.find(
//   (a: any) => a.code.toUpperCase() === slug.toUpperCase()
// )?.code;

// if (articleCode) {
//   const fetcher = initCMSFetcher({
//     locale,
//     code: articleCode,
//   });
//   const res = await fetcher(articleQuery);
//   article = res?.articles[0] ? (res.articles[0] as IArticle) : null;
// }
