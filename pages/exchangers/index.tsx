import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { loadInitialData } from "../../cache/loadInitialData";

import { IExchanger, IParserExchanger } from "../../types/exchanger";
import ExchangersList from "../../components/exchangers";

export default function ExchangersPage({
  exchangers,
}: {
  exchangers: (IExchanger & IParserExchanger)[] | null;
}) {
  return <ExchangersList exchangers={exchangers} />;
}

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

  return {
    props: {
      exchangers: exchangers || null,
      ...(await serverSideTranslations(locale || "ru", ["main"])),
    },
    revalidate: 4000,
  };
};
