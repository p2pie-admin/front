import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { IPmPairs } from "../../types/exchange";
import { IArticle } from "../../types/pages";
import Article from "../../components/article";
import { addArticleCrossLinking } from "../../components/article/helper";
import { IPm } from "../../types/selector";
import { ISEO } from "../../types/general";
import { nullSeo } from "../../components/shared/UniversalSeo";

import { getSlugToCodes } from "../../cache/helper";
import {
  loadArticle,
  loadArticleCodes,
  loadPms,
  loadPossibleDirs,
  TTL,
} from "../../cache/loadX";
import { addPathsToSitemap } from "../../cache/cache";

const locale = (process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "ru") as "en" | "ru";

const emptyProps = async (locale: "en" | "ru") => ({
  props: {
    seo: nullSeo,
    pm: null,
    article: null,
    otherDirs: null,
    locale,
    ...(await serverSideTranslations(locale, ["main"])),
  },
  revalidate: 60000,
});

const ArticlePage = (props: {
  seo: ISEO;
  pm: IPm | null;
  article: IArticle | null;
  otherDirs: { buy: IPmPairs[]; sell: IPmPairs[] } | null;
}) => <Article {...props} />;

export async function getStaticProps({ params }: { params: { code: string } }) {
  try {
    // force locale from env

    const code = params.code;
    const [article, articleCodes, pms, dirs] = await Promise.all([
      loadArticle(code),
      loadArticleCodes(),
      loadPms(),
      loadPossibleDirs(),
    ]);

    const slugToCodes = getSlugToCodes(dirs, pms);
    if (!article) {
      console.warn(
        `[getStaticProps] No article found for code: ${params.code}`
      );
      return emptyProps(locale);
    }
    if (!pms?.length || !slugToCodes) {
      console.warn(
        `[getStaticProps] No pms or slugToCodes found for code: ${params.code}`
      );
      return emptyProps(locale);
    }

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

    const otherDirs = filteredDirs.reduce(
      (res: { buy: IPmPairs[]; sell: IPmPairs[] }, dir: string) => {
        const slug = Object.keys(slugToCodes).find(
          (key) => slugToCodes[key] === dir
        );
        const givePm = pms.find((pm) => pm.code === dir.split("_")[0]);
        const getPm = pms.find((pm) => pm.code === dir.split("_")[1]);
        const pmPair = { slug, givePm, getPm } as IPmPairs;

        return givePm?.section == getPm?.section
          ? res
          : givePm?.en_name.toLowerCase() ===
            articlePms[0]?.en_name.toLowerCase()
          ? { sell: [...res.sell], buy: [...res.buy, pmPair] }
          : { buy: [...res.buy], sell: [...res.sell, pmPair] };
      },
      { buy: [], sell: [] }
    );

    const linkedArticle = await addArticleCrossLinking(
      article,
      articleCodes,
      pms
    );

    const normalizedCode = article?.code.toLowerCase();

    const seo = {
      title: article.seo_title,
      description: article.seo_description,
      canonicalSlug: `articles/${normalizedCode}`,
      updatedAt: article.updatedAt || new Date().toISOString(),
    } as ISEO;

    return {
      props: {
        seo: seo || nullSeo,
        pm: articlePms[0] || null,
        article: linkedArticle || null,
        otherDirs: otherDirs || null,
        locale,
        ...(await serverSideTranslations(locale, ["main"])),
      },
      revalidate: TTL.slow,
    };
  } catch (e) {
    console.error("[getStaticProps] Error:", e);
    return await emptyProps(locale);
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////

export async function getStaticPaths() {
  try {
    const paths: { params: { code: string }; locale: "en" | "ru" }[] = [];
    const articleCodes = (await loadArticleCodes()) as string[];

    articleCodes.forEach((code) => {
      paths.push({
        params: { code: code.toLowerCase() },
        locale,
      });
    });

    const prerenderLimit = process.env.NEXT_PUBLIC_PRERENDER_LIMIT
      ? Number(process.env.NEXT_PUBLIC_PRERENDER_LIMIT)
      : 5000;

    const slicedPaths = paths.slice(0, prerenderLimit);
    await addPathsToSitemap(slicedPaths);

    return {
      paths: slicedPaths,
      fallback: "blocking",
    };
  } catch (e) {
    console.error("Articles [getStaticPaths] Error while generating paths", e);
    return { paths: [], fallback: "blocking" };
  }
}

export default ArticlePage;
