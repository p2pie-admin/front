import ArticleFaqPage from "../../components/faq/ArticleFaqPage";
import { loadArticle, loadFAQbyCategoryCode, TTL } from "../../cache/loadX";
import { ISEO } from "../../types/general";
import { IFaqCategory } from "../../types/faq";
import { IArticle } from "../../types/pages";
import { Locale, localeOf } from "../../services/i18n";

const PAGE_CODE = "about";

const buildSeo = (article: IArticle | null, locale: Locale = "ru"): ISEO => {
  const brand = process.env.NEXT_PUBLIC_NAME || "p2pie";

  // The article is Russian-only CMS content: English pages get fixed English SEO.
  if (locale === "en") {
    return {
      title: `About ${brand} — mission, values, team`,
      description: `${brand} helps compare crypto, cash and bank exchange offers worldwide. Learn who we are, why we built the service and how we keep rates transparent.`,
      canonicalSlug: PAGE_CODE,
      updatedAt: article?.updatedAt ?? null,
    };
  }

  return {
    title:
      article?.seo_title ||
      `О проекте ${brand} — миссия, ценности, команда`,
    description:
      article?.seo_description ||
      `${brand} помогает сравнивать обменные предложения криптовалют, наличных и банков по всему миру. Узнайте, кто мы, зачем создали сервис и как обеспечиваем прозрачность курсов.`,
    canonicalSlug: PAGE_CODE,
    updatedAt: article?.updatedAt ?? null,
  };
};

const emptyProps = async (locale: Locale = "ru") => ({
  props: {
    article: null,
    faqCategory: null,
    seo: buildSeo(null, locale),
  },
  revalidate: TTL.slowest,
});

const AboutPage = (props: {
  article: IArticle | null;
  faqCategory: IFaqCategory | null;
  seo: ISEO;
}) => <ArticleFaqPage {...props} />;

export const getStaticProps = async (ctx?: { locale?: string }) => {
  const locale = localeOf(ctx);
  try {
    const [article, faqCategory] = await Promise.all([
      loadArticle(PAGE_CODE),
      loadFAQbyCategoryCode(PAGE_CODE, locale),
    ]);

    return {
      props: {
        article: article || null,
        faqCategory: faqCategory || null,
        seo: buildSeo(article, locale),
      },
      revalidate: TTL.slowest,
    };
  } catch (e) {
    console.error("[about] getStaticProps error:", e);
    return emptyProps(locale);
  }
};

export default AboutPage;
