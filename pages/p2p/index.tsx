import { GetStaticProps } from "next";

import MakersList from "../../components/p2p/makers";
import { ISEO } from "../../types/general";
import { nullSeo } from "../../components/shared/UniversalSeo";
import { loadAllP2PMakers, loadPms } from "../../cache/loadX";
import { filterAllowedOffers } from "../../services/p2pSanctions";
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

export const getStaticProps: GetStaticProps = async () => {
  const itemsPerPage = 20;

  const [rawMakers, pms] = await Promise.all([loadAllP2PMakers(), loadPms()]);
  const makers = ((rawMakers as IMakerPreview[] | null) || null)?.map((maker) => ({
    ...maker,
    offers: Array.isArray(maker.offers) ? filterAllowedOffers(maker.offers, pms) : maker.offers,
  })) as IMakerPreview[] | null;

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
  const currentPage = 1;

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
    revalidate: 60,
  };
};

export default MakersPage;
