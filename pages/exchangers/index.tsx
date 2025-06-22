import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { loadInitialData } from "../../cache/loadInitialData";

import { IExchanger, IParserExchanger } from "../../types/exchanger";
import ExchangersList from "../../components/exchangers";
import { t } from "i18next";
import { ISEO } from "../../types/general";

const ExchangersPage = ({
  exchangers,
  seo,
}: {
  exchangers: (IExchanger & IParserExchanger)[] | null;
  seo: ISEO;
}) => <ExchangersList exchangers={exchangers} seo={seo} />;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const cachedData = await loadInitialData();
  const { exchangers } = cachedData || {};

  if (!exchangers?.length) {
    return {
      props: {
        exchangers: null,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
      revalidate: 4000,
    };
  }

  const seo = {
    title: t("exchangers-meta-title"),
    description: t("exchangers-meta-description"),
    canonicalPath: `${locale}/exchangers`,
    locale,
    isArticle: false,
  };

  return {
    props: {
      seo: seo,
      exchangers: exchangers || null,
      ...(await serverSideTranslations(locale || "ru", ["main"])),
    },
    revalidate: 4000,
  };
};

export default ExchangersPage;
