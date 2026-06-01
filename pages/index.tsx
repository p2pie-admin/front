import MainPageContent from "../components/main";
import { IPopularDirRates } from "../types/rates";
import { IMainText } from "../types/pages";
import UniversalSeo, { nullSeo } from "../components/shared/UniversalSeo";
import { ISEO } from "../types/general";
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
import { maskReviewList } from "../services/maskIP";

const brandHomeTitle = (title?: string | null) => {
  if (!title) return "P2PIE - мониторинг обмена валют и криптовалют";
  return /p2pie/i.test(title)
    ? title
    : `P2PIE - ${title}`;
};

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
          popularRates,
        )[0] as IPopularDirRates[keyof IPopularDirRates])
      : null;
    const popularPmCodes = [
      ...(popularRates ? Object.keys(popularRates) : []),
      ...((firstRate?.buy ?? [])
        .map((i) => i?.fiat)
        .filter(Boolean) as string[]),
    ];

    const popularPms = pms?.filter((pm) =>
      popularPmCodes.find((code) => code === pm.code),
    );

    const seo: ISEO = {
      title: brandHomeTitle(rootText.seo_title),
      description:
        rootText.seo_description ||
        "Агрегатор обменных пунктов. Инструмент поиска лучших предложений обмена электронных, наличных и криптовалют",
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
            loading="eager"
            style={{ width: "100vw", height: "auto" }}
          />
        </Box>
        <MainPageContent {...props} />
      </Box>
    </>
  );
};

export default Home;
