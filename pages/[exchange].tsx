import { IPm } from "../types/selector";
import React from "react";
import Exchange from "../components/exchange";
import { ICity, IDirText, IPmData } from "../types/exchange";
import { ISEO } from "../types/general";
import { nullSeo } from "../components/shared/UniversalSeo";
import { getCitySlugs, getSlugToCodes } from "../cache/helper";
import {
  loadPms,
  loadPossibleDirs,
  loadCities,
  loadArticleCodes,
  loadCustomDirText,
  loadMassDirTextIds,
  limitedPossibleDirs,
  TTL,
} from "../cache/loadX";
import {
  dirTextHandler,
  exchangeToSlugCity,
  findSimilarPmPairs,
  generateExchangeSeo,
} from "../components/exchange/helper";
import { addHeadersToSearchIndex, addPathsToSitemap } from "../cache/cache";
import { IMassDirTextId } from "../types/mass";
import { initParserFetcher } from "../services/fetchers";
import { ParserCityDirections } from "../types/map";
import {
  buildRatesSummary,
  HISTORY_DAYS,
  IDirHistory,
  IRatesSummary,
  ISsrRate,
  prepareDirHistory,
  prepareSsrRates,
  SSR_NOINDEX_BELOW,
  SSR_RATES_LIMIT,
} from "../components/exchange/ssrRates";

const ExchangePage = (props: {
  seo: ISEO;
  givePmData: IPmData | null;
  getPmData: IPmData | null;
  dirText: IDirText | null;
  city: ICity | null;
  similarPmPairs: IPm[][] | null;
  donorCity: ICity | null;
  dirTextIds: IMassDirTextId[];
  initialDirRates: ISsrRate[] | null;
  ratesTotal: number | null;
  ratesSummary: IRatesSummary | null;
  rateHistory: IDirHistory | null;
}) => {
  return <Exchange {...props} />;
};

// Offers for the direction, fetched server side so they land in the HTML.
// Mirrors the client request in components/exchange/tv (same path, same city rule).
const loadSsrRates = async ({
  dir,
  isCash,
  city,
}: {
  dir: string;
  isCash: boolean;
  city: ICity | null;
}) => {
  const cityName = isCash ? city?.en_name || "moscow" : "";
  const parserFetcher = initParserFetcher();
  const [raw, rawHistory] = await Promise.all([
    parserFetcher(`dir=${dir}/all/${cityName.toLowerCase()}`),
    parserFetcher(`history/dir=${dir}?days=${HISTORY_DAYS}`),
  ]);
  const all = prepareSsrRates(raw, cityName);
  return {
    initialDirRates: all ? all.slice(0, SSR_RATES_LIMIT) : null,
    ratesTotal: all ? all.length : null,
    ratesSummary: buildRatesSummary(all),
    rateHistory: prepareDirHistory(rawHistory),
    // Only decide on noindex when the API answered; an outage must not hide good pages.
    noindex: Array.isArray(all) && all.length < SSR_NOINDEX_BELOW,
  };
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

    const [pms, allPossibleDirs, cities, articleCodes, dirTextIds] =
      await Promise.all([
        loadPms(),
        loadPossibleDirs(),
        isCash ? loadCities() : null,
        loadArticleCodes(),
        loadMassDirTextIds({ isSell: true }),
      ]);
    const dirs = limitedPossibleDirs(allPossibleDirs, "low");
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
      console.log("dir ERROR", slug);
      return { notFound: true };
    }

    const similarPmPairs = findSimilarPmPairs(
      givePm,
      getPm,
      pms,
      Object.values(slugToCodes),
    );

    const city = cityParam
      ? cities?.find(
          (c) => c.en_name?.toLowerCase() === cityParam.toLowerCase(),
        ) || null
      : null;

    const normalizeCityKey = (value: string) =>
      value.trim().toLowerCase().replace(/\s+/g, "-");
    const citySlug = cityParam
      ? `${slug}-${normalizeCityKey(cityParam)}`
      : slug;
    const useTextBox = process.env.NEXT_PUBLIC_DIR_TEXTS_ONLY !== "true";
    const textBoxKeys = cityParam ? [citySlug, slug] : [slug];
    let cityCustomDirText: IDirText | null = null;
    let defaultDirText: IDirText | null = null;
    if (useTextBox) {
      [cityCustomDirText, defaultDirText] = await Promise.all(
        textBoxKeys.map((key) => loadCustomDirText(key)),
      );
    }
    const customDirText = useTextBox
      ? cityCustomDirText || defaultDirText || null
      : null;

    let [giveExists, getExists] = [false, false];
    if (articleCodes.length) {
      giveExists = !!articleCodes?.find(
        (code) => code?.toUpperCase() == givePm.en_name.toUpperCase(),
      );
      getExists = !!articleCodes?.find(
        (code) => code?.toUpperCase() == getPm.en_name.toUpperCase(),
      );
    }

    const givePmData = {
      pm: givePm,
      exists: giveExists,
    } as IPmData;
    const getPmData = {
      pm: getPm,
      exists: getExists,
    } as IPmData;

    const [dirText, ssr] = await Promise.all([
      dirTextHandler({
        givePm,
        getPm,
        customDirText,
        city,
        articleCodes,
      }) as Promise<IDirText>,
      loadSsrRates({ dir, isCash: !!isCash, city }),
    ]);

    const seo = generateExchangeSeo({
      dirText,
      slug,
      city,
    }) as ISEO;
    seo.noindex = ssr.noindex;

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
        initialDirRates: ssr.initialDirRates,
        ratesTotal: ssr.ratesTotal,
        ratesSummary: ssr.ratesSummary,
        rateHistory: ssr.rateHistory,
      },
      // Offers are baked into the HTML, so regenerate often enough to stay fresh.
      revalidate: TTL.fast,
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
        initialDirRates: null,
        ratesTotal: null,
        ratesSummary: null,
        rateHistory: null,
      },
      revalidate: TTL.instant,
    };
  }
}
//////////////////////////////////////////////////////////////////////////////

export async function getStaticPaths() {
  const parserFetcher = initParserFetcher();
  const [cities, cityDirectionsData, pms, allPossibleDirs] = await Promise.all([
    loadCities(),
    parserFetcher("non_empty_cities") as Promise<ParserCityDirections | null>,
    loadPms(),
    loadPossibleDirs(),
  ]);

  const dirsForSitemap = limitedPossibleDirs(allPossibleDirs, "middle");
  const slugToCodes = getSlugToCodes(dirsForSitemap, pms);

  if (!slugToCodes || !cities) {
    console.error(
      "[getStaticPaths] 'slugToCodes' or 'cities' missing/invalid.",
    );
    return { paths: [], fallback: "blocking" };
  }

  const citySlugs = getCitySlugs(slugToCodes, cityDirectionsData);

  const dirsToPrerender = limitedPossibleDirs(allPossibleDirs, "high");

  const slugsToPrerender = getSlugToCodes(dirsToPrerender, pms);

  const slugsForSitemap = getSlugToCodes(dirsForSitemap, pms);
  const sitemapPaths = Object.keys(slugsForSitemap).map((slug) => ({
    params: { exchange: slug },
  }));

  const prerenderLimit = process.env.NEXT_PUBLIC_PRERENDER_LIMIT
    ? Number(process.env.NEXT_PUBLIC_PRERENDER_LIMIT)
    : 5000;

  const pathsToPrerender = [
    ...Object.keys(slugsToPrerender).map((slug) => ({
      params: { exchange: slug },
    })),
    ...citySlugs.map((slug) => ({ params: { exchange: slug } })),
  ].slice(0, prerenderLimit);

  await addPathsToSitemap(sitemapPaths);
  console.log("exchange allPaths: ", Object.keys(slugToCodes).length);
  console.log("exchange pathsToPrerender: ", pathsToPrerender.length);

  return { paths: pathsToPrerender, fallback: "blocking" };
}

export default ExchangePage;
