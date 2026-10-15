import { ISEO } from "../../types/general";
import { nullSeo } from "../../components/shared/UniversalSeo";
import { loadBlog, TTL } from "../../cache/loadX";
import { IArticle } from "../../types/pages";
import ArticlesList from "../../components/articles";
import { localeOf, tr } from "../../services/i18n";

const ArticlesPage = ({
  articles,
  seo,
}: {
  articles: IArticle[] | null;
  seo: ISEO;
}) => <ArticlesList articles={articles} seo={seo} />;

export const getStaticProps = async (ctx?: { locale?: string }) => {
  const locale = localeOf(ctx);
  const articles = (await loadBlog()) as IArticle[];

  if (!articles?.length) {
    return {
      props: {
        seo: nullSeo,
        articles: null,
      },
      revalidate: TTL.slow, // если нет данных
    };
  }

  const seo: ISEO = {
    title: tr(locale, `Блог ${process.env.NEXT_PUBLIC_NAME || ""}`, `${process.env.NEXT_PUBLIC_NAME || ""} blog`),
    description: tr(
      locale,
      "Список всех статей и разборов по криптовалютам, банкам и обмену",
      "All articles and guides on crypto, banks and exchange (in Russian)",
    ),
    canonicalSlug: "articles",
  };

  return {
    props: {
      seo: seo || nullSeo,
      articles: articles || null,
    },
    revalidate: TTL.slowest,
  };
};

export default ArticlesPage;
