import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import {
  getPmsFromPmGroup,
  pmsToSlug,
} from "../../components/main/side/selector/section/PmGroup/helper";
import { initCMSFetcher, initParserFetcher } from "../../services/fetchers";
import { pmGroupsQuery } from "../../services/initialQueries";
import { articleCodesQuery, articleQuery } from "../../services/pageQueries";
import { IArticle } from "../../types/pages";
import { IRate } from "../../types/rates";
import { IPmGroup, IPm } from "../../types/selector";
import { fetchRates } from "../../redux/thunks";
import { readCache, writeCache } from "../../services/cache";
import React from "react";
import Exchange from "../../components/exchange";
import { ICache } from "../../types/exchange";

const ExchangePage = (props: any) => {
  return <Exchange {...props} />;
};

export async function getStaticProps({
  locale,
  params,
  req,
}: {
  locale: "en" | "ru";
  params: { slug: string };
  req: any;
}) {
  const { slug } = params;
  let article = null as IArticle | null;
  const cachedData = readCache() as ICache;

  if (!cachedData.articleCodes) {
    const getAllArticleCodes = initCMSFetcher();
    const res = (await getAllArticleCodes(articleCodesQuery)) as {
      articles: { id: string; code: string }[];
    };
    const { articles } = res;
    cachedData.articleCodes = articles;
    writeCache(cachedData); // Save to cache
  }

  const articleCode = cachedData.articleCodes?.find(
    (a: any) => a.code.toUpperCase() === slug.toUpperCase()
  )?.code;

  if (articleCode) {
    const fetcher = initCMSFetcher({
      locale,
      code: articleCode,
    });
    const res = await fetcher(articleQuery);
    article = res?.articles[0] ? (res.articles[0] as IArticle) : null;
  }
  console.log(cachedData);

  if (!cachedData?.dirSlugPairs?.[slug])
    return {
      notFound: true,
    };

  const { givePm, getPm } = cachedData.dirSlugPairs[slug];
  const dir = `${givePm?.code}_${getPm?.code}`;
  console.log(dir);
  const curPair = `${givePm?.currency.code}_${getPm?.currency.code}`;
  let prerenderedDirRates = [] as IRate[];
  try {
    prerenderedDirRates = (await fetchRates(dir)) as IRate[];
  } catch (e) {
    console.error("prerenderedDirRates failed: ", dir);
  }

  const prerenderedCCRates = null;
  const isMobile = false;

  return {
    props: {
      article,
      slug,
      givePm,
      getPm,
      prerenderedDirRates,
      prerenderedCCRates,
      isMobile,
      ...(await serverSideTranslations(locale || "ru", ["home"])),
    },
    revalidate: cachedData.articleCodes.find((ac: any) => ac.code == slug)
      ? 3000
      : 60000,
  };
}

///////////////////////////////////////////////////////////////////////////////////////

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

  const pmGroupsFetcher = initCMSFetcher();
  const { pmGroups } = (await pmGroupsFetcher(pmGroupsQuery)) as {
    pmGroups: IPmGroup[];
  };
  console.log(`extracting pms from  ${pmGroups.length} pmGroups`);
  const pms = pmGroups.reduce((res: IPm[], pmGroup: IPmGroup) => {
    const pms = getPmsFromPmGroup(pmGroup);
    if (!pms || !pms.length) console.log("cant get pms from: ", pmGroup);
    return !pms ? res : [...res, ...pms];
  }, []);
  console.log(`received ${pms.length} pms`);

  const possiblePmPairs = dirs.map((dir) => ({
    givePm: pms.find((pm) => pm.code.toUpperCase() === dir.split("_")[0]),
    getPm: pms.find((pm) => pm.code.toUpperCase() === dir.split("_")[1]),
  }));

  const slugs = possiblePmPairs.map((pair) => pmsToSlug(pair));
  const locales = ["en", "ru"];
  const cachedData = readCache() as ICache;
  cachedData.dirSlugPairs = slugs.reduce(
    (res, slug, idx) => ({ ...res, [slug]: possiblePmPairs[idx] }),
    {}
  );
  writeCache(cachedData); // Save to cache

  return {
    paths: slugs.reduce(
      (arr: { params: { slug: string }; locale: string }[], slug: string) => [
        ...arr,
        ...locales.map((locale) => ({
          params: {
            slug,
          },
          locale,
        })),
      ],
      []
    ),
    fallback: true,
  };
}

export default ExchangePage;
