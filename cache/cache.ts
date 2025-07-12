type CacheEntry = {
  data: any;
  expires: number;
};

const cache: Record<string, CacheEntry> = {};

export const getCache = <T>(key: string): T | null => {
  const entry = cache[key];
  if (!entry || Date.now() > entry.expires) return null;
  return entry.data;
};

export const setCache = (key: string, data: any, ttlMs: number) => {
  cache[key] = {
    data,
    expires: Date.now() + ttlMs,
  };
};
