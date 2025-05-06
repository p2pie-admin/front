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

export const textToHTML = (text: string): string => {
  // only for SSR
  const rawHTML = marked(text) as string; // Convert Markdown to HTML
  const sanitizedHTML = DOMPurify.sanitize(rawHTML); // Sanitize HTML
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
    text: textToHTML(chapter.text), // Sanitize `text`
  };
}

const ArticlePage = (props: {
  locale: "en" | "ru";
  article: IArticle | null;
  code: string;
  otherDirs: { buy: IPmPairs[]; sell: IPmPairs[] };
}) => {
  const { article, code, locale } = props;

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setDirRatesStatus("fulfilled"));
  }, []);
  if (!article) return <></>;
  return (
    <>
      <NextSeo
        title={article.header}
        description={article.subheader}
        canonical={`https://p2pie.com/articles/${code}`}
        additionalLinkTags={[
          {
            rel: "alternate",
            href: `https://p2pie.com/en/articles/${code}`,
            hrefLang: "en",
          },
          {
            rel: "alternate",
            href: `https://p2pie.com/ru/articles/${code}`,
            hrefLang: "ru",
          },
        ]}
        openGraph={{
          type: "article",
          article: {
            publishedTime: article.updatedAt,
            modifiedTime: article.updatedAt,
          },
          url: `https://p2pie.com/${locale}/articles/${code}`,
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
            item: `https://p2pie.com/${locale}/articles/${code}`,
          },
        ]}
      />
      <Article {...props} />
    </>
  ); ///<Article article={article} />;
};

export async function getStaticProps({
  locale,
  params,
}: {
  locale: "en" | "ru";
  params: { code: string };
}) {
  console.info(
    `[getStaticProps] Starting for locale: ${locale}, code: ${params?.code}`
  );
  try {
    const { code } = params;
    const cmsFetcher = initCMSFetcher({ code, locale });

    console.info(`[getStaticProps] Fetching article for code: ${code}`);
    const { articles } = (await cmsFetcher(articleQuery)) as {
      articles: IArticle[];
    };

    if (!articles || !articles.length) {
      console.warn(`[getStaticProps] No article found for code: ${code}`);
    }

    const article = sanitizeArticle(articles?.[0]);
    if (!article) {
      console.warn(
        `[getStaticProps] Article sanitization failed or article is null for code: ${code}`
      );
      return { notFound: true };
    }

    let otherDirs = { buy: [], sell: [] } as {
      buy: IPmPairs[];
      sell: IPmPairs[];
    };

    const cachedData = readCache() as ICache;
    if (!cachedData?.pms?.length) {
      console.warn(`[getStaticProps] No cached PMs available.`);
    } else {
      const { pms, slugToCodes } = cachedData;
      const articlePms = pms.filter(
        (pm) => pm.en_name.toLowerCase() === code.toLowerCase()
      );

      const filteredDirs = Object.values(slugToCodes).filter((dir) => {
        const [giveCode, getCode] = dir.split("_");
        return (
          articlePms.find((pm) => pm.code === giveCode) ||
          articlePms.find((pm) => pm.code === getCode)
        );
      });

      otherDirs = filteredDirs.reduce(
        (res: { buy: IPmPairs[]; sell: IPmPairs[] }, dir: string) => {
          const slug = Object.keys(slugToCodes).find(
            (key) => slugToCodes[key] === dir
          );
          const givePm = pms.find((pm) => pm.code === dir.split("_")[0]);
          const getPm = pms.find((pm) => pm.code === dir.split("_")[1]);

          const pmPair = { slug, givePm, getPm } as IPmPairs;

          return givePm?.section === getPm?.section
            ? res
            : givePm?.en_name.toLowerCase() ===
              articlePms[0]?.en_name.toLowerCase()
            ? { sell: [...res.sell], buy: [...res.buy, pmPair] }
            : { buy: [...res.buy], sell: [...res.sell, pmPair] };
        },
        { buy: [], sell: [] }
      );
    }

    console.info(
      `[getStaticProps] Successfully generated props for code: ${code}`
    );
    return {
      props: {
        article,
        otherDirs,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
      revalidate: 6000,
    };
  } catch (e) {
    console.error(`[getStaticProps] Error for code: ${params?.code}`, e);
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  console.info("[getStaticPaths] Generating paths...");
  try {
    const locales = ["en", "ru"];
    const cmsFetcher = initCMSFetcher();
    const { articles } = (await cmsFetcher(articleCodesQuery)) as {
      articles: { code: string }[];
    };

    if (!articles || !articles.length) {
      console.warn("[getStaticPaths] No articles returned from CMS.");
    }

    const articleCodes = articles.map((a) => a.code);
    const paths = articleCodes.flatMap((code) =>
      locales.map((locale) => ({
        params: { code },
        locale,
      }))
    );

    console.info(`[getStaticPaths] Total paths generated: ${paths.length}`);
    return {
      paths,
      fallback: "blocking",
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
