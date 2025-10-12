import MainPageContent from "../components/main";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { IPopularDirRates } from "../types/rates";
import { IMainText } from "../types/pages";
import UniversalSeo, { nullSeo } from "../components/shared/UniversalSeo";
import { ISEO } from "../types/general";
import { getT } from "../components/shared/getT";
import {
  loadMainTexts,
  loadRootText,
  loadPms,
  loadPopular,
} from "../cache/loadX";
import { IDirText } from "../types/exchange";

// take locale from env
const locale = (process.env.NEXT_PUBLIC_SITE_LANG || "ru") as "ru" | "en";

export const getStaticProps = async () => {
  try {
    const [mainTexts, rootText, popularRatesRaw, pmsRaw] = await Promise.all([
      loadMainTexts(),
      loadRootText(),
      loadPopular(),
      loadPms(),
    ]);

    const popularRates = popularRatesRaw as IPopularDirRates;
    const pms = pmsRaw || [];
    const firstRate = Object.values(popularRates)[0];
    const popularPmCodes = [
      ...Object.keys(popularRates ?? {}),
      ...(firstRate?.buy?.map((i) => i.fiat) ?? []),
    ];

    const popularPms = pms?.filter((pm) =>
      popularPmCodes.find((code) => code === pm.code)
    );

    const t = await getT(locale);
    const seo: ISEO = {
      title: rootText.seo_title || t("main:meta-title"),
      description: rootText.seo_description || t("main:meta-description"),
      canonicalSlug: "/",
    };

    return {
      props: {
        seo: seo || nullSeo,
        popularPms: popularPms || null,
        popularRates: popularRates || null,
        mainTexts: (mainTexts || []) as IMainText[],
        rootText: (rootText || null) as IDirText | null,
        locale,
        ...(await serverSideTranslations(locale, ["main"])),
      },
      revalidate: 3000,
    };
  } catch (e) {
    console.error("Error during getStaticProps:", e);

    return {
      props: {
        seo: nullSeo,
        popularPms: null,
        popularRates: null,
        mainTexts: null,
        rootText: null,
        locale,
        ...(await serverSideTranslations(locale, ["main"])),
      },
      revalidate: 3000,
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
