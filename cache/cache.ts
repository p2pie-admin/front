import { Redis } from "@upstash/redis";
import { initParserFetcher, initCMSFetcher } from "../services/fetchers";
import {
  TextBoxQuery,
  MainTextsQuery,
  pmLayoutsQuery,
  dirsTextsQuery,
  articleCodesQuery,
  articlesQuery,
  articleQuery,
  selectorQuery,
  exchangerQuery,
  exchangersQuery,
  citiesQuery,
} from "../services/initialQueries";
import { IPmLayout, IDirText, ICity } from "../types/exchange";
import { IExchanger, IParserExchanger } from "../types/exchanger";
import { IArticle } from "../types/pages";
import { ISelector } from "../types/selector";
import { getPmsFromSelector, mergeExchangers } from "./helper";

// Types
type FetchKey = string;
type CacheOptions = {
  ttl?: number;
  fallbackToStale?: boolean;
  maxStaleTime?: number;
  logMetrics?: boolean;
  skipCache?: boolean;
};

type CacheBatchRequest<T = any> = {
  key: string;
  fetcher: () => Promise<T>;
  ttl?: number;
};

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Environment checks
const isBuildTime = process.env.BUILD_CACHE === "true";
const isDevelopment = process.env.NODE_ENV === "development";

// In-memory cache for build time and development
const memoryCache: Record<string, any> = {};

// =============================================================================
// ENHANCED CACHE UTILITIES
// =============================================================================

/**
 * Enhanced safeFetchRedis with Redis integration
 * Falls back to memory cache during build time, uses Redis in production
 */
export const safeFetchRedis = async <T>(
  key: FetchKey,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> => {
  const {
    ttl = 3600,
    fallbackToStale = true,
    logMetrics = !isDevelopment,
    skipCache = false,
  } = options;

  const startTime = Date.now();

  // Skip all caching if requested
  if (skipCache) {
    try {
      return await fetcher();
    } catch (e) {
      console.error(`Failed to fetch ${key}:`, e);
      return {} as T;
    }
  }

  // Build time: use memory cache only (your existing logic)
  if (isBuildTime) {
    return await buildTimeCacheFetch(key, fetcher, logMetrics);
  }

  // Development: use memory cache to avoid Redis calls
  if (isDevelopment) {
    return await developmentCacheFetch(key, fetcher, ttl, logMetrics);
  }

  // Production: use Redis with fallbacks
  return await productionCacheFetch(key, fetcher, {
    ttl,
    fallbackToStale,
    logMetrics,
    startTime,
  });
};

/**
 * Build time caching (your existing logic)
 */
const buildTimeCacheFetch = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  logMetrics: boolean
): Promise<T> => {
  if (memoryCache[key]) {
    if (logMetrics) console.log(`🎯 Build cache HIT: ${key}`);
    return memoryCache[key] as T;
  }

  try {
    const data = await fetcher();
    memoryCache[key] = data;
    if (logMetrics) console.log(`📦 Build cache SET: ${key}`);
    return data;
  } catch (e) {
    console.error(`Failed to fetch ${key}:`, e);
    return {} as T;
  }
};

/**
 * Development caching (memory only, with TTL simulation)
 */
const developmentCacheFetch = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number,
  logMetrics: boolean
): Promise<T> => {
  const cacheKey = `dev_${key}`;
  const now = Date.now();

  if (
    memoryCache[cacheKey] &&
    now - memoryCache[cacheKey].timestamp < ttl * 1000
  ) {
    if (logMetrics) console.log(`⚡ Dev cache HIT: ${key}`);
    return memoryCache[cacheKey].data as T;
  }

  try {
    const data = await fetcher();
    memoryCache[cacheKey] = { data, timestamp: now };
    if (logMetrics) console.log(`⚡ Dev cache SET: ${key}`);
    return data;
  } catch (e) {
    console.error(`Failed to fetch ${key}:`, e);
    return {} as T;
  }
};

/**
 * Production Redis caching with comprehensive fallbacks
 */
const productionCacheFetch = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl: number;
    fallbackToStale: boolean;
    logMetrics: boolean;
    startTime: number;
  }
): Promise<T> => {
  const { ttl, fallbackToStale, logMetrics, startTime } = options;

  try {
    // Try Redis cache first
    const cached = await redis.get(key);

    if (cached) {
      if (logMetrics) {
        console.log(`✅ Redis HIT: ${key} (${Date.now() - startTime}ms)`);
      }
      return typeof cached === "string" ? JSON.parse(cached) : (cached as any);
    }

    if (logMetrics) {
      console.log(`❌ Redis MISS: ${key} - fetching...`);
    }

    // Fetch fresh data
    const fresh = await fetcher();

    // Store in Redis (non-blocking)
    redis.setex(key, ttl, JSON.stringify(fresh)).catch((error) => {
      console.error(`Redis SET error for ${key}:`, error);
    });

    // Also store stale backup
    if (fallbackToStale) {
      redis
        .setex(`${key}:stale`, ttl * 24, JSON.stringify(fresh))
        .catch(() => {});
    }

    if (logMetrics) {
      console.log(`🔄 Redis SET: ${key} (${Date.now() - startTime}ms)`);
    }

    return fresh;
  } catch (error) {
    console.error(`Redis cache error for ${key}:`, error);

    // Try stale data fallback
    if (fallbackToStale) {
      try {
        const staleData = await redis.get(`${key}:stale`);
        if (staleData) {
          console.log(`⚠️ Using stale data for ${key}`);
          return typeof staleData === "string"
            ? JSON.parse(staleData)
            : (staleData as any);
        }
      } catch (staleError) {
        console.error(`Stale cache error for ${key}:`, staleError);
      }
    }

    // Last resort: direct fetch
    console.log(`🚨 Direct fetch fallback for ${key}`);
    try {
      return await fetcher();
    } catch (fetchError) {
      console.error(`Direct fetch failed for ${key}:`, fetchError);
      return {} as T;
    }
  }
};

/**
 * Batch cache operations for better performance
 */
export const safeFetchBatch = async <T = any>(
  requests: CacheBatchRequest<T>[]
): Promise<T[]> => {
  const startTime = Date.now();

  // Build time: use memory cache
  if (isBuildTime || isDevelopment) {
    const results = await Promise.all(
      requests.map((req) =>
        safeFetchRedis(req.key, req.fetcher, { ttl: req.ttl, skipCache: false })
      )
    );
    return results;
  }

  // Production: batch Redis operations
  try {
    const keys = requests.map((req) => req.key);
    const cachedResults = await redis.mget(...keys);

    const results: T[] = [];
    const missedRequests: Array<CacheBatchRequest<T> & { index: number }> = [];

    // Process cache hits/misses
    for (let i = 0; i < requests.length; i++) {
      const cached = cachedResults[i];
      if (cached !== null) {
        results[i] = typeof cached === "string" ? JSON.parse(cached) : cached;
        console.log(`✅ Batch HIT: ${requests[i].key}`);
      } else {
        missedRequests.push({ ...requests[i], index: i });
        console.log(`❌ Batch MISS: ${requests[i].key}`);
      }
    }

    // Fetch missing data
    if (missedRequests.length > 0) {
      const fetchPromises = missedRequests.map(async (req) => {
        try {
          const fresh = await req.fetcher();

          // Cache result (non-blocking)
          redis
            .setex(req.key, req.ttl || 3600, JSON.stringify(fresh))
            .catch((error) =>
              console.error(`Batch cache error ${req.key}:`, error)
            );

          return { index: req.index, data: fresh };
        } catch (error) {
          console.error(`Batch fetch error ${req.key}:`, error);
          return { index: req.index, data: {} as T };
        }
      });

      const fetchedResults = await Promise.all(fetchPromises);

      // Merge results
      fetchedResults.forEach(({ index, data }) => {
        results[index] = data;
      });
    }

    console.log(
      `📊 Batch operation: ${Date.now() - startTime}ms, hits: ${
        requests.length - missedRequests.length
      }/${requests.length}`
    );
    return results;
  } catch (error) {
    console.error("Batch cache error:", error);

    // Fallback to individual fetchers
    const results = await Promise.all(
      requests.map((req) =>
        safeFetchRedis(req.key, req.fetcher, { ttl: req.ttl })
      )
    );
    return results;
  }
};

// =============================================================================
// CACHE UTILITIES
// =============================================================================

export const invalidateCache = async (
  keys: string | string[]
): Promise<void> => {
  if (isBuildTime || isDevelopment) {
    const keysToDelete = Array.isArray(keys) ? keys : [keys];
    keysToDelete.forEach((key) => {
      delete memoryCache[key];
      delete memoryCache[`dev_${key}`];
    });
    console.log(`🗑️ Memory cache invalidated:`, keysToDelete);
    return;
  }

  try {
    if (Array.isArray(keys)) {
      await redis.del(...keys);
      console.log(`🗑️ Redis cache invalidated:`, keys);
    } else {
      await redis.del(keys);
      console.log(`🗑️ Redis cache invalidated: ${keys}`);
    }
  } catch (error) {
    console.error("Cache invalidation error:", error);
  }
};

export const warmCache = async (tasks: CacheBatchRequest[]): Promise<void> => {
  console.log(`🔥 Warming cache with ${tasks.length} tasks...`);
  const startTime = Date.now();

  const results = await Promise.allSettled(
    tasks.map(async (task) => {
      try {
        await safeFetchRedis(task.key, task.fetcher, {
          ttl: task.ttl || 3600,
          skipCache: false,
        });
        return { key: task.key, success: true };
      } catch (error) {
        console.error(`🚨 Failed to warm ${task.key}:`, error);
        return { key: task.key, success: false, error };
      }
    })
  );

  const successful = results.filter((r) => r.status === "fulfilled").length;
  console.log(
    `🔥 Cache warming completed: ${successful}/${tasks.length} (${
      Date.now() - startTime
    }ms)`
  );
};

// =============================================================================
// UPDATED DATA LOADING FUNCTIONS
// =============================================================================

const parserFetcher = initParserFetcher();
const cmsFetcher = initCMSFetcher();

export const loadRootText = async (locale: "en" | "ru") =>
  await safeFetchRedis(
    `root_text_${locale}`,
    async () => {
      const textBoxes = await cmsFetcher(TextBoxQuery, { locale, key: "root" });
      return textBoxes[0] || null;
    },
    { ttl: 7200 } // 2 hours
  );

export const loadMainTexts = async (locale: "en" | "ru") =>
  await safeFetchRedis(
    `main_texts_${locale}`,
    async () => {
      const mainTexts = await cmsFetcher(MainTextsQuery, { locale });
      return mainTexts || null;
    },
    { ttl: 7200 }
  );

export const loadParserExchangers = () =>
  safeFetchRedis("parser_exchangers", () => parserFetcher("exchangers"), {
    ttl: 3600,
  });

export const loadPmLayouts = () =>
  safeFetchRedis("pmLayouts", () => cmsFetcher(pmLayoutsQuery), {
    ttl: 7200,
  }) as Promise<IPmLayout[]>;

export const loadDirsTexts = () =>
  safeFetchRedis("dirsTexts", () => cmsFetcher(dirsTextsQuery), {
    ttl: 3600,
  }) as Promise<IDirText[]>;

export const loadArticleCodes = async (): Promise<string[]> => {
  const articleCodes = (await safeFetchRedis(
    "articleCodes",
    () => cmsFetcher(articleCodesQuery),
    { ttl: 7200 }
  )) as { id: undefined; code: string }[];

  return articleCodes.map((res) => res.code);
};

export const loadArticles = () =>
  safeFetchRedis("articles", () => cmsFetcher(articlesQuery), {
    ttl: 7200,
  }) as Promise<IArticle[]>;

export const loadArticle = (code: string, locale: "en" | "ru") =>
  safeFetchRedis(
    `article_${code}_${locale}`,
    () => cmsFetcher(articleQuery, { code, locale }),
    { ttl: 3600 }
  ) as Promise<IArticle[]>;

export const loadPossiblePairs = () =>
  safeFetchRedis(
    "possible_pairs",
    () => parserFetcher("possible_pairs"),
    { ttl: 1800 } // 30 minutes - changes frequently
  ) as Promise<Record<string, string[]>>;

export const loadPms = async () => {
  const selector = (await safeFetchRedis(
    "selector",
    () => cmsFetcher(selectorQuery),
    { ttl: 7200 }
  )) as ISelector;

  const pms = getPmsFromSelector(selector);
  return pms;
};

export const loadExchanger = async (
  name: string
): Promise<IExchanger | null> => {
  const exchanger = (await safeFetchRedis(
    `exchanger_${name}`,
    async () => cmsFetcher(exchangerQuery, { name }),
    { ttl: 3600 }
  )) as IExchanger[];

  return exchanger[0] || null;
};

export const loadExchangers = async () => {
  // Use batch fetching for better performance
  const [cmsExchangers, parserExchangers] = await safeFetchBatch([
    {
      key: "cms_exchangers",
      fetcher: () => cmsFetcher(exchangersQuery),
      ttl: 3600,
    },
    {
      key: "parser_exchangers",
      fetcher: () => parserFetcher("exchangers"),
      ttl: 3600,
    },
  ]);

  const exchangers = mergeExchangers(
    cmsExchangers as IExchanger[],
    parserExchangers as Record<string, IParserExchanger>
  );
  return exchangers;
};

export const loadCities = () =>
  safeFetchRedis(
    "cities",
    async () => {
      const parserSettings = (await cmsFetcher(citiesQuery)) as {
        cities: ICity[] | null;
      };
      return parserSettings?.cities || [];
    },
    { ttl: 14400 } // 4 hours - cities very stable
  ) as Promise<ICity[]>;

export const fetchPmLayouts = async (
  locale: "en" | "ru"
): Promise<IPmLayout[]> => {
  return await safeFetchRedis(
    `pm_layouts_${locale}`,
    async () => {
      const fetcher = initCMSFetcher();
      const pmLayoutsRes = await fetcher(pmLayoutsQuery, { locale });
      return pmLayoutsRes as IPmLayout[];
    },
    { ttl: 7200 }
  );
};

export const fetchDirsTexts = async (
  locale: "en" | "ru"
): Promise<IDirText[]> => {
  return await safeFetchRedis(
    `dirs_texts_${locale}`,
    async () => {
      const fetcher = initCMSFetcher();
      const dirsTextsRes = await fetcher(dirsTextsQuery, { locale });
      return dirsTextsRes as IDirText[];
    },
    { ttl: 3600 }
  );
};

// =============================================================================
// OPTIMIZED getStaticProps
// =============================================================================

export const getOptimizedStaticProps = async (context: {
  locale: "en" | "ru";
  params: { exchange: string };
}) => {
  const { locale, params } = context;
  const startTime = Date.now();

  try {
    console.log(`🚀 getStaticProps started for: ${params.exchange}`);

    // Use batch fetching for all common data
    const [pms, possiblePairs, cities, pmLayouts, dirTexts, articleCodes] =
      await safeFetchBatch([
        {
          key: "selector",
          fetcher: async () => {
            const selector = await cmsFetcher(selectorQuery);
            return getPmsFromSelector(selector);
          },
          ttl: 7200,
        },
        {
          key: "possible_pairs",
          fetcher: () => parserFetcher("possible_pairs"),
          ttl: 1800,
        },
        {
          key: "cities",
          fetcher: async () => {
            const parserSettings = await cmsFetcher(citiesQuery);
            return parserSettings?.cities || [];
          },
          ttl: 14400,
        },
        {
          key: `pm_layouts_${locale}`,
          fetcher: () => cmsFetcher(pmLayoutsQuery, { locale }),
          ttl: 7200,
        },
        {
          key: `dirs_texts_${locale}`,
          fetcher: () => cmsFetcher(dirsTextsQuery, { locale }),
          ttl: 3600,
        },
        {
          key: "article_codes",
          fetcher: async () => {
            const codes = await cmsFetcher(articleCodesQuery);
            return codes.map((res: any) => res.code);
          },
          ttl: 7200,
        },
      ]);

    console.log(`⏱️ Data fetching completed: ${Date.now() - startTime}ms`);

    // Continue with your existing getStaticProps logic here...
    // The rest stays the same, just use the fetched data

    return {
      props: {
        // your props
      },
      revalidate: 2400,
    };
  } catch (error) {
    console.error("🚨 getStaticProps error:", error);
    return {
      props: {
        error: true,
        minimal: true,
      },
      revalidate: 60,
    };
  }
};

// =============================================================================
// CACHE WARMING API ROUTE
// =============================================================================

export const createCacheWarmingHandler = () => {
  return async (req: any, res: any) => {
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const startTime = Date.now();

    try {
      const warmingTasks: CacheBatchRequest[] = [
        {
          key: "selector",
          fetcher: () => cmsFetcher(selectorQuery),
          ttl: 7200,
        },
        {
          key: "cities",
          fetcher: async () => {
            const parserSettings = await cmsFetcher(citiesQuery);
            return parserSettings?.cities || [];
          },
          ttl: 14400,
        },
        {
          key: "possible_pairs",
          fetcher: () => parserFetcher("possible_pairs"),
          ttl: 1800,
        },
        {
          key: "article_codes",
          fetcher: async () => {
            const codes = await cmsFetcher(articleCodesQuery);
            return codes.map((res: any) => res.code);
          },
          ttl: 7200,
        },
        // Warm both locales
        {
          key: "pm_layouts_en",
          fetcher: () => cmsFetcher(pmLayoutsQuery, { locale: "en" }),
          ttl: 7200,
        },
        {
          key: "pm_layouts_ru",
          fetcher: () => cmsFetcher(pmLayoutsQuery, { locale: "ru" }),
          ttl: 7200,
        },
        {
          key: "dirs_texts_en",
          fetcher: () => cmsFetcher(dirsTextsQuery, { locale: "en" }),
          ttl: 3600,
        },
        {
          key: "dirs_texts_ru",
          fetcher: () => cmsFetcher(dirsTextsQuery, { locale: "ru" }),
          ttl: 3600,
        },
      ];

      await warmCache(warmingTasks);

      res.status(200).json({
        success: true,
        duration: Date.now() - startTime,
        warmed: warmingTasks.length,
      });
    } catch (error: any) {
      console.error("Cache warming failed:", error);
      res.status(500).json({
        error: "Cache warming failed",
        message: error.message,
      });
    }
  };
};

export const emptyProps = (locale: "en" | "ru") => ({
  pm: null,
  locale,
  article: null,
  otherDirs: null,
});
