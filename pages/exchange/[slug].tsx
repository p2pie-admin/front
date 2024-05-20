import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Exchange from "../../components/exchange";
import {
  getPmsFromPmGroup,
  pmsToSlug,
} from "../../components/main/side/selector/section/PmGroup/helper";
import { restoreFromSlug, fetchRates } from "../../redux/thunks";
import { initCMSFetcher, initParserFetcher } from "../../services/fetchers";
import { pmGroupsQuery } from "../../services/initialQueries";
import { articleCodesQuery, articleQuery } from "../../services/pageQueries";
import { IArticle } from "../../types/pages";
import { IRate } from "../../types/rates";
import { IPmGroup, IPm } from "../../types/selector";

const ExchangePage = (props: any) => {
  return <Exchange {...props} />;
};

let cachedData = {} as {
  articleCodes: { id: string; code: string }[];
  popular_dirs: string[];
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
  let article = null;
  // ФЕТЧИМ ТОЛЬКО СПУСТЯ ВРЕМЯ ЧТОБЫ ЗАПРОСИТЬ НАПРАВЛЕНИЯ
  // С СУЩЕСТВУЮЩИМИ АРТИКЛАМИ ТОЛЬКО ОДИН РАЗ
  // И НЕ ЗАГРУЖАТЬ STRAPI
  if (!cachedData.articleCodes) {
    const getAllArticleCodes = initCMSFetcher();
    const res = (await getAllArticleCodes(articleCodesQuery)) as {
      articles: { id: string; code: string }[];
    };
    const { articles } = res;
    cachedData.articleCodes = articles;
  }

  const articleCode = cachedData.articleCodes?.find(
    (a) => a.code.toUpperCase() === slug.toUpperCase()
  )?.code;

  if (articleCode) {
    const fetcher = initCMSFetcher({
      locale,
      code: articleCode,
    });
    const res = await fetcher(articleQuery);
    article = res?.articles[0] ? (res.articles[0] as IArticle) : null;
  }

  const { givePm, getPm } = await restoreFromSlug(slug);
  if (!givePm || !getPm)
    return {
      notFound: true,
    };
  const dir = `${givePm?.code}_${getPm?.code}`;
  const curPair = `${givePm?.currency.code}_${getPm?.currency.code}`;
  let prerenderedDirRates = [] as IRate[];
  try {
    prerenderedDirRates = (await fetchRates(dir)) as IRate[];
  } catch (e) {
    console.error("prerenderedDirRates failed: ", dir);
  }
  const prerenderedCCRates = null; //(await fetchCCRates({ curPair }))?.data;
  //const userAgent = req?.headers?.["user-agent"] || "";
  const isMobile = false; //ifMobile(userAgent);

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
    revalidate: cachedData.articleCodes.find((ac) => ac.code == slug)
      ? 3000
      : 60000, // sec
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

  const filteredDirs = dirs.filter(
    (dir) => dir.includes("BTC") && dir.includes("RUB")
  );
  //["BTC_SBERRUB", "BTC_ETH"];
  const pmGroupsFetcher = initCMSFetcher();
  const { pmGroups } = (await pmGroupsFetcher(pmGroupsQuery)) as {
    pmGroups: IPmGroup[];
  };

  const pms = pmGroups.reduce(
    (res: IPm[], pmGroup: IPmGroup) => {
      const pms = getPmsFromPmGroup(pmGroup);
      return !pms ? res : [...res, ...pms];
    },

    []
  );

  const possiblePmPairs = dirs.map((dir) => ({
    givePm: pms.find((pm) => pm.code.toUpperCase() === dir.split("_")[0]),
    getPm: pms.find((pm) => pm.code.toUpperCase() === dir.split("_")[1]),
  }));

  const slugs = possiblePmPairs.map((pair) => pmsToSlug(pair));
  //slugs.map(s => console.log(s));
  const locales = ["en", "ru"];

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
