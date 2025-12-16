import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import FaqPageContent from "../../components/faq";
import { loadFAQs, TTL } from "../../cache/loadX";
import { ISEO } from "../../types/general";
import { IFaqCategory } from "../../types/faq";

const buildSeo = (locale: "en" | "ru"): ISEO => {
  const brand = process.env.NEXT_PUBLIC_NAME || "p2pie";

  return {
    title:
      locale === "en"
        ? `FAQ — how ${brand} works`
        : `FAQ — ответы на вопросы о ${brand}`,
    description:
      locale === "en"
        ? `Quick answers on using ${brand}: finding best exchange rates, understanding safety, fees, payments, and resolving common issues.`
        : `Краткие ответы о ${brand}: как находить лучшие курсы обмена, безопасность сделок, комиссии, способы оплаты и решение типовых вопросов.`,
    canonicalSlug: "faq",
  };
};

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
