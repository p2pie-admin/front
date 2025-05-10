import { readCache, writeCache } from "../../cache";
import { initCMSFetcher } from "../../services/fetchers";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Article from "../../components/exchange/article";
import { ICache, IPmPairs } from "../../types/exchange";
import { NextSeo, BreadcrumbJsonLd } from "next-seo";
import { useAppDispatch } from "../../redux/hooks";
import { useEffect } from "react";
import { setDirRatesStatus } from "../../redux/mainReducer";
import { IArticle } from "../../types/pages";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import { loadInitialData } from "../../services/loadInitialData";

export const textToHTML = (text: string): string => {
  const rawHTML = marked(text) as string;
  const sanitizedHTML = DOMPurify.sanitize(rawHTML);
  return sanitizedHTML.replace(/\n/g, "<br>");
};

export function sanitizeArticle(article?: IArticle): IArticle | null {
  if (!article) return null;
  return {
    ...article,
    chapters: article.chapters.map((chapter) => sanitizeChapter(chapter)),
  };
}

export function sanitizeChapter(chapter: { title: string; text: string }) {
  return {
    ...chapter,
    text: textToHTML(chapter.text),
  };
}

const ArticlePage = (props: {
  locale: "en" | "ru";
  article: IArticle | null;
  code: string;
  otherDirs: { buy: IPmPairs[]; sell: IPmPairs[] };
}) => {
  const { article, code, locale } = props;
  const normalizedCode = code.toLowerCase();

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setDirRatesStatus("fulfilled"));
  }, []);

  if (!article) {
    return <div>Article not found</div>;
  }

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

  if (!cachedData || !cachedData?.possiblePairs) {
    console.error(
      "articles [getStaticProps] Cached data is missing or invalid."
    );
    return { notFound: true };
  }

  const { possiblePairs, parserSetting } = cachedData;

  // Use cached data as needed
  const code = params.code.toLowerCase();
  const article = cachedData?.[`${locale}Data`]?.articles?.find(
    (article) => article.code.toLowerCase() === code
  );
  if (!article) {
    console.error(
      `[getStaticProps] Article with code ${code} not found in cached data.`
    );
    return { notFound: true };
  }
  const sanitizedArticle = sanitizeArticle(article);

  return {
    props: {
      article: sanitizedArticle,
      possiblePairs,
      parserSetting,
      ...(await serverSideTranslations(locale || "ru", ["main"])),
    },
    revalidate: 600,
  };
}

export async function getStaticPaths() {
  const cachedData = await loadInitialData();

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

    locales.forEach((locale) => {
      const localeData = cachedData?.[`${locale}Data`];
      if (!localeData || !localeData.articles) {
        console.warn(
          `[getStaticPaths] No article codes found for locale: ${locale}`
        );
        return;
      }

      localeData.articles.forEach((article) => {
        paths.push({
          params: {
            code: article.code.toLowerCase(),
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
