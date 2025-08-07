import { Center, Spinner } from "@chakra-ui/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  invalidateCache,
  safeFetchBatch,
  safeFetchRedis,
} from "../../cache/cache";

import Exchanger from "../../components/exchangers/exchanger";
import {
  exchangerSlugToName,
  addExchangerCrossLinking,
  exchangerNameToSlug,
} from "../../components/exchangers/helper";
import { capitalize } from "../../components/main/side/selector/section/PmGroup/helper";
import { nullSeo } from "../../components/shared/UniversalSeo";
import {
  loadExchanger,
  loadArticleCodes,
  loadPms,
  loadExchangers,
} from "../../next-sitemap.config";
import { IExchanger, IParserExchanger } from "../../types/exchanger";
import { ISEO } from "../../types/general";
import { IPm } from "../../types/selector";

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
  const startTime = performance.now();
  const logTiming = (step: string) => {
    const elapsed = performance.now() - startTime;
    console.log(`⏱️ [${step}] ${elapsed.toFixed(2)}ms elapsed`);

    // Alert if getting close to timeout (25s warning for 30s limit)
    if (elapsed > 25000) {
      console.error(`🚨 TIMEOUT RISK: ${step} took ${elapsed.toFixed(2)}ms`);
    }
  };

  try {
    const { slug } = params;
    const name = exchangerSlugToName(slug);

    logTiming("START");
    console.log(`🚀 Processing exchanger: ${name} (${slug})`);

    // Check if this is a pre-rendered path or fallback
    const isPrerendered = process.env.NEXT_PUBLIC_PRERENDER_LIMIT
      ? parseInt(process.env.NEXT_PUBLIC_PRERENDER_LIMIT) > 5
      : false;

    if (isPrerendered) {
      // Full data for pre-rendered paths
      console.log(`📦 Full data fetch for pre-rendered path: ${slug}`);

      const [cmsExchanger, articleCodes, pms] = await safeFetchBatch([
        {
          key: `exchanger_${name}`,
          fetcher: () => loadExchanger(name),
          ttl: 3600, // 1 hour
        },
        {
          key: "article_codes",
          fetcher: () => loadArticleCodes(),
          ttl: 7200, // 2 hours
        },
        {
          key: "pms_data",
          fetcher: () => loadPms(),
          ttl: 7200, // 2 hours
        },
      ]);

      logTiming("FULL_DATA_FETCH_COMPLETE");

      if (!cmsExchanger) {
        console.log(`❌ Exchanger not found: ${name}`);
        return { notFound: true };
      }

      // Add cross-linking if we have all the data
      const enrichedExchanger = await addExchangerCrossLinking(
        cmsExchanger,
        articleCodes as string[],
        pms as IPm[],
        locale
      );

      logTiming("CROSS_LINKING_COMPLETE");

      const exchanger = enrichedExchanger || cmsExchanger;

      return await buildSuccessResponse({
        exchanger,
        articleCodes: articleCodes as string[],
        pms: pms as IPm[],
        slug,
        locale,
        startTime,
        logTiming,
      });
    } else {
      // Minimal data for fallback paths to avoid timeout
      console.log(`⚡ Minimal data fetch for fallback path: ${slug}`);

      const cmsExchanger = await safeFetchRedis(
        `exchanger_${name}`,
        () => loadExchanger(name),
        {
          ttl: 3600,
          logMetrics: true,
        }
      );

      logTiming("MINIMAL_DATA_FETCH_COMPLETE");

      if (!cmsExchanger) {
        console.log(`❌ Exchanger not found: ${name}`);
        return { notFound: true };
      }

      return await buildSuccessResponse({
        exchanger: cmsExchanger,
        articleCodes: [], // Empty for minimal load
        pms: [], // Empty for minimal load
        slug,
        locale,
        startTime,
        logTiming,
        isMinimal: true,
      });
    }
  } catch (error) {
    const elapsed = performance.now() - startTime;
    console.error(
      `🚨 getStaticProps error after ${elapsed.toFixed(2)}ms:`,
      error
    );

    // Emergency fallback to prevent 500 errors
    return {
      props: {
        exchanger: null,
        articleCodes: [],
        pms: [],
        seo: nullSeo,
        time: ((performance.now() - startTime) / 1000).toFixed(2),
        locale,
        error: true,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
      revalidate: 60, // Quick retry on error
    };
  }
}

// Helper function to build success response
async function buildSuccessResponse({
  exchanger,
  articleCodes,
  pms,
  slug,
  locale,
  startTime,
  logTiming,
  isMinimal = false,
}: {
  exchanger: IExchanger;
  articleCodes: string[];
  pms: IPm[];
  slug: string;
  locale: "en" | "ru";
  startTime: number;
  logTiming: (step: string) => void;
  isMinimal?: boolean;
}) {
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

  logTiming("SEO_GENERATION_COMPLETE");

  const finalTime = ((performance.now() - startTime) / 1000).toFixed(2);
  console.log(
    `✅ getStaticProps completed for ${slug}: ${finalTime}s ${
      isMinimal ? "(minimal)" : "(full)"
    }`
  );

  return {
    props: {
      exchanger: exchanger || null,
      articleCodes,
      pms,
      seo: seo || nullSeo,
      time: finalTime,
      locale,
      isMinimal,
      ...(await serverSideTranslations(locale || "ru", ["main"])),
    },
    revalidate: isMinimal ? 300 : 2400, // 5 min for minimal, 40 min for full
  };
}

// Optimized getStaticPaths with Redis caching
export async function getStaticPaths() {
  const startTime = performance.now();

  try {
    console.log("🚀 Generating static paths...");

    // Use cached exchangers data
    const exchangers = await safeFetchRedis(
      "exchangers_for_paths",
      async () => {
        const data = await loadExchangers();
        console.log(`📊 Loaded ${data?.length || 0} exchangers for paths`);
        return data;
      },
      {
        ttl: 7200, // 2 hours - paths don't change often
        logMetrics: true,
      }
    );

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
      : 5; // Default to 5 for testing

    const paths = allPaths.slice(0, prerenderLimit);

    const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
    console.log(
      `✅ Static paths generated: ${paths.length}/${allPaths.length} paths in ${elapsed}s`
    );
    console.log(
      `🔧 Prerender limit: ${prerenderLimit} (set NEXT_PUBLIC_PRERENDER_LIMIT to change)`
    );

    return {
      paths,
      fallback: "blocking", // Generate remaining pages on-demand
    };
  } catch (error) {
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
    console.error(`🚨 getStaticPaths error after ${elapsed}s:`, error);

    return {
      paths: [],
      fallback: "blocking",
    };
  }
}

// Development helper - remove in production
export async function clearExchangerCache(exchangerName?: string) {
  if (process.env.NODE_ENV !== "development") {
    console.warn("Cache clearing only available in development");
    return;
  }

  if (exchangerName) {
    await invalidateCache(`exchanger_${exchangerName}`);
    console.log(`🗑️ Cleared cache for exchanger: ${exchangerName}`);
  } else {
    await invalidateCache([
      "exchangers_for_paths",
      "article_codes",
      "pms_data",
    ]);
    console.log("🗑️ Cleared exchanger-related cache");
  }
}
