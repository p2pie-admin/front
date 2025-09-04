import { Redis } from "@upstash/redis";

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

  if (cached) {
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
  } else {
    console.warn(`Fetcher for "${key}" returned empty result`);
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
