import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import FaqPageContent from "../../components/faq";
import { loadFAQs, TTL } from "../../cache/loadX";
import { ISEO } from "../../types/general";
import { IFaqCategory } from "../../types/faq";

const buildSeo = (locale: "en" | "ru"): ISEO => ({
  title: locale === "en" ? "FAQ" : "FAQ / Вопросы и ответы",
  description:
    locale === "en"
      ? "Answers to the most frequent questions about exchanges and P2P deals."
      : "Ответы на популярные вопросы о сервисе, обменах и P2P-сделках.",
  canonicalSlug: "faq",
});

const emptyProps = async (locale: "en" | "ru") => ({
  props: {
    categories: null,
    seo: buildSeo(locale),
    ...(await serverSideTranslations(locale, ["main"])),
  },
  revalidate: TTL.slow,
});

const FaqPage = ({
  categories,
  seo,
}: {
  categories: IFaqCategory[] | null;
  seo: ISEO;
}) => <FaqPageContent categories={categories} seo={seo} />;

export const getStaticProps = async ({ locale }: { locale: "en" | "ru" }) => {
  try {
    const categories = (await loadFAQs()) as IFaqCategory[];

    if (!categories?.length) {
      return emptyProps(locale);
    }

    return {
      props: {
        categories: categories || null,
        seo: buildSeo(locale),
        ...(await serverSideTranslations(locale, ["main"])),
      },
      revalidate: TTL.slowest,
    };
  } catch (e) {
    console.error("[faq] getStaticProps error:", e);
    return emptyProps(locale);
  }
};

export default FaqPage;
