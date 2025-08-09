import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Stale-While-Revalidate caching
export async function cachedFetch<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  // Try to read cached object { data, updatedAt }
  const cached = await redis.get<{ data: T; updatedAt: number }>(key);

  if (cached) {
    const isStale = Date.now() - cached.updatedAt > ttlSeconds * 1000;

    if (isStale) {
      // Trigger async refresh, but don't block response
      fetcher()
        .then((data) => redis.set(key, { data, updatedAt: Date.now() }))
        .catch((err) =>
          console.error(`SWV refresh failed for key "${key}":`, err)
        );
    }

    // Always return immediately
    return cached.data;
  }

  // No cache — fetch synchronously and store
  const data = await fetcher();
  await redis.set(key, { data, updatedAt: Date.now() });
  return data;
}
