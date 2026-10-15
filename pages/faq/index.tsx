import FaqPageContent from "../../components/faq";
import { loadFAQs, TTL } from "../../cache/loadX";
import { ISEO } from "../../types/general";
import { IFaqCategory } from "../../types/faq";
import { Locale, localeOf, tr } from "../../services/i18n";

const buildSeo = (locale: Locale = "ru"): ISEO => {
  const brand = process.env.NEXT_PUBLIC_NAME || "p2pie";

  return {
    title: tr(locale, `FAQ — ответы на вопросы о ${brand}`, `FAQ — answers to questions about ${brand}`),
    description: tr(
      locale,
      `Краткие ответы о ${brand}: как находить лучшие курсы обмена, безопасность сделок, комиссии, способы оплаты и решение типовых вопросов.`,
      `Short answers about ${brand}: how to find the best exchange rates, deal safety, fees, payment methods and common issues.`,
    ),
    canonicalSlug: "faq",
  };
};

const emptyProps = async (locale: Locale = "ru") => ({
  props: {
    categories: null,
    seo: buildSeo(locale),
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

export const getStaticProps = async (ctx?: { locale?: string }) => {
  const locale = localeOf(ctx);
  try {
    const categories = (await loadFAQs(locale)) as IFaqCategory[];

    if (!categories?.length) {
      return emptyProps(locale);
    }

    return {
      props: {
        categories: categories || null,
        seo: buildSeo(locale),
      },
      revalidate: TTL.slowest,
    };
  } catch (e) {
    console.error("[faq] getStaticProps error:", e);
    return emptyProps(locale);
  }
};

export default FaqPage;
