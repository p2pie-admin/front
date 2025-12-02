import { Center, Spinner } from "@chakra-ui/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Exchanger from "../../components/exchangers/exchanger";
import {
  exchangerSlugToName,
  addExchangerCrossLinking,
  exchangerNameToSlug,
} from "../../components/exchangers/helper";
import { capitalize } from "../../components/main/side/selector/section/PmGroup/helper";
import { nullSeo } from "../../components/shared/UniversalSeo";

import {
  IExchanger,
  IExchangerPreview,
  IParserExchanger,
  IExchangerReview,
} from "../../types/exchanger";
import { ISEO } from "../../types/general";
import { IPm } from "../../types/selector";
import {
  loadArticleCodes,
  loadExchanger,
  loadExchangers,
  loadPms,
  TTL,
} from "../../cache/loadX";
import { addHeadersToSearchIndex, addPathsToSitemap } from "../../cache/cache";

export const maskIP = (ip?: string | null): string | null | undefined => {
  if (ip == null) return ip;
  const chars = ip.split("");
  let replaced = 0;
  for (let i = chars.length - 1; i >= 0 && replaced < 3; i--) {
    if (/\d/.test(chars[i])) {
      chars[i] = "*";
      replaced++;
    }
  }
  return chars.join("");
};

const maskExchangerReviewIPs = <
  T extends { reviews?: IExchangerReview[] | null }
>(
  exchanger: T | null
): T | null => {
  if (!exchanger || !Array.isArray(exchanger.reviews)) return exchanger;
  return {
    ...exchanger,
    reviews: exchanger.reviews.map((review) =>
      review ? { ...review, ipAddress: maskIP(review.ipAddress) } : review
    ),
  } as T;
};

export default function ExchangerPage({
  exchanger,
  seo,
}: {
  exchanger: IExchanger | null;
  seo: ISEO;
}) {
  if (!exchanger) {
    return (
      <Center
        w="100%"
        h="100%"
        justifyContent="center"
        alignItems="center"
        minW="100"
        minH="100"
      >
        <Spinner size="xl" color="bg.500" />
      </Center>
    );
  }

  return <Exchanger exchanger={exchanger} seo={seo} />;
}

const locale = (process.env.NEXT_PUBLIC_SITE_LANG || "ru") as "en" | "ru";

// Single-locale getStaticProps
export async function getStaticProps({ params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const name = exchangerSlugToName(slug);

    const [exchanger, articleCodes, pms] = await Promise.all([
      loadExchanger(slug),
      loadArticleCodes(),
      loadPms(),
    ]);

    if (!exchanger) {
      console.log(`❌ Exchanger failed to load: ${name}`);
      return { notFound: true };
    }

    const enrichedExchanger = await addExchangerCrossLinking(
      exchanger,
      articleCodes as string[],
      pms as IPm[],
      locale
    );

    const displayName = exchanger.display_name || exchanger.name;
    const title = `${locale === "en" ? "Exchanger" : "Обменник"} ${capitalize(
      displayName
    )}`;

    const description = `${capitalize(displayName)}: ${
      locale === "en"
        ? "Exchanger card, rating and info"
        : "Карточка обменника, рейтинг и информация"
    }`;

    const seo: ISEO = {
      title,
      description,
      canonicalSlug: `exchangers/${slug}`,
      updatedAt: exchanger.updatedAt || new Date().toISOString(),
    };

    await addHeadersToSearchIndex({
      slug: `exchangers/${slug}`,
      header: `Обменник ${capitalize(displayName)}`,
      wordsToSearchFrom: displayName,
    });

    const exchangerWithMaskedIp = maskExchangerReviewIPs(
      enrichedExchanger || exchanger
    );

    return {
      props: {
        exchanger: exchangerWithMaskedIp,
        seo,
        locale,
        ...(await serverSideTranslations(locale, ["main"])),
      },
      revalidate: TTL.fast,
    };
  } catch (error) {
    console.error("🚨 getStaticProps error:", error);

    return {
      props: {
        exchanger: null,
        seo: nullSeo,
        locale,
        ...(await serverSideTranslations(locale, ["main"])),
      },
      revalidate: 500,
    };
  }
}

// Single-locale getStaticPaths
export async function getStaticPaths() {
  try {
    const exchangers = (await loadExchangers()) as IExchangerPreview[];
    if (!exchangers || !Array.isArray(exchangers)) {
      console.warn("⚠️ No exchangers found, returning empty paths");
      return {
        paths: [],
        fallback: false,
      };
    }

    const paths = exchangers.map((exchanger) => ({
      params: { slug: exchangerNameToSlug(exchanger.name) },
    }));

    const prerenderLimit = process.env.NEXT_PUBLIC_PRERENDER_LIMIT
      ? Number(process.env.NEXT_PUBLIC_PRERENDER_LIMIT)
      : 5000;

    const slicedPaths = paths.slice(0, prerenderLimit);
    await addPathsToSitemap(paths, { basePath: "exchangers" });

    return {
      paths: slicedPaths,
      fallback: "blocking",
    };
  } catch (error) {
    return {
      paths: [],
      fallback: "blocking",
    };
  }
}
