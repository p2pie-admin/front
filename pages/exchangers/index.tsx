import { GetStaticProps } from "next";

import { IExchanger } from "../../types/exchanger";
import ExchangersList from "../../components/exchangers";

import { ISEO } from "../../types/general";
import { nullSeo } from "../../components/shared/UniversalSeo";
import { loadExchangers } from "../../cache/loadX";
import { localeOf, tr } from "../../services/i18n";

const ExchangersPage = ({
  exchangers,
  seo,
  initialPage,
}: {
  exchangers: IExchanger[] | null;
  seo: ISEO;
  initialPage: number;
}) => (
  <ExchangersList
    exchangers={exchangers}
    seo={seo}
    initialPage={initialPage}
  />
);

export const getStaticProps: GetStaticProps = async (ctx) => {
  const locale = localeOf(ctx);
  const exchangers = await loadExchangers();

  if (!exchangers?.length) {
    return {
      props: {
        exchangers: null,
        initialPage: 1,
      },
      // Retry soon: an empty list here means the CMS fetch failed (e.g. at build time),
      // without revalidate the "no exchangers" page would be baked in permanently.
      revalidate: 60,
    };
  }

  const itemsPerPage = 20;
  const totalPages = Math.ceil(exchangers.length / itemsPerPage);
  const currentPage = 1;

  const seo: ISEO = {
    title: tr(locale, "Обменники - список всех активных обменников", "Exchangers - list of all active exchangers"),
    description: tr(locale, "Проверьте статусы обменников, рейтинг и описание", "Check exchanger statuses, ratings and descriptions"),
    canonicalSlug:
      currentPage > 1 ? `exchangers?page=${currentPage}` : "exchangers",
  };

  return {
    props: {
      seo: seo || nullSeo,
      exchangers: exchangers || null,
      initialPage: currentPage,
    },
    revalidate: 60,
  };
};

export default ExchangersPage;
