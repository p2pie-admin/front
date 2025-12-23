import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { IExchanger, IParserExchanger } from "../../types/exchanger";
import ExchangersList from "../../components/exchangers";

import { ISEO } from "../../types/general";
import { getT } from "../../components/shared/getT";
import { nullSeo } from "../../components/shared/UniversalSeo";
import { loadExchangers, TTL } from "../../cache/loadX";

const ExchangersPage = ({
  exchangers,
  seo,
}: {
  exchangers: IExchanger[] | null;
  seo: ISEO;
}) => <ExchangersList exchangers={exchangers} seo={seo} />;

export const getStaticProps = async ({ locale }: { locale: "en" | "ru" }) => {
  const exchangers = await loadExchangers();

  if (!exchangers?.length) {
    return {
      props: {
        exchangers: null,
        ...(await serverSideTranslations(locale, ["main"])),
      },
      revalidate: TTL.slow, // если нет данных
    };
  }

  const t = await getT(locale);

  const seo: ISEO = {
    title: t("exchangers-meta-title"),
    description: t("exchangers-meta-description"),
    canonicalSlug: "exchangers", // ✅ plain path, no leading slash, no locale
  };

  return {
    props: {
      seo: seo || nullSeo,
      exchangers: exchangers || null,
      ...(await serverSideTranslations(locale, ["main"])),
    },
    revalidate: TTL.slow,
  };
};

export default ExchangersPage;
