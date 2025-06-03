import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { IExchanger, IParserExchanger } from "../../types/exchanger";
import { ResponsiveText } from "../../styles/theme/custom";
import {
  addExchangerCrossLinking,
  exchangerNameToSlug,
} from "../../components/exchangers/helper";
import Exchanger from "../../components/exchangers/exchanger";
import { loadInitialData } from "../../cache/loadInitialData";

export default function ExchangerPage({
  exchanger,
}: {
  exchanger: (IExchanger & IParserExchanger) | null;
}) {
  // Handle non-existent exchanger
  if (!exchanger) {
    return <ResponsiveText>Exchanger not found</ResponsiveText>;
  }
  //mylog(exchanger);

  return <Exchanger exchanger={exchanger} />;
}

// Pass exchanger data to the page
export async function getStaticProps({
  locale,
  params,
}: {
  locale: "en" | "ru";
  params: { name: string };
}) {
  try {
    const { name } = params;

    const cachedData = await loadInitialData();
    if (!cachedData || !cachedData.exchangers) {
      return {
        notFound: true,
      };
    }

    const rawExchanger =
      cachedData.exchangers.find(
        (e) => exchangerNameToSlug(e.name) === name.toLowerCase()
      ) || null;

    if (!rawExchanger) {
      return {
        notFound: true,
      };
    }

    const articles = cachedData[`${locale}Data`]?.articles || [];
    const pms = cachedData.pms;

    const enrichedExchanger = await addExchangerCrossLinking(
      rawExchanger,
      articles,
      pms,
      locale
    );

    // Fallback: If description or other enriched data is missing, return minimal data
    const exchanger = enrichedExchanger || rawExchanger;

    return {
      props: {
        exchanger,
        locale,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
}

// Generate paths for each exchanger
export async function getStaticPaths() {
  const cachedData = await loadInitialData();
  const { exchangers } = cachedData || {};

  if (!exchangers || exchangers.length === 0) {
    return {
      paths: [],
      fallback: false,
    };
  }

  const locales = ["en", "ru"];

  const paths = exchangers.reduce(
    (
      res: {
        params: { name: string };
        locale: string;
      }[],
      exchanger: IExchanger
    ) => [
      ...res,
      ...locales.map((locale) => ({
        params: { name: exchangerNameToSlug(exchanger.name) },
        locale,
      })),
    ],
    []
  );
  return { paths, fallback: false };
}
