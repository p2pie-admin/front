import MainPageContent from "../components/main";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { IPopularDirRates } from "../types/rates";
import { IMainText } from "../types/pages";
import UniversalSeo, { nullSeo } from "../components/shared/UniversalSeo";
import { ISEO } from "../types/general";
import { getT } from "../components/shared/getT";
import { Box } from "@chakra-ui/react";
import Image from "next/image";
import gridPattern from "../public/grid.png";
import {
  loadMainTexts,
  loadRootText,
  loadPms,
  loadPopular,
  loadAllReviews,
  TTL,
} from "../cache/loadX";
import { IDirText } from "../types/exchange";
import { IExchangerReview } from "../types/exchanger";
import { locale } from "../services/utils";
import { maskReviewList } from "../services/maskIP";

export const getStaticProps = async () => {
  try {
    const [mainTexts, rootText, popularRatesRaw, pmsRaw, reviews] =
      await Promise.all([
        loadMainTexts(),
        loadRootText(),
        loadPopular(),
        loadPms(),
        loadAllReviews(),
      ]);

    const popularRates = (popularRatesRaw as IPopularDirRates | null) || null;
    const pms = pmsRaw || [];
    const firstRate = popularRates
      ? (Object.values(
          popularRates
        )[0] as IPopularDirRates[keyof IPopularDirRates])
      : null;
    const popularPmCodes = [
      ...(popularRates ? Object.keys(popularRates) : []),
      ...((firstRate?.buy ?? [])
        .map((i) => i?.fiat)
        .filter(Boolean) as string[]),
    ];

    const popularPms = pms?.filter((pm) =>
      popularPmCodes.find((code) => code === pm.code)
    );

    const t = await getT(locale);
    const seo: ISEO = {
      title: rootText.seo_title || t("main:meta-title"),
      description: rootText.seo_description || t("main:meta-description"),
      canonicalSlug: "",
    };

    const maskedReviews = maskReviewList(reviews as IExchangerReview[]) || [];

    return {
      props: {
        seo: seo || nullSeo,
        popularPms: popularPms || null,
        popularRates: popularRates || null,
        mainTexts: (mainTexts || []) as IMainText[],
        rootText: (rootText || null) as IDirText | null,
        reviews: maskedReviews as IExchangerReview[],
        locale,
        ...(await serverSideTranslations(locale, ["main"])),
      },
      revalidate: TTL.slow,
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
        reviews: null,
        locale,
        ...(await serverSideTranslations(locale, ["main"])),
      },
      revalidate: TTL.slow,
    };
  }
};

const Home = (props: any) => {
  return (
    <>
      <UniversalSeo seo={props.seo} />
      <Box position="relative" w="100%">
        <Box
          position="absolute"
          top="1%"
          left="50%"
          transform="translateX(-50%)"
          w="100vw"
          filter={{ base: "opacity(0.5)", lg: "opacity(0.3)" }}
          zIndex={0}
          pointerEvents="none"
        >
          <Image
            src={gridPattern}
            alt="Grid background pattern"
            width={2000}
            height={420}
            priority
            style={{ width: "100vw", height: "auto" }}
          />
        </Box>
        <MainPageContent {...props} />
      </Box>
    </>
  );
};

export default Home;
