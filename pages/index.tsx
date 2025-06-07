import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import { Box, Text } from "@chakra-ui/react";
import MainPageContent from "../components/main";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { IPopularDirRates } from "../types/rates";
import { initCMSFetcher, initParserFetcher } from "../services/fetchers";
import { readCache } from "../cache";
import { ICache } from "../types/exchange";

import { MainTextsQuery, TextBoxQuery } from "../services/initialQueries";
import { IMainText, ITextBox } from "../types/pages";
import { NextSeo, BreadcrumbJsonLd } from "next-seo";
import { useTranslation } from "react-i18next";
import { loadInitialData } from "../cache/loadInitialData";
import UniversalSeo from "../components/shared/UniversalSeo";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // must be async
  try {
    const circleTextsFetcher = initCMSFetcher({ locale });

    const rootTextFetcher = initCMSFetcher({ locale, key: "root" });
    const res1 = (await rootTextFetcher(TextBoxQuery)) as {
      textBoxes: ITextBox[];
    };
    const textBoxes = res1?.textBoxes;

    const res2 = (await circleTextsFetcher(MainTextsQuery)) as {
      mainTexts: IMainText[];
    };
    const mainTexts = res2?.mainTexts;

    const rootText = textBoxes[0] || null;
    const parserFetcher = initParserFetcher();
    const popularRates = (await parserFetcher("top")) as IPopularDirRates;

    const cachedData = (await loadInitialData()) as ICache | undefined;
    const pms = cachedData?.pms;

    const popularPmCodes = [
      ...Object.keys(popularRates),
      ...Object.values(popularRates)[0]?.buy.map((i) => i.fiat),
    ];
    const popularPms = pms?.filter((pm) =>
      popularPmCodes.find((code) => code === pm.code)
    );

    return {
      props: {
        popularPms: popularPms || null,
        popularRates: popularRates || null,
        mainTexts: mainTexts || null,
        rootText: rootText || null,
        locale,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
      revalidate: 3000, // Revalidate every 3000 seconds (50 minutes)
    };
  } catch (e) {
    console.error("Error during getStaticProps:", e);

    return {
      props: {
        popularPms: null,
        popularRates: null,
        mainTexts: null,
        rootText: null,
        locale,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
      revalidate: 300, // try again in 5 minutes or whatever fits
    };
  }
};

const Home = (props: any) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as "en" | "ru"; // Default to 'ru' if no language is set
  return (
    <>
      <UniversalSeo
        title={t("main:meta-title")}
        description={t("main:meta-description")}
        canonicalPath={`${locale}`}
        locale={locale}
        isArticle={false}
      />
      <MainPageContent {...props} />
    </>
  );
};

export default Home;
