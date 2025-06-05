import { readCache, writeCache } from "../../cache";
import { initCMSFetcher } from "../../services/fetchers";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ICache, IPmPairs } from "../../types/exchange";
import { NextSeo, BreadcrumbJsonLd } from "next-seo";
import { useAppDispatch } from "../../redux/hooks";
import { useEffect } from "react";
import { setDirRatesStatus } from "../../redux/mainReducer";
import { IArticle } from "../../types/pages";
import Article from "../../components/article";
import { loadInitialData } from "../../cache/loadInitialData";
import { addArticleCrossLinking } from "../../components/article/helper";
import { IPm } from "../../types/selector";

const ArticlePage = (props: {
  pm: IPm;
  locale: "en" | "ru";
  article: IArticle | null;
  otherDirs: { buy: IPmPairs[]; sell: IPmPairs[] };
}) => <Article {...props} />;

export async function getStaticProps({
  params,
  locale,
}: {
  params: { code: string };
  locale: "en" | "ru";
}) {
  const cachedData = await loadInitialData();

  if (!cachedData || !cachedData.possiblePairs) {
    console.error(
      "articles [getStaticProps] Cached data is missing or invalid."
    );
    return { notFound: true };
  }

  const { pms, slugToCodes } = cachedData;
  const articles = cachedData[`${locale}Data`]?.articles || [];
  if (!pms || !Array.isArray(pms)) {
    console.error("[getStaticProps] 'pms' is missing or invalid.");
    return { notFound: true };
  }
  if (!articles || !Array.isArray(articles)) {
    console.error("[getStaticProps] 'articles' is missing or invalid.");
    return { notFound: true };
  }

  const code = params.code.toLowerCase();

  const articlePms = pms.filter(
    // может быть несколько pm с одинаковым en_name
    (pm) => pm.en_name.toLowerCase() == code.toLowerCase()
  );

  // берем только те направления, что имеют или give или get pm
  const filteredDirs = Object.values(slugToCodes).filter((dir) => {
    const [giveCode, getCode] = dir.split("_");
    return (
      articlePms.find((pm) => pm.code === giveCode) ||
      articlePms.find((pm) => pm.code === getCode)
    );
  });
  //  создаем альтернативные предложения
  const otherDirs = filteredDirs.reduce(
    (res: { buy: IPmPairs[]; sell: IPmPairs[] }, dir: string) => {
      const slug = Object.keys(slugToCodes).find(
        (key) => slugToCodes[key] === dir
      );
      const givePm = pms.find((pm) => pm.code === dir.split("_")[0]);
      const getPm = pms.find((pm) => pm.code === dir.split("_")[1]);
      const pmPair = {
        slug,
        givePm,
        getPm,
      } as IPmPairs;

      return givePm?.section == getPm?.section
        ? res
        : givePm?.en_name.toLowerCase() === articlePms[0]?.en_name.toLowerCase()
        ? { sell: [...res.sell], buy: [...res.buy, pmPair] }
        : { buy: [...res.buy], sell: [...res.sell, pmPair] };
    },
    { buy: [], sell: [] }
  );
  const article = articles.find(
    (a) => a.code.toLowerCase() == code.toLowerCase()
  );
  if (!article) {
    console.warn(`[getStaticProps] No article found for code: ${code}`);
    return { notFound: true };
  }

  const linkedArticle = await addArticleCrossLinking(
    article,
    articles,
    pms,
    locale,
    articlePms[0]
  );

  return {
    props: {
      pm: articlePms[0] || null,
      article: linkedArticle,
      otherDirs,
      locale,
      ...(await serverSideTranslations(locale || "ru", ["main"])),
    },
    revalidate: 600,
  };
}
/////////////////////////////////////////////////////////////////////////////////////////////
export async function getStaticPaths() {
  let cachedData;
  try {
    cachedData = await loadInitialData();
  } catch (e) {
    console.error("[getStaticPaths] Error loading initial data", e);
    return {
      paths: [],
      fallback: "blocking",
    };
  }

  if (!cachedData) {
    console.error(
      "articles [getStaticPaths] Cached data is missing or invalid."
    );
    return {
      paths: [],
      fallback: "blocking",
    };
  }

  try {
    const locales = ["en", "ru"] as ("en" | "ru")[];
    const paths: { params: { code: string }; locale: "en" | "ru" }[] = [];
    const cachedData = await loadInitialData();

    locales.forEach((locale) => {
      const articles = cachedData?.[`${locale}Data`]?.articles || [];
      articles.forEach((a) => {
        paths.push({
          params: {
            code: a.code.toLowerCase(),
          },
          locale,
        });
      });
    });

    return {
      paths,
      fallback: "blocking", // Use "blocking" to dynamically generate pages on demand
    };
  } catch (e) {
    console.error("[getStaticPaths] Error while generating paths", e);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
}

export default ArticlePage;
