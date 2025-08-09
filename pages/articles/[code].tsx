import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { IPmPairs } from "../../types/exchange";
import { IArticle } from "../../types/pages";
import Article from "../../components/article";
import { addArticleCrossLinking } from "../../components/article/helper";
import { IPm } from "../../types/selector";
import { ISEO } from "../../types/general";
import { getT } from "../../components/shared/getT";
import { nullSeo } from "../../components/shared/UniversalSeo";

import { getSlugToCodes } from "../../cache/helper";
import {
  loadArticle,
  loadArticleCodes,
  loadArticles,
  loadPms,
  loadPossiblePairs,
  TTL,
} from "../../cache/loadX";

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
    const code = params.code;
    const [articleData, articleCodes, pms, possiblePairs] = await Promise.all([
      loadArticle(code, locale),
      loadArticleCodes(),
      loadPms(),
      loadPossiblePairs(),
    ]);

    const article = articleData?.[0];
    const slugToCodes = getSlugToCodes(possiblePairs, pms);
    if (!article) {
      console.warn(
        `[getStaticProps] No article found for code: ${params.code}`
      );
      return emptyProps(locale || "ru");
    }
    if (!pms?.length || !slugToCodes) {
      console.warn(
        `[getStaticProps] No pms or slugToCodes found for code: ${params.code}`
      );

      return emptyProps(locale || "ru");
    }

    const articlePms = pms.filter(
      // может быть несколько pm с одинаковым en_name
      (pm) => pm.en_name.toLowerCase() == code.toLowerCase()
    );

    // берем только те направления, что имеют такие же или give или get pm
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
        revalidate: TTL.slow,
      };
    }

    const linkedArticle = await addArticleCrossLinking(
      article,
      articleCodes,
      pms,
      locale,
      articlePms[0]
    );

    const normalizedCode = article?.code.toLowerCase();

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
      revalidate: TTL.slow,
    };
  } catch (e) {
    console.error("[getStaticProps] Error:", e);
    return await emptyProps(locale || "ru");
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////
export async function getStaticPaths() {
  try {
    const locales = ["en", "ru"] as ("en" | "ru")[];
    const paths: { params: { code: string }; locale: "en" | "ru" }[] = [];
    const articleCodes = (await loadArticleCodes()) as string[];

    loadArticles("ru");
    loadArticles("en");

    locales.forEach((locale) => {
      articleCodes.forEach((code) => {
        paths.push({
          params: {
            code: code.toLowerCase(),
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
