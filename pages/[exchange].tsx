import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { safeFetch } from "../cache/loadInitialData";
import ExchangersList from "../components/exchangers";
import { getT } from "../components/shared/getT";
import { nullSeo } from "../components/shared/UniversalSeo";
import { loadExchangers } from "../next-sitemap.config";
import { IExchanger, IParserExchanger } from "../types/exchanger";
import { ISEO } from "../types/general";
import { safeFetchRedis } from "../cache/cache";
import { slugCityToExchange } from "../components/exchange/helper";
import city from "../components/layout/header/city";

const ExchangersPage = ({
  exchangers,
  seo,
  loadTime,
  cacheStatus,
}: {
  exchangers: (IExchanger & IParserExchanger)[] | null;
  seo: ISEO;
  loadTime?: string;
  cacheStatus?: string;
}) => (
  <>
    <ExchangersList exchangers={exchangers} seo={seo} />
    {process.env.NODE_ENV === "development" && (
      <div
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          background: "rgba(0,0,0,0.8)",
          color: "white",
          padding: "5px 10px",
          borderRadius: "5px",
          fontSize: "12px",
          zIndex: 1000,
        }}
      >
        {loadTime} | {cacheStatus}
      </div>
    )}
  </>
);

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const startTime = performance.now();

  const logTiming = (step: string) => {
    const elapsed = performance.now() - startTime;
    console.log(`⏱️ [ExchangersPage-${step}] ${elapsed.toFixed(2)}ms elapsed`);

    // Alert if getting close to timeout
    if (elapsed > 25000) {
      console.error(`🚨 TIMEOUT RISK: ${step} took ${elapsed.toFixed(2)}ms`);
    }
  };

  try {
    console.log(`🚀 Loading exchangers page for locale: ${locale}`);
    logTiming("START");

    // Use cached exchangers data with optimized fetching
    const exchangers = await safeFetchRedis(
      "exchangers_list_page",
      async () => {
        console.log("🔄 Fetching fresh exchangers data...");
        const data = await loadExchangers();

        if (!data?.length) {
          console.warn("⚠️ No exchangers data returned from loadExchangers");
          return null;
        }

        console.log(`📊 Loaded ${data.length} exchangers successfully`);
        return data;
      },
      {
        ttl: 3600, // 1 hour - exchangers change more frequently than paths
        logMetrics: true,
        fallbackToStale: true, // Use stale data if fresh fetch fails
      }
    );

    logTiming("EXCHANGERS_LOAD_COMPLETE");

    // Handle no exchangers case
    if (!exchangers?.length) {
      console.log("❌ No exchangers available, returning empty state");

      return {
        props: {
          exchangers: null,
          seo: nullSeo,
          loadTime: ((performance.now() - startTime) / 1000).toFixed(2) + "s",
          cacheStatus: "NO_DATA",
          ...(await serverSideTranslations(locale || "ru", ["main"])),
        },
        revalidate: 300, // 5 minutes - retry sooner when no data
      };
    }

    // Load translations with caching
    const translations = await safeFetchRedis(
      `translations_exchangers_${locale}`,
      async () => {
        console.log(`🔄 Loading translations for locale: ${locale}`);
        const t = await getT(locale || "ru");
        return {
          title: t("exchangers-meta-title"),
          description: t("exchangers-meta-description"),
        };
      },
      {
        ttl: 7200, // 2 hours - translations are very stable
        logMetrics: true,
      }
    );

    logTiming("TRANSLATIONS_LOAD_COMPLETE");

    const seo = {
      title: title1,
      description: description + cityAddon,
      canonicalPath: `${locale}/${slugCityToExchange(slug, city?.en_name)}`,
      locale,
      alternateLangs: [
        {
          rel: "alternate",
          hrefLang: "en",
          href: `https://${
            process.env.NEXT_PUBLIC_NAME
          }.com/en/${slugCityToExchange(slug, city?.en_name)}`,
        },
        {
          rel: "alternate",
          hrefLang: "ru",
          href: `https://${
            process.env.NEXT_PUBLIC_NAME
          }.com/ru/${slugCityToExchange(slug, city?.en_name)}`,
        },
      ],
      breadcrumbs: [
        {
          position: 1,
          name: locale === "en" ? "Home" : "Главная",
          item: `https://${process.env.NEXT_PUBLIC_NAME}.com/${locale}`,
        },
        {
          position: 2,
          name: title1,
          item: `https://${
            process.env.NEXT_PUBLIC_NAME
          }.com/${locale}/${slugCityToExchange(slug, city?.en_name)}`,
        },
      ],
    };

    const finalTime = ((performance.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ ExchangersPage getStaticProps completed: ${finalTime}s`);
    logTiming("PROPS_READY");

    return {
      props: {
        seo: seo || nullSeo,
        exchangers: exchangers || null,
        loadTime: finalTime + "s",
        cacheStatus: "SUCCESS",
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
      revalidate: 2400, // 40 minutes - good balance for this page
    };
  } catch (error) {
    const elapsed = performance.now() - startTime;
    console.error(
      `🚨 ExchangersPage getStaticProps error after ${elapsed.toFixed(2)}ms:`,
      error
    );

    // Emergency fallback with basic SEO
    const fallbackSeo: ISEO = {
      title:
        locale === "en"
          ? "Cryptocurrency Exchangers"
          : "Криптовалютные Обменники",
      description:
        locale === "en"
          ? "List of cryptocurrency exchangers and their ratings"
          : "Список криптовалютных обменников и их рейтинги",
      canonicalPath: `${locale}/exchangers`,
      locale: locale as "en" | "ru",
    };

    return {
      props: {
        exchangers: null,
        seo: fallbackSeo,
        loadTime: ((performance.now() - startTime) / 1000).toFixed(2) + "s",
        cacheStatus: "ERROR",
        error: true,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
      revalidate: 60, // Quick retry on error
    };
  }
};

export default ExchangersPage;

// =============================================================================
// ADDITIONAL UTILITY FUNCTIONS
// =============================================================================

// Cache warming function specifically for exchangers page
export async function warmExchangersPageCache() {
  if (process.env.NODE_ENV !== "development") {
    console.warn("Cache warming should be done via API routes in production");
    return;
  }

  const { warmCache } = await import("../../utils/cache");

  try {
    console.log("🔥 Warming ExchangersPage cache...");

    const tasks = [
      {
        key: "exchangers_list_page",
        fetcher: async () => {
          const data = await loadExchangers();
          console.log(`📊 Warmed exchangers data: ${data?.length || 0} items`);
          return data;
        },
        ttl: 3600,
      },
      {
        key: "translations_exchangers_en",
        fetcher: async () => {
          const t = await getT("en");
          return {
            title: t("exchangers-meta-title"),
            description: t("exchangers-meta-description"),
          };
        },
        ttl: 7200,
      },
      {
        key: "translations_exchangers_ru",
        fetcher: async () => {
          const t = await getT("ru");
          return {
            title: t("exchangers-meta-title"),
            description: t("exchangers-meta-description"),
          };
        },
        ttl: 7200,
      },
    ];

    await warmCache(tasks);
    console.log("✅ ExchangersPage cache warming completed");
  } catch (error) {
    console.error("🚨 ExchangersPage cache warming failed:", error);
  }
}

// Development helper for cache management
export async function clearExchangersPageCache() {
  if (process.env.NODE_ENV !== "development") {
    console.warn("Cache clearing only available in development");
    return;
  }

  const { invalidateCache } = await import("../../utils/cache");

  await invalidateCache([
    "exchangers_list_page",
    "translations_exchangers_en",
    "translations_exchangers_ru",
  ]);

  console.log("🗑️ Cleared ExchangersPage cache");
}

// Enhanced component with error boundary
export function ExchangersPageWithErrorBoundary(props: any) {
  if (props.error) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          background: "#fee",
          border: "1px solid #fcc",
          borderRadius: "8px",
          margin: "2rem",
        }}
      >
        <h2>⚠️ Loading Error</h2>
        <p>
          There was an issue loading the exchangers data. Please try refreshing
          the page.
        </p>
        {process.env.NODE_ENV === "development" && (
          <details style={{ marginTop: "1rem", textAlign: "left" }}>
            <summary>Debug Info</summary>
            <pre
              style={{
                background: "#f5f5f5",
                padding: "1rem",
                overflow: "auto",
              }}
            >
              Load Time: {props.loadTime}
              Cache Status: {props.cacheStatus}
              Error: Check server logs for details
            </pre>
          </details>
        )}
      </div>
    );
  }

  return <ExchangersPage {...props} />;
}
