import type { GetStaticProps } from "next";
import MainPageContent from "../components/main";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { IPopularDirRates } from "../types/rates";
import { initParserFetcher } from "../services/fetchers";

import { ICache } from "../types/exchange";

import { MainTextsQuery, TextBoxQuery } from "../services/initialQueries";
import { IMainText, ITextBox } from "../types/pages";
import UniversalSeo, { nullSeo } from "../components/shared/UniversalSeo";

import { ISEO } from "../types/general";
import { getT } from "../components/shared/getT";
import { loadMainTexts, loadPms, loadRootText } from "../cache/loadInitialData";

export const getStaticProps = async ({ locale }: { locale: "en" | "ru" }) => {
  // must be async

  try {
    const parserFetcher = initParserFetcher();

    const [mainTexts, rootText, popularRatesRaw, pmsRaw] = await Promise.all([
      loadMainTexts(locale),
      loadRootText(locale),
      parserFetcher("top"),
      loadPms(),
    ]);

    const popularRates = popularRatesRaw as IPopularDirRates;
    const pms = pmsRaw || [];
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
