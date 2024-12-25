import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import { Box, Text } from "@chakra-ui/react";
import MainPageContent from "../components/main";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { IPopularDirRates } from "../types/rates";
import { initCMSFetcher, initParserFetcher } from "../services/fetchers";
import { readCache } from "../cache";
import { ICache } from "../types/exchange";

import { MainTextsQuery, RootTextQuery } from "../services/initialQueries";
import { IMainText, ITextBox } from "../types/pages";
import { NextSeo, BreadcrumbJsonLd } from "next-seo";
import article from "next-seo/lib/jsonld/article";
import { useTranslation } from "react-i18next";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // must be async
  try {
    const circleTextsFetcher = initCMSFetcher({ locale });
    const { mainTexts } = (await circleTextsFetcher(MainTextsQuery)) as {
      mainTexts: IMainText[];
    };
    const rootTextFetcher = initCMSFetcher({ locale, key: "root" });
    const { textBoxes } = (await rootTextFetcher(RootTextQuery)) as {
      textBoxes: ITextBox[];
    };
    const rootText = textBoxes[0] || null;
    const possiblePairsFetcher = initParserFetcher();
    const popularRates = (await possiblePairsFetcher(
      "top"
    )) as IPopularDirRates;
    const cachedData = readCache() as ICache;
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
        rootText,
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
};

const Home = (props: any) => {
  const { t } = useTranslation();
  return (
    <>
      <NextSeo
        title={t("main:meta-title")}
        description={t("main:meta-description")}
        canonical={`https://p2pie.com`}
        additionalLinkTags={[
          {
            rel: "alternate",
            href: `https://p2pie.com/en`,
            hrefLang: "en",
          },
          {
            rel: "alternate",
            href: `https://p2pie.com/ru`,
            hrefLang: "ru",
          },
        ]}
        openGraph={{
          type: "website", // Use "website" for the homepage instead of "article".
          url: "https://p2pie.com",
          site_name: "p2pie",
          title: t("main:meta-title"),
          description: t("main:meta-description"),
        }}
      />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: "Home",
            item: `https://p2pie.com`,
          },
        ]}
      />
      <MainPageContent {...props} />
    </>
  );
};

export default Home;
