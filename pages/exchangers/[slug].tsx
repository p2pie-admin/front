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

import { IExchanger, IParserExchanger } from "../../types/exchanger";
import { ISEO } from "../../types/general";
import { IPm } from "../../types/selector";
import {
  loadArticleCodes,
  loadExchanger,
  loadExchangers,
  loadPms,
  TTL,
} from "../../cache/loadX";

export default function ExchangerPage({
  exchanger,
  seo,
  articleCodes,
  pms,
  time,
}: {
  exchanger: (IExchanger & IParserExchanger) | null;
  seo: ISEO;
  articleCodes: string[];
  pms: IPm[];
  time: string;
}) {
  // Handle non-existent exchanger
  if (!exchanger) {
    console.log("exchanger", exchanger);
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

  return (
    <Exchanger
      exchanger={exchanger}
      seo={seo}
      articleCodes={articleCodes}
      pms={pms}
      time={time}
    />
  );
}

// Optimized getStaticProps with Redis caching
export async function getStaticProps({
  locale,
  params,
}: {
  locale: "en" | "ru";
  params: { slug: string };
}) {
  try {
    const { slug } = params;
    const name = exchangerSlugToName(slug);

    const [exchanger, articleCodes, pms] = await Promise.all([
      loadExchanger(name),
      loadArticleCodes(),
      loadPms(),
    ]);

    if (!exchanger) {
      console.log(`❌ Exchanger not found: ${name}`);
      return { notFound: true };
    }

    // Add cross-linking if we have all the data
    const enrichedExchanger = await addExchangerCrossLinking(
      exchanger,
      articleCodes as string[],
      pms as IPm[],
      locale
    );

    const title = `${locale === "en" ? "Exchanger" : "Обменник"} ${capitalize(
      exchanger.name
    )}`;

    const description = `${capitalize(exchanger.name)}: ${
      locale === "en"
        ? "Exchanger card, rating and info"
        : "Карточка обменника, рейтинг и информация"
    }`;

    const seo = {
      title,
      description,
      canonicalPath: `${locale}/exchangers/${slug}`,
      updatedAt: exchanger.updatedAt || new Date().toISOString(),
      locale,
      alternateLangs: [
        {
          rel: "alternate",
          hrefLang: "en",
          href: `https://p2pie.com/en/exchangers/${slug}`,
        },
        {
          rel: "alternate",
          hrefLang: "ru",
          href: `https://p2pie.com/ru/exchangers/${slug}`,
        },
      ],
    };

    // Emergency fallback to prevent 500 errors
    return {
      props: {
        exchanger: enrichedExchanger || exchanger,
        seo,
        locale,
        error: true,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
      revalidate: TTL.exchangers,
    };
  } catch (error) {
    console.error("🚨 getStaticProps error:", error);

    // Return minimal data to avoid 500 errors
    return {
      props: {
        exchanger: null,
        articleCodes: [],
        pms: [],
        seo: nullSeo,
        locale,
        error: true,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
      revalidate: 60, // Quick retry on error
    };
  }
}

// Optimized getStaticPaths with Redis caching
export async function getStaticPaths() {
  try {
    const exchangers = await loadExchangers();
    if (!exchangers || exchangers.length === 0) {
      console.warn("⚠️ No exchangers found, returning empty paths");
      return {
        paths: [],
        fallback: "blocking",
      };
    }

    const locales = ["en", "ru"];

    // Generate all possible paths
    const allPaths = exchangers.reduce(
      (
        res: {
          params: { slug: string };
          locale: string;
        }[],
        exchanger: IExchanger
      ) => [
        ...res,
        ...locales.map((locale) => ({
          params: { slug: exchangerNameToSlug(exchanger.name) },
          locale,
        })),
      ],
      []
    );

    // Limit pre-rendered paths for testing
    const prerenderLimit = process.env.NEXT_PUBLIC_PRERENDER_LIMIT
      ? Number(process.env.NEXT_PUBLIC_PRERENDER_LIMIT)
      : 5000;

    const paths = allPaths.slice(0, prerenderLimit);
    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    return {
      paths: [],
      fallback: "blocking",
    };
  }
}
