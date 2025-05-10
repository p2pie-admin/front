import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { IPm } from "../types/selector";
import React from "react";
import Exchange from "../components/exchange";
import { ICity, IDirText, IPmData } from "../types/exchange";
import {
  exchangeToSlugCity,
  findSimilarPmPairs,
} from "../components/exchange/helper";

import { loadInitialData } from "../services/loadInitialData";
import { mylog } from "../services/utils";

const prerenderCountries = ["ukraine", "russia", "belarus"];

const ExchangePage = (props: {
  //article?: IArticle | null;
  //cities: ICity[];
  //possiblePairs: { [key: string]: string[] };
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

    const cachedData = await loadInitialData();

    if (
      !cachedData ||
      !cachedData.pms ||
      !cachedData.slugToCodes ||
      !cachedData.cities
    ) {
      console.error(
        "exchangers [getStaticProps] Cached data is missing or invalid."
      );
      return { notFound: true };
    }

    const { pms, slugToCodes, cities, ruData, enData } = cachedData;

    if (!pms || !Array.isArray(pms)) {
      console.error("[getStaticProps] 'pms' is missing or invalid.");
      return { notFound: true };
    }

    const dir = slugToCodes?.[slug];
    const [giveCode, getCode] = dir?.split("_") ?? [];

    const givePm = pms?.find((pm) => pm.code === giveCode) ?? null;
    const getPm = pms?.find((pm) => pm.code === getCode) ?? null;

    if (!dir || !givePm || !getPm) {
      console.error("[getStaticProps] Invalid direction or PM data.");
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

    // обработка городов

    const city = cityParam
      ? cities?.find(
          (c) => c.en_name?.toLowerCase() === cityParam.toLowerCase()
        ) || null
      : null;

    if (!cities || !Array.isArray(cities)) {
      console.error("[getStaticProps] 'cities' is missing or invalid.");
      return { notFound: true };
    }

    // города доноры это те, у которых нет курса по нарпавлению но есть в соседнем
    const donorName =
      (city?.en_name && cachedData.donors?.[dir]?.[city.en_name]) || null;

    const donorCity =
      (donorName &&
        cities?.find(
          (c) => c.en_name?.toLowerCase() === donorName.toLowerCase()
        )) ||
      null;

    // обработка текстов

    const localData = locale == "en" ? enData : ruData;
    // первое : достаем коробки описания секций пм, это также ссылки на артиклы пм
    // и втрое : достаем шаблоны для направления с местами для вставки
    const { pmLayouts, dirsTexts, articles } = localData;

    const givePmLayout =
      pmLayouts?.find((l) => l.section == givePm?.section) || null;
    const getPmLayout =
      pmLayouts?.find((l) => l.section == getPm?.section) || null;

    const dirText =
      dirsTexts?.find(
        (t) =>
          t?.section_give == givePm?.section && t?.section_get == getPm?.section
      ) || null;

    let [giveArticleExists, getArticleExists] = [false, false];

    if (articles.length) {
      giveArticleExists = !!articles?.find(
        (article) => article.code?.toUpperCase() == givePm.en_name.toUpperCase()
      );
      getArticleExists = !!articles?.find(
        (article) => article.code?.toUpperCase() == getPm.en_name.toUpperCase()
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
  const cachedData = await loadInitialData();
  console.log(
    "[getStaticPaths] cachedData:",
    JSON.stringify(cachedData, undefined, 4)
  );
  if (!cachedData) {
    console.error(
      "exchangers [getStaticPaths] Cached data is missing or invalid."
    );
    return {
      paths: [],
      fallback: "blocking",
    };
  }

  const locales = ["en", "ru"];

  const { slugToCodes, cities } = cachedData;

  if (!slugToCodes || !cities) {
    console.error(
      "[getStaticPaths] 'slugToCodes' or 'cities' is missing or invalid."
    );
    return {
      paths: [],
      fallback: "blocking",
    };
  }

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

  // const parserFetcher = initParserFetcher();
  // const nonEmpty = (await parserFetcher(`non_empty_cities`)) as {
  //   [key: string]: { [key: string]: number };
  // };

  // if (!nonEmpty) {
  //   console.error("[getStaticPaths] nonEmpty data is missing or invalid.");
  //   return {
  //     paths: [],
  //     fallback: "blocking",
  //   };
  // }

  // const nonEmptyCities = new Set(
  //   Object.keys(nonEmpty).map((key) => key.toLowerCase())
  // );

  // const tryDonor = (city: ICity) =>
  //   city.closest_cities?.find((c) =>
  //     nonEmptyCities.has(c.en_name.toLowerCase())
  //   )?.en_name;

  // let donors = {} as IDonors;

  // await Promise.all(
  //   cities.map(async (city) => {
  //     Object.entries(slugToCodes).forEach(([slug, dir]) => {
  //       // если направление не кэш или город имеет меньше 2 курсов  - скипаем его
  //       if (!(slug.startsWith("cash-") || slug.includes("-cash-"))) return;
  //       const rateIsEmpty = nonEmpty?.[city?.en_name.toLowerCase()]?.[dir] < 2;
  //       const donorName = tryDonor(city);
  //       if (rateIsEmpty && !donorName) return;
  //       if (rateIsEmpty && donorName && dir) {
  //         donors[dir] = donors[dir] || {};
  //         donors[dir][donorName] = city.en_name;
  //       }

  //       locales.forEach((locale) => {
  //         allPaths.push({
  //           params: {
  //             exchange: `${slug}-in-${[city.en_name.toLowerCase()]}`,
  //           },
  //           locale,
  //         });
  //       });
  //     });
  //   })
  // );

  //writeCache({ ...cachedData, donors });

  // const needPrerender = (exchangePath: string) => {
  //   if (!exchangePath.includes("-in-")) return true; // dont prerender cities
  //   const city = cities?.find((city) =>
  //     exchangePath.includes(city.en_name.toLowerCase())
  //   );
  //   if (!city) {
  //     console.warn(
  //       "[getStaticPaths] City not found for exchangePath:",
  //       exchangePath
  //     );
  //   }
  //   const countryName = city?.en_country_name?.toLowerCase();
  //   // пререндерим крупные города и определенные страны
  //   return (
  //     city &&
  //     countryName &&
  //     city?.population > 3 &&
  //     prerenderCountries.includes(countryName)
  //   );
  // };

  // const slicedPaths = allPaths
  //   .filter((p) => needPrerender(p.params.exchange))
  //   .slice(0, 2); // это потом нужно убрать
  mylog(String(allPaths.length), "important");

  // ПУТИ ЕСТЬ ПОЛНЫЕ ДЛЯ САЙТМАП, А  ЕСТЬ ДЛЯ ПРЕРЕНДЕРИНГА
  return {
    paths: allPaths,
    fallback: "blocking",
  };
}

export default ExchangePage;
