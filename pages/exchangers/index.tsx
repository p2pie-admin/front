import { GetServerSideProps } from "next";

import { IExchanger } from "../../types/exchanger";
import ExchangersList from "../../components/exchangers";

import { ISEO } from "../../types/general";
import { nullSeo } from "../../components/shared/UniversalSeo";
import { loadExchangers } from "../../cache/loadX";

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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const rawPage = Array.isArray(query.page) ? query.page[0] : query.page;
  const parsedPage = Number.parseInt(rawPage || "1", 10);
  const requestedPage = Number.isFinite(parsedPage) ? parsedPage : 1;

  const exchangers = await loadExchangers();

  if (!exchangers?.length) {
    return {
      props: {
        exchangers: null,
        initialPage: 1,
      },
    };
  }

  const itemsPerPage = 20;
  const totalPages = Math.ceil(exchangers.length / itemsPerPage);
  const currentPage =
    requestedPage > 0 ? Math.min(requestedPage, totalPages) : 1;

  if (requestedPage > totalPages && totalPages > 0) {
    const destination =
      totalPages === 1 ? "/exchangers" : `/exchangers?page=${totalPages}`;
    return {
      redirect: {
        destination,
        permanent: false,
      },
    };
  }

  const seo: ISEO = {
    title: "Обменники - список всех активных обменников",
    description: "Проверьте статусы обменников, рейтинг и описание",
    canonicalSlug:
      currentPage > 1 ? `exchangers?page=${currentPage}` : "exchangers",
  };

  return {
    props: {
      seo: seo || nullSeo,
      exchangers: exchangers || null,
      initialPage: currentPage,
    },
  };
};

export default ExchangersPage;
