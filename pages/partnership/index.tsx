import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import ArticleFaqPage from "../../components/faq/ArticleFaqPage";
import { loadArticle, loadFAQbyCategoryCode, TTL } from "../../cache/loadX";
import { ISEO } from "../../types/general";
import { IFaqCategory } from "../../types/faq";
import { IArticle } from "../../types/pages";

const PAGE_CODE = "partnership";

const buildSeo = (article: IArticle | null, locale: "en" | "ru"): ISEO => ({
  title:
    article?.seo_title ||
    (locale === "en"
      ? "Partnership"
      : `Партнерство с ${process.env.NEXT_PUBLIC_NAME || ""}`),
  description:
    article?.seo_description ||
    (locale === "en"
      ? "Partnership terms, referral options and cooperation with the service."
      : "Партнерские условия, реферальная программа и варианты сотрудничества."),
  canonicalSlug: PAGE_CODE,
  updatedAt: article?.updatedAt,
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

const PartnershipPage = (props: {
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
    console.error("[partnership] getStaticProps error:", e);
    return emptyProps(locale);
  }
};

export default PartnershipPage;
