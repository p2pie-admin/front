import { readCache, writeCache } from "../../cache";
import { initCMSFetcher } from "../../services/fetchers";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { articleCodesQuery, articleQuery } from "../../services/initialQueries";
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
  locale: string;
}) {
  const cachedData = readCache();

  if (!cachedData || !cachedData.possiblePairs) {
    console.error("[getStaticProps] Cached data is missing or invalid.");
    return { notFound: true };
  }

  const { possiblePairs, selector, parserSetting } = cachedData;

  // Use cached data as needed
  const code = params.code.toLowerCase();

  if (!selector.articles || !Array.isArray(selector.articles)) {
    console.error("[getStaticProps] Articles data is missing or invalid.");
    return { notFound: true };
  }

  const article = selector.articles.find(
    (a: any) => a.code.toLowerCase() === code
  );

  if (!article) {
    console.warn(`[getStaticProps] No article found for code: ${code}`);
    return { notFound: true };
  }

  return {
    props: {
      article,
      possiblePairs,
      parserSetting,
      ...(await serverSideTranslations(locale || "ru", ["main"])),
    },
    revalidate: 600,
  };
}

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
    console.error("[getStaticPaths] Cached data is missing or invalid.");
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
      if (!localeData || !localeData.articleCodes) {
        console.warn(
          `[getStaticPaths] No article codes found for locale: ${locale}`
        );
        return;
      }

      localeData.articleCodes.forEach((code) => {
        paths.push({
          params: {
            code: code.toLowerCase(),
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
