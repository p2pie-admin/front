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
    const pms = cachedData.pms;

    const popularPmCodes = [
      ...Object.keys(popularRates),
      ...Object.values(popularRates)[0].buy.map((i) => i.fiat),
    ];
    const popularPms = pms.filter((pm) =>
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
    return {
      notFound: true,
    };
  }
};

// const router = useRouter();
// console.log(router.query);
// const { dir, pm_groups } = router.query;

// if (typeof dir === "string" && typeof pm_groups === "string") {
//   console.log("main triggered");
//   batch(() => {
//     dispatch(restorePmsFromSlug({ dir, pm_groups }));
//     dispatch(fetchDirRates({ dir }));
//   });
// }

const Home = (props: any) => {
  return <MainPageContent {...props} />;
};

export default Home;
