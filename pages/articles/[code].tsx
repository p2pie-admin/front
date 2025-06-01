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
import {
  addArticlesCrossLinking,
  convertArticle,
} from "../../components/article/helper";

const ArticlePage = (props: {
  locale: "en" | "ru";
  article: IArticle | null;
  otherDirs: { buy: IPmPairs[]; sell: IPmPairs[] };
}) => {
  const { article, locale } = props;

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setDirRatesStatus("fulfilled"));
  }, []);

  if (!article) {
    return <div>Article not found</div>;
  }
  const normalizedCode = article.code.toLowerCase();

  return (
    <>
      <NextSeo
        title={article.header}
        description={article.subheader}
        canonical={`https://p2pie.com/${locale}/articles/${normalizedCode}`}
        additionalLinkTags={[
          {
            rel: "alternate",
            href: `https://p2pie.com/en/articles/${normalizedCode}`,
            hrefLang: "en",
          },
          {
            rel: "alternate",
            href: `https://p2pie.com/ru/articles/${normalizedCode}`,
            hrefLang: "ru",
          },
        ]}
        openGraph={{
          type: "article",
          article: {
            publishedTime: article.updatedAt,
            modifiedTime: article.updatedAt,
          },
          url: `https://p2pie.com/${locale}/articles/${normalizedCode}`,
          site_name: article.header,
        }}
      />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: locale == "en" ? "Home" : "Главная",
            item: `https://p2pie.com/${locale}`,
          },
          {
            position: 2,
            name: article.header,
            item: `https://p2pie.com/${locale}/articles/${normalizedCode}`,
          },
        ]}
      />
      <Article {...props} />
    </>
  );
};

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
  const updatedArticles = addArticlesCrossLinking(articles);

  // Use cached data as needed
  const code = params.code.toLowerCase();

  const article = updatedArticles?.find(
    (a: any) => a.code.toLowerCase() === code
  );

  if (!article) {
    console.warn(`[getStaticProps] No article found for code: ${code}`);
    return { notFound: true };
  }

  const articlePms = pms.filter(
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

  return {
    props: {
      article: await convertArticle(article),
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
