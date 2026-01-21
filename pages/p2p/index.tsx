import { GetServerSideProps } from "next";

import MakersList from "../../components/p2p/makers";
import { ISEO } from "../../types/general";
import { nullSeo } from "../../components/shared/UniversalSeo";
import { loadAllP2PMakers } from "../../cache/loadX";
import { IMakerPreview } from "../../types/p2p";

const MakersPage = ({
  makers,
  seo,
  initialPage,
}: {
  makers: IMakerPreview[] | null;
  seo: ISEO;
  initialPage: number;
}) => <MakersList makers={makers} seo={seo} initialPage={initialPage} />;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const itemsPerPage = 20;

  const rawPage = Array.isArray(query.page) ? query.page[0] : query.page;
  const parsedPage = Number.parseInt(rawPage || "1", 10);
  const requestedPage = Number.isFinite(parsedPage) ? parsedPage : 1;

  const makers = (await loadAllP2PMakers()) as IMakerPreview[] | null;

  if (!makers?.length) {
    return {
      props: {
        makers: null,
        seo: nullSeo,
        initialPage: 1,
      },
    };
  }

  const totalPages = Math.ceil(makers.length / itemsPerPage);
  const currentPage =
    requestedPage > 0 ? Math.min(requestedPage, totalPages) : 1;

  if (requestedPage > totalPages && totalPages > 0) {
    const destination =
      totalPages === 1 ? "/p2p/makers" : `/p2p/makers?page=${totalPages}`;
    return {
      redirect: {
        destination,
        permanent: false,
      },
    };
  }

  const seo: ISEO = {
    title: "P2P мейкеры - список активных мейкеров",
    description: "Проверьте статусы, предложения и отзывы P2P мейкеров",
    canonicalSlug:
      currentPage > 1 ? `p2p/makers?page=${currentPage}` : "p2p/makers",
  };

  return {
    props: {
      seo: seo || nullSeo,
      makers: makers || null,
      initialPage: currentPage,
    },
  };
};

export default MakersPage;
