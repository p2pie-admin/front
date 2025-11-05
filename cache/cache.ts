import { Redis } from "@upstash/redis";
import { env } from "process";
import { getArray, getItem, setArray } from "./redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function cachedFetch<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  let cached: { data: T; updatedAt: number } | null = null;

  try {
    cached = await redis.get<{ data: T; updatedAt: number }>(key);
  } catch (err) {
    console.error(`Redis GET failed for "${key}":`, err);
  }

  if (cached && env.NODE_ENV !== "development") {
    const isStale =
      ttlSeconds > 0 && Date.now() - cached.updatedAt > ttlSeconds * 1000;

    if (isStale) {
      // Refresh in background
      fetcher()
        .then((data) => {
          if (data !== null && data !== undefined) {
            return redis.set(key, { data, updatedAt: Date.now() });
          }
        })
        .catch((err) =>
          console.error(`SWR refresh failed for key "${key}":`, err)
        );
    }

    return cached.data;
  }

  // No cache → fetch synchronously
  const data = await fetcher();

  if (data !== null && data !== undefined) {
    redis
      .set(key, { data, updatedAt: Date.now() })
      .catch((err) => console.error(`Redis SET failed for "${key}":`, err));
  }

  return data;
}

/**
 * Add one or more paths to the sitemap:paths key in Redis
 */
type StaticPath = {
  params: { [key: string]: string };
  locale?: string;
};

export async function addPathsToSitemap(paths: StaticPath | StaticPath[]) {
  const key = "sitemap:paths";
  const normalized = Array.isArray(paths) ? paths : [paths];

  // Convert objects to URL paths
  const stringPaths = normalized.map((p) => {
    const segments = Object.values(p.params).map(encodeURIComponent).join("/");
    return p.locale ? `/${p.locale}/${segments}` : `/${segments}`;
  });

  try {
    const cached = await redis.get<{ data: string[]; updatedAt: number }>(key);
    const existing = cached?.data || [];

    // Merge and deduplicate
    const merged = Array.from(new Set([...existing, ...stringPaths]));

    await redis.set(key, { data: merged, updatedAt: Date.now() });
    console.log(
      `Added ${stringPaths.length} path(s) to sitemap. Total now: ${merged.length}`
    );
  } catch (err) {
    console.error(`Failed to add paths to sitemap:`, err);
  }
}
export async function addHeadersToSearchIndex(
  entries:
    | { slug: string; header?: string; wordsToSearchFrom?: string }
    | { slug: string; header?: string; wordsToSearchFrom?: string }[]
) {
  const key = "search:index";
  const locale = (process.env.NEXT_PUBLIC_SITE_LANG || "ru") as "ru" | "en";
  const normalizedEntries = Array.isArray(entries) ? entries : [entries];

  try {
    const cached = await redis.get<{ data: any[]; updatedAt: number }>(key);
    const existing = cached?.data || [];

    // Map existing entries by locale/slug for fast deduplication
    const mergedMap = new Map(
      existing.map((e) => [`${e.locale || ""}/${e.slug}`, e])
    );

    for (const entry of normalizedEntries) {
      const newKey = `${locale}/${entry.slug}`;
      const cleanedWords = cleanWords(
        entry.wordsToSearchFrom || entry.header || ""
      );

      const newValue = {
        ...entry,
        locale,
        wordsToSearchFrom: cleanedWords,
      };

      // Skip duplicates (same normalized cleaned words)
      const alreadyExists = Array.from(mergedMap.values()).some(
        (e) =>
          normalizeText(e.wordsToSearchFrom) === normalizeText(cleanedWords)
      );

      if (!alreadyExists) {
        mergedMap.set(newKey, newValue);
      }
    }

    const merged = Array.from(mergedMap.values());

    await redis.set(key, { data: merged, updatedAt: Date.now() });
  } catch (err) {
    console.error(`❌ Failed to add headers to search index:`, err);
  }
}

function normalizeText(str: string): string {
  return str
    ?.toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function cleanWords(str: string): string {
  if (!str) return "";

  // remove "undefined" or "null" and extra spaces
  const cleaned = str
    .replace(/\b(undefined|null)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  // split into words, remove duplicates (case-insensitive)
  const uniqueWords = Array.from(
    new Set(cleaned.split(/\s+/).map((w) => w.toLowerCase()))
  );

  return uniqueWords.join(" ");
}

//...
export async function cachedArrayFetch<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T[]>,
  toKey: (item: T) => string
): Promise<T[]> {
  let cachedSlugs: string[] = [];

  try {
    cachedSlugs = (await getArray(key)) as any;
  } catch (err) {
    console.error(`Redis GET (array) failed for "${key}":`, err);
  }

  if (cachedSlugs.length && process.env.NODE_ENV !== "development") {
    const metaRaw = (await redis.get<string>(`${key}:__meta`)) ?? null;
    let updatedAt = 0;

    if (metaRaw) {
      try {
        updatedAt = JSON.parse(metaRaw).updatedAt ?? 0;
      } catch {
        updatedAt = 0;
      }
    }

    const isStale =
      ttlSeconds > 0 && Date.now() - updatedAt > ttlSeconds * 1000;

    if (isStale) {
      fetcher()
        .then(async (data) => {
          await setArray(key, data, toKey, ttlSeconds);
          await redis.set(
            `${key}:__meta`,
            JSON.stringify({ updatedAt: Date.now() })
          );
        })
        .catch((err) =>
          console.error(`SWR refresh (array) failed for "${key}":`, err)
        );
    }

    // Return hydrated objects instead of just slugs
    return Promise.all(cachedSlugs.map((slug) => getItem<T>(key, slug))).then(
      (items) => items.filter(Boolean) as T[]
    );
  }

  const data = await fetcher();

  if (data.length > 0) {
    await setArray(key, data, toKey, ttlSeconds);
    await redis.set(`${key}:__meta`, JSON.stringify({ updatedAt: Date.now() }));
  }

  return data;
}
