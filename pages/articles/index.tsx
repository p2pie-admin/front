import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { ISEO } from "../../types/general";
import { getT } from "../../components/shared/getT";
import { nullSeo } from "../../components/shared/UniversalSeo";
import { loadArticles, loadExchangers, TTL } from "../../cache/loadX";
import { IArticle } from "../../types/pages";
import ArticlesList from "../../components/articles";

const ArticlesPage = ({
  articles,
  seo,
}: {
  articles: IArticle[] | null;
  seo: ISEO;
}) => <ArticlesList articles={articles} seo={seo} />;

export const getStaticProps = async ({ locale }: { locale: "en" | "ru" }) => {
  const articles = (await loadArticles()) as IArticle[];

  if (!articles?.length) {
    return {
      props: {
        articles: null,
        ...(await serverSideTranslations(locale, ["main"])),
      },
      revalidate: TTL.slow, // если нет данных
    };
  }

  const t = await getT(locale);

  const seo: ISEO = {
    title: `Блог ${process.env.NEXT_PUBLIC_NAME || ""}`,
    description:
      "Список всех статей и разборов по криптовалютам, банкам и обмену",
    canonicalSlug: "articles",
  };

  return {
    props: {
      seo: seo || nullSeo,
      articles: articles || null,
      ...(await serverSideTranslations(locale, ["main"])),
    },
    revalidate: TTL.slowest,
  };
};

export default ArticlesPage;
