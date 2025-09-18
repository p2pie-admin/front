import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// ------------------ setArray ------------------
export async function setArray<T>(
  key: string,
  data: T[],
  toKey: (item: T) => string,
  ttlSeconds?: number
) {
  try {
    const slugs = data.map(toKey);
    await redis.set(key, JSON.stringify(slugs));

    for (const item of data) {
      const slug = toKey(item);
      await redis.set(`${key}:${slug}`, JSON.stringify(item));
      if (ttlSeconds) {
        await redis.expire(`${key}:${slug}`, ttlSeconds);
      }
    }

    if (ttlSeconds) {
      await redis.expire(key, ttlSeconds);
    }
  } catch (error) {
    console.error(`Error setting array for "${key}":`, error);
  }
}

// ------------------ getArray ------------------
export async function getArray(key: string): Promise<any[] | null> {
  try {
    const redisKeys = await redis.keys(`${key}:*`);
    if (redisKeys.length === 0) return null;

    // Ensure keys are sorted so array order is preserved
    redisKeys.sort((a, b) => {
      const aIndex = parseInt(a.split(":").pop() || "0", 10);
      const bIndex = parseInt(b.split(":").pop() || "0", 10);
      return aIndex - bIndex;
    });

    const values = await redis.mget(...redisKeys);

    return (values as string[]).map((v) => {
      try {
        return JSON.parse(v);
      } catch {
        return v;
      }
    });
  } catch (error) {
    console.error(`Error retrieving array for key "${key}":`, error);
    return null;
  }
}

// ------------------ getItem ------------------
export async function getItem<T>(key: string, slug: string): Promise<T | null> {
  try {
    const raw = await redis.get(`${key}:${slug}`);
    if (!raw) return null;
    return JSON.parse(raw as string) as T;
  } catch (error) {
    console.error(`Error retrieving item for "${key}:${slug}":`, error);
    return null;
  }
}
