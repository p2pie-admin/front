import type { GetStaticProps } from "next";
import MainPageContent from "../components/main";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { IPopularDirRates } from "../types/rates";
import { initCMSFetcher, initParserFetcher } from "../services/fetchers";

import { ICache } from "../types/exchange";

import { MainTextsQuery, TextBoxQuery } from "../services/initialQueries";
import { IMainText, ITextBox } from "../types/pages";

import { loadInitialData } from "../cache/loadInitialData";
import UniversalSeo, { nullSeo } from "../components/shared/UniversalSeo";

import { ISEO } from "../types/general";
import { getT } from "../components/shared/getT";

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

    const t = await getT(locale || "ru");
    const seo = {
      title: t("main:meta-title"),
      description: t("main:meta-description"),
      canonicalPath: `${locale}`,
      locale: locale,
    } as ISEO;

    return {
      props: {
        seo: seo || nullSeo,
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
      // возвращаем пустые данные чтобы сработал ревалидейт
      props: {
        seo: nullSeo,
        popularPms: null,
        popularRates: null,
        mainTexts: null,
        rootText: null,
        locale,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
      revalidate: 3000, // try again in 3000 seconds (50 minutes)
    };
  }
};

const Home = (props: any) => {
  return (
    <>
      <UniversalSeo seo={props.seo} />
      <MainPageContent {...props} />
    </>
  );
};

export default Home;
