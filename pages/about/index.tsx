import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import ArticleFaqPage from "../../components/faq/ArticleFaqPage";
import { loadArticle, loadFAQbyCategoryCode, TTL } from "../../cache/loadX";
import { ISEO } from "../../types/general";
import { IFaqCategory } from "../../types/faq";
import { IArticle } from "../../types/pages";

const PAGE_CODE = "about";

const buildSeo = (article: IArticle | null, locale: "en" | "ru"): ISEO => ({
  title:
    article?.seo_title ||
    (locale === "en"
      ? `About ${process.env.NEXT_PUBLIC_NAME || ""}`
      : `О проекте ${process.env.NEXT_PUBLIC_NAME || ""}`),
  description:
    article?.seo_description ||
    (locale === "en"
      ? `Learn about ${
          process.env.NEXT_PUBLIC_NAME || ""
        }, mission, team and how the service works.`
      : `Подробнее о ${
          process.env.NEXT_PUBLIC_NAME || ""
        }, нашей миссии, команде и принципах работы сервиса.`),
  canonicalSlug: PAGE_CODE,
  updatedAt: article?.updatedAt ?? null,
});

const emptyProps = async (locale: "en" | "ru") => ({
  props: {
    article: null,
    faqCategory: null,
    seo: buildSeo(null, locale),
    ...(await serverSideTranslations(locale, ["main"])),
  },
  revalidate: TTL.slowest,
});

const AboutPage = (props: {
  article: IArticle | null;
  faqCategory: IFaqCategory | null;
  seo: ISEO;
}) => <ArticleFaqPage {...props} />;

export const getStaticProps = async ({ locale }: { locale: "en" | "ru" }) => {
  try {
    const [article, faqCategory] = await Promise.all([
      loadArticle(PAGE_CODE),
      loadFAQbyCategoryCode(PAGE_CODE),
    ]);

    return {
      props: {
        article: article || null,
        faqCategory: faqCategory || null,
        seo: buildSeo(article, locale),
        ...(await serverSideTranslations(locale, ["main"])),
      },
      revalidate: TTL.slowest,
    };
  } catch (e) {
    console.error("[about] getStaticProps error:", e);
    return emptyProps(locale);
  }
};

export default AboutPage;
