import { readCache, writeCache } from "../../cache";
import { initCMSFetcher } from "../../services/fetchers";
import { IArticle } from "../../types/pages";
import { Text } from "@chakra-ui/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  ArticleCodesQuery,
  articleQuery,
  dirsTextQuery,
} from "../../services/initialQueries";
import Article from "../../components/exchange/article";
import { ICache, IPmPairs } from "../../types/exchange";
import { destructureDirSlug } from "../../redux/helper";
import { IPm } from "../../types/selector";
import { NextSeo, BreadcrumbJsonLd } from "next-seo";

const ArticlePage = (props: {
  locale: "en" | "ru";
  article: IArticle | null;
  code: string;
  otherDirs: { buy: IPmPairs[]; sell: IPmPairs[] };
}) => {
  const { article, code, locale } = props;
  if (!article) return <></>;
  return (
    <>
      <NextSeo
        title={article.header}
        description={article.subheader}
        canonical={`www.p2pie.com/articles/${code}`}
        additionalLinkTags={[
          {
            rel: "alternate",
            href: `www.p2pie.com/en/articles/${code}`,
            hrefLang: "en",
          },
          {
            rel: "alternate",
            href: `www.p2pie.com/ru/articles/${code}`,
            hrefLang: "ru",
          },
        ]}
        openGraph={{
          type: "article",
          article: {
            publishedTime: article.updatedAt,
            modifiedTime: article.updatedAt,
          },
          url: `www.p2pie.com/${locale}/articles/${code}`,
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
  try {
    const { code } = params;
    const cmsFetcher = initCMSFetcher({ code, locale });
    const { articles } = (await cmsFetcher(articleQuery)) as {
      articles: IArticle[];
    };
    const article = articles?.[0] || null;

    let otherDirs = { buy: [], sell: [] } as {
      buy: IPmPairs[];
      sell: IPmPairs[];
    };
    const cachedData = readCache() as ICache;
    if (article.section && cachedData.pms.length) {
      const { pms, slugToCodes } = cachedData;

      const articlePms = pms.filter(
        (pm) => pm.en_name.toLowerCase() == code.toLowerCase()
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
          const pmPair = {
            slug,
            givePm,
            getPm,
          } as IPmPairs;

          return givePm?.section == getPm?.section
            ? res
            : givePm?.en_name.toLowerCase() ===
              articlePms[0]?.en_name.toLowerCase()
            ? { sell: [...res.sell], buy: [...res.buy, pmPair] }
            : { buy: [...res.buy], sell: [...res.sell, pmPair] };
        },
        { buy: [], sell: [] }
      );
    }

    return {
      props: {
        locale,
        article,
        otherDirs,
        code,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
      revalidate: 6000,
    };
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
}
//.....................................................................................................
export async function getStaticPaths() {
  const locales = ["en", "ru"];
  const cmsFetcher = initCMSFetcher();
  const { articles } = (await cmsFetcher(ArticleCodesQuery)) as {
    articles: { code: string }[];
  };
  const articleCodes = articles.map((a) => a.code);

  const paths = Object.keys(articleCodes).reduce(
    (
      res: {
        params: { code: string };
        locale: string;
      }[],
      code: string
    ) => [
      ...res,
      ...locales.map((locale) => ({
        params: {
          code,
        },
        locale,
      })),
    ],
    []
  );
  return {
    paths,
    fallback: "blocking",
  };
}

export default ArticlePage;
