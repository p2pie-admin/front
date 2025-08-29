import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { IPm } from "../types/selector";
import React from "react";
import Exchange from "../components/exchange";
import { ICache, ICity, IDirText, IPmData } from "../types/exchange";

import { ISEO } from "../types/general";
import { nullSeo } from "../components/shared/UniversalSeo";
import { getSlugToCodes } from "../cache/helper";
import {
  loadPms,
  loadPossiblePairs,
  loadCities,
  loadArticleCodes,
  loadPmLayouts,
  loadCustomDirText,
} from "../cache/loadX";
import { mylog } from "../services/utils";

import {
  dirTextHandler,
  exchangeToSlugCity,
  findSimilarPmPairs,
  generateExchangeSeo,
  generateExchangeTitle,
} from "../lib/exchangeHelper";

const prerenderCountries = ["ukraine", "russia", "belarus"];

const ExchangePage = (props: {
  seo: ISEO;
  givePmData: IPmData | null;
  getPmData: IPmData | null;
  locale: "en" | "ru";
  dirText: IDirText | null;
  city: ICity | null;
  similarPmPairs: IPm[][] | null;
  donorCity: ICity | null;
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

    const isCash =
      (slug && slug.startsWith("cash-")) || slug.includes("-cash-");

    const [pms, possiblePairs, cities, pmLayouts, articleCodes, customDirText] =
      await Promise.all([
        loadPms(),
        loadPossiblePairs(),
        isCash ? loadCities() : null,
        loadPmLayouts(locale),
        loadArticleCodes(),
        loadCustomDirText(locale, slug),
      ]);

    const slugToCodes = getSlugToCodes(possiblePairs, pms);

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
      return { notFound: true };
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

    const givePmLayout =
      pmLayouts?.find((l) => l.section == givePm?.section) || null;
    const getPmLayout =
      pmLayouts?.find((l) => l.section == getPm?.section) || null;

    let [giveArticleExists, getArticleExists] = [false, false];
    if (articleCodes.length) {
      giveArticleExists = !!articleCodes?.find(
        (code) => code?.toUpperCase() == givePm.en_name.toUpperCase()
      );
      getArticleExists = !!articleCodes?.find(
        (code) => code?.toUpperCase() == getPm.en_name.toUpperCase()
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

    const dirText = (await dirTextHandler({
      locale,
      givePm,
      getPm,
      customDirText,
      city,
    })) as IDirText;

    mylog(JSON.stringify(dirText, undefined, 4), "success");

    const seo = generateExchangeSeo({
      givePm,
      getPm,
      locale,
      seo_title: dirText.seo_title,
      seo_description: dirText.seo_description,
      slug,
      city,
    });

    return {
      props: {
        locale,
        seo: seo || nullSeo,
        cities: cities || null,
        givePmData: givePmData || null,
        getPmData: getPmData || null,
        dirText,
        city: city || null,
        similarPmPairs: similarPmPairs || null,
        //donorCity: donorCity || null,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
      revalidate: 2400,
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        locale,
        seo: nullSeo,

        cities: null,
        givePmData: null,
        getPmData: null,
        dirText: null,
        city: null,
        similarPmPairs: null,
        donorCity: null,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
      revalidate: 2400,
    };
  }
}

//.....................................................................................................
//.....................................................................................................
//.....................................................................................................
//.....................................................................................................
//.....................................................................................................

export async function getStaticPaths() {
  const locales = ["en", "ru"];

  const [pms, possiblePairs, cities, pmLayoutsRu, pmLayoutsEn, articleCodes] =
    await Promise.all([
      loadPms(),
      loadPossiblePairs(),
      loadCities(),
      loadPmLayouts("ru"),
      loadPmLayouts("en"),
      loadArticleCodes(),
    ]);

  const slugToCodes = getSlugToCodes(possiblePairs, pms);

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

  const needPrerender = (exchangePath: string) => {
    if (!exchangePath.includes("-in-")) return true; // dont prerender cities
    const city = cities?.find((city) =>
      exchangePath.includes(city.en_name.toLowerCase())
    );
    if (!city) {
      console.warn(
        "[getStaticPaths] City not found for exchangePath:",
        exchangePath
      );
    }
    const countryName = city?.en_country_name?.toLowerCase();
    // пререндерим крупные города и определенные страны
    return (
      city &&
      countryName &&
      city?.population > 3 &&
      prerenderCountries.includes(countryName)
    );
  };

  const paths = allPaths.filter((p) => needPrerender(p.params.exchange));

  // далее кешируем все направления

  // ПУТИ ЕСТЬ ПОЛНЫЕ ДЛЯ САЙТМАП, А  ЕСТЬ ДЛЯ ПРЕРЕНДЕРИНГА
  return {
    paths: paths.slice(
      0,
      process.env.NEXT_PUBLIC_PRERENDER_LIMIT
        ? Number(process.env.NEXT_PUBLIC_PRERENDER_LIMIT)
        : 10000
    ),
    fallback: "blocking", // Use "blocking" to dynamically generate pages on demand
  };
}

export default ExchangePage;
