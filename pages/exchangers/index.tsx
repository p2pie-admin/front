import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getCachedData, loadInitialData } from "../../cache/loadInitialData";

import { IExchanger, IParserExchanger } from "../../types/exchanger";
import ExchangersList from "../../components/exchangers";

import { ISEO } from "../../types/general";
import { getT } from "../../components/shared/getT";
import { nullSeo } from "../../components/shared/UniversalSeo";
import { ICache } from "../../types/exchange";

const ExchangersPage = ({
  exchangers,
  seo,
}: {
  exchangers: (IExchanger & IParserExchanger)[] | null;
  seo: ISEO;
}) => <ExchangersList exchangers={exchangers} seo={seo} />;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const cachedData = (await getCachedData({ isHard: false })) as
    | ICache
    | undefined;

  const exchangers = cachedData?.exchangers || {};

  if (!exchangers?.length) {
    return {
      props: {
        exchangers: null,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
      revalidate: 4000,
    };
  }

  const t = await getT(locale || "ru");

  const seo = {
    title: t("exchangers-meta-title"),
    description: t("exchangers-meta-description"),
    canonicalPath: `${locale}/exchangers`,
    locale,
  };

  return {
    props: {
      seo: seo || nullSeo,
      exchangers: exchangers || null,
      ...(await serverSideTranslations(locale || "ru", ["main"])),
    },
    revalidate: 4000,
  };
};

export default ExchangersPage;
