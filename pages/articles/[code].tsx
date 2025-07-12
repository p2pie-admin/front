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
import { getCachedData, loadInitialData } from "../../cache/loadInitialData";
import { addArticleCrossLinking } from "../../components/article/helper";
import { IPm } from "../../types/selector";
import { ISEO } from "../../types/general";
import { getT } from "../../components/shared/getT";
import { nullSeo } from "../../components/shared/UniversalSeo";
import { read } from "fs";

const emptyProps = async (locale: "en" | "ru") => ({
  props: {
    seo: nullSeo,
    pm: null,
    article: null,
    otherDirs: null,
    locale,
    ...(await serverSideTranslations(locale || "ru", ["main"])),
  },
  revalidate: 600,
});

const ArticlePage = (props: {
  seo: ISEO;
  pm: IPm | null;
  locale: "en" | "ru";
  article: IArticle | null;
  otherDirs: { buy: IPmPairs[]; sell: IPmPairs[] } | null;
}) => <Article {...props} />;

export async function getStaticProps({
  params,
  locale,
}: {
  params: { code: string };
  locale: "en" | "ru";
}) {
  try {
    const cachedData = (await getCachedData({ isHard: false })) as
      | ICache
      | undefined;

    if (!cachedData || !cachedData.possiblePairs) {
      console.error(
        "articles [getStaticProps] Cached data is missing or invalid."
      );
      return emptyProps(locale || "ru");
    }

    const { pms, slugToCodes } = cachedData;
    const articles = cachedData[`${locale}Data`]?.articles || [];

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
          : givePm?.en_name.toLowerCase() ===
            articlePms[0]?.en_name.toLowerCase()
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
      return {
        props: {
          pm: null,
          article: null,
          otherDirs: null,
          locale,
          ...(await serverSideTranslations(locale || "ru", ["main"])),
        },
        revalidate: 600,
      };
    }

    const linkedArticle = await addArticleCrossLinking(
      article,
      articles,
      pms,
      locale,
      articlePms[0]
    );

    const normalizedCode = article?.code.toLowerCase();

    const t = await getT(locale || "ru");

    const seo = {
      title: article.header,
      description: article.subheader,
      canonicalPath: `${locale}/articles/${normalizedCode}`,
      updatedAt: article.updatedAt || new Date().toISOString(),

      locale,
      alternateLangs: [
        {
          rel: "alternate",
          hrefLang: "en",
          href: `https://${process.env.NEXT_PUBLIC_NAME}.com/en/articles/${normalizedCode}`,
        },
        {
          rel: "alternate",
          hrefLang: "ru",
          href: `https://${process.env.NEXT_PUBLIC_NAME}.com/ru/articles/${normalizedCode}`,
        },
      ],
    };

    return {
      props: {
        seo: seo || nullSeo,
        pm: articlePms[0] || null,
        article: linkedArticle || null,
        otherDirs: otherDirs || null,
        locale,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
      revalidate: 600,
    };
  } catch (e) {
    console.error("[getStaticProps] Error:", e);
    return emptyProps;
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////
export async function getStaticPaths() {
  try {
    const cachedData = (await getCachedData({ isHard: true })) as
      | ICache
      | undefined;

    if (!cachedData?.timestamp) {
      console.error(
        "articles [getStaticPaths] Cached data is missing or invalid."
      );
      return {
        paths: [],
        fallback: "blocking",
      };
    }

    const locales = ["en", "ru"] as ("en" | "ru")[];
    const paths: { params: { code: string }; locale: "en" | "ru" }[] = [];

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
      paths: paths.slice(
        0,
        process.env.NEXT_PUBLIC_PRERENDER_LIMIT
          ? Number(process.env.NEXT_PUBLIC_PRERENDER_LIMIT)
          : 10000
      ),
      fallback: "blocking", // Use "blocking" to dynamically generate pages on demand
    };
  } catch (e) {
    console.error("Articles [getStaticPaths] Error while generating paths", e);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
}

export default ArticlePage;
