import type { NextApiRequest, NextApiResponse } from "next";
import { redisGet } from "../../cache/redisClient";
import { loadCities } from "../../cache/loadX";
import { ICity } from "../../types/exchange";

type SearchIndexEntry = {
  slug: string;
  header: string;
  wordsToSearchFrom: string;
};

type SearchIndexCache = {
  data: SearchIndexEntry[];
  updatedAt: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  const cached =
    ((await redisGet("search:index")) as SearchIndexCache | null) || {
      data: [],
      updatedAt: null,
    };

  try {
    const cities = (await loadCities()) || [];

    const cityEntries = (cities as ICity[])
      .filter((city) => city?.en_name)
      .map((city) => {
        const citySlug = city.en_name
          ?.toLowerCase()
          ?.replace(/\s+/g, "-")
          ?.trim();
        const slug = `map/${citySlug}`;
        const headerLabel = city.ru_name || city.en_name || "Карта офисов";
        const wordsToSearchFrom = `${city.en_name || ""} ${
          city.ru_name || ""
        } mapa map office ${citySlug || ""}`;
        return {
          slug,
          header: `Карта офисов · ${headerLabel}`,
          wordsToSearchFrom,
        };
      });

    const combinedData: SearchIndexEntry[] = [
      ...(Array.isArray(cached.data) ? cached.data : []),
      ...cityEntries,
    ];

    return res.status(200).json({
      data: combinedData,
      updatedAt: cached.updatedAt ?? null,
    });
  } catch (error) {
    console.error("[search-index] Failed to load cities:", error);
    return res.status(200).json(cached);
  }
}
