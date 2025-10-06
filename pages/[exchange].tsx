import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { IPm } from "../types/selector";
import React from "react";
import Exchange from "../components/exchange";
import { ICity, IDirText, IPmData } from "../types/exchange";

import { ISEO } from "../types/general";
import { nullSeo } from "../components/shared/UniversalSeo";
import { getSlugToCodes } from "../cache/helper";
import {
  loadPms,
  loadPossibleDirs,
  loadCities,
  loadArticleCodes,
  loadPmLayouts,
  loadCustomDirText,
  loadMassDirTextIds,
} from "../cache/loadX";

import {
  dirTextHandler,
  exchangeToSlugCity,
  findSimilarPmPairs,
  generateExchangeSeo,
} from "../components/exchange/exchangeHelper";
import { addPathsToSitemap } from "../cache/cache";
import { IMassDirTextId } from "../types/mass";

const locale = (process.env.NEXT_PUBLIC_SITE_LANG || "ru") as "ru" | "en";
const prerenderCountries = ["ukraine", "russia", "belarus"];

const ExchangePage = (props: {
  seo: ISEO;
  givePmData: IPmData | null;
  getPmData: IPmData | null;
  locale: "ru";
  dirText: IDirText | null;
  city: ICity | null;
  similarPmPairs: IPm[][] | null;
  donorCity: ICity | null;
  dirTextIds: IMassDirTextId[];
}) => {
  return <Exchange {...props} />;
};

export async function getStaticProps({
  params,
}: {
  params: { exchange: string };
}) {
  try {
    const { exchange } = params;
    const [slug, cityParam] = exchangeToSlugCity(exchange);

    const isCash =
      (slug && slug.startsWith("cash-")) || slug.includes("-cash-");

    const [
      pms,
      dirs,
      cities,
      pmLayouts,
      articleCodes,
      customDirText,
      dirTextIds,
    ] = await Promise.all([
      loadPms(),
      loadPossibleDirs(),
      isCash ? loadCities() : null,
      loadPmLayouts(),
      loadArticleCodes(),
      loadCustomDirText(slug),
      loadMassDirTextIds({ isSell: true }),
    ]);

    const slugToCodes = getSlugToCodes(dirs, pms);

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

    if (giveArticleExists) givePm.article_exists = true;
    if (giveArticleExists) getPm.article_exists = true;

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

    const dirText = (await dirTextHandler({
      locale,
      givePm,
      getPm,
      customDirText,
      city,
      pms,
      articleCodes,
    })) as IDirText;

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
        givePmData,
        getPmData,
        dirText,
        city: city || null,
        similarPmPairs: similarPmPairs || null,
        dirTextIds: dirTextIds || null,
        ...(await serverSideTranslations(locale, ["main"])),
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
        ...(await serverSideTranslations(locale, ["main"])),
      },
      revalidate: 2400,
    };
  }
}

export async function getStaticPaths() {
  const [pms, possiblePairs, cities] = await Promise.all([
    loadPms(),
    loadPossibleDirs(),
    loadCities(),
  ]);

  const slugToCodes = getSlugToCodes(possiblePairs, pms);

  if (!slugToCodes || !cities) {
    console.error(
      "[getStaticPaths] 'slugToCodes' or 'cities' missing/invalid."
    );
    return { paths: [], fallback: "blocking" };
  }

  const allPaths = Object.keys(slugToCodes).map((slug) => ({
    params: { exchange: slug },
  }));

  const needPrerender = (exchangePath: string) => {
    if (!exchangePath.includes("-in-")) return true; // don't prerender cities
    const city = cities?.find((city) =>
      exchangePath.includes(city.en_name.toLowerCase())
    );
    const countryName = city?.en_country_name?.toLowerCase();
    return (
      city &&
      countryName &&
      city?.population > 3 &&
      prerenderCountries.includes(countryName)
    );
  };

  const paths = allPaths.filter((p) => needPrerender(p.params.exchange));
  const prerenderLimit = process.env.NEXT_PUBLIC_PRERENDER_LIMIT
    ? Number(process.env.NEXT_PUBLIC_PRERENDER_LIMIT)
    : 5000;

  const slicedPaths = paths.slice(0, prerenderLimit);
  await addPathsToSitemap(slicedPaths);

  return { paths: slicedPaths, fallback: "blocking" };
}

export default ExchangePage;
