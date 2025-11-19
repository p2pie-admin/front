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
import { addHeadersToSearchIndex, addPathsToSitemap } from "../cache/cache";
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

    const [pms, dirs, cities, pmLayouts, articleCodes, dirTextIds] =
      await Promise.all([
        loadPms(),
        loadPossibleDirs(),
        isCash ? loadCities() : null,
        loadPmLayouts(),
        loadArticleCodes(),
        loadMassDirTextIds({ isSell: true }),
      ]);

    const slugToCodes = getSlugToCodes(dirs, pms);
    console.log(slugToCodes);

    if (!pms || !Array.isArray(pms)) {
      console.error("[getStaticProps] 'pms' is missing or invalid.");
      return { notFound: true };
    }

    const dir = slugToCodes?.[slug];
    const [giveCode, getCode] = dir?.split("_") ?? [];
    const givePm = pms?.find((pm) => pm.code === giveCode) ?? null;
    const getPm = pms?.find((pm) => pm.code === getCode) ?? null;

    if (!dir || !givePm || !getPm) {
      console.log("dir", dir);
      console.log("givePm", givePm);
      console.log("getPm", getPm);
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

    const normalizeCityKey = (value: string) =>
      value.trim().toLowerCase().replace(/\s+/g, "-");
    const citySlug = cityParam
      ? `${slug}-${normalizeCityKey(cityParam)}`
      : slug;
    const textBoxKeys = cityParam ? [citySlug, slug] : [slug];
    const [cityCustomDirText, defaultDirText] = await Promise.all(
      textBoxKeys.map((key) => loadCustomDirText(key))
    );
    const customDirText = cityCustomDirText || defaultDirText || null;

    const givePmLayout =
      pmLayouts?.find((l) => l.section == givePm?.section) || null;
    const getPmLayout =
      pmLayouts?.find((l) => l.section == getPm?.section) || null;

    let [giveExists, getExists] = [false, false];
    if (articleCodes.length) {
      giveExists = !!articleCodes?.find(
        (code) => code?.toUpperCase() == givePm.en_name.toUpperCase()
      );
      getExists = !!articleCodes?.find(
        (code) => code?.toUpperCase() == getPm.en_name.toUpperCase()
      );
    }

    const givePmData = {
      pm: givePm,
      pmLayout: givePmLayout,
      exists: giveExists,
    } as IPmData;
    const getPmData = {
      pm: getPm,
      pmLayout: getPmLayout,
      exists: getExists,
    } as IPmData;

    const dirText = (await dirTextHandler({
      givePm,
      getPm,
      customDirText,
      city,
      // pms,
      // articleCodes,
    })) as IDirText;

    const seo = generateExchangeSeo({
      dirText,
      slug,
      city,
    }) as ISEO;

    await addHeadersToSearchIndex({
      slug,
      header: dirText.h1 || dirText.seo_title,
      wordsToSearchFrom: `${dirText.h1} ${dirText.seo_title} ${dirText.header}`,
    });

    return {
      props: {
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
      revalidate: 54000,
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
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
      revalidate: 24000,
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
