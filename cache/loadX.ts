import { initCMSFetcher, initParserFetcher } from "../services/fetchers";
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
import { getPmsFromSelector, mergeExchangers } from "./helper";
import { cachedFetch } from "./cache";
import { ICity, IDirText, IPmLayout } from "../types/exchange";
import { Redis } from "@upstash/redis";
import {
  exchangerNameToSlug,
  exchangerSlugToName,
} from "../components/exchangers/helper";
import { IArticle } from "../types/pages";
import { IExchanger, IExchangerPreview } from "../types/exchanger";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const cmsFetcher = initCMSFetcher();
const parserFetcher = initParserFetcher();

export const TTL = {
  instant: 60 * 2,
  fast: 60 * 10,
  slow: 60 * 30,
  never: -1,
};

export const loadRootText = (locale: "en" | "ru") =>
  cachedFetch(`root_text_${locale}`, TTL.slow, async () => {
    const res = await cmsFetcher(TextBoxQuery, { locale, key: "root" });
    return res?.[0] || null;
  });

export const loadMainTexts = (locale: "en" | "ru") =>
  cachedFetch(`main_texts_${locale}`, TTL.slow, () =>
    cmsFetcher(MainTextsQuery, { locale })
  );

export const loadParserExchangers = () =>
  cachedFetch("exchangers", TTL.fast, () => parserFetcher("exchangers"));

export const loadPmLayouts = (locale: "en" | "ru") =>
  cachedFetch(
    `pmLayouts_${locale}`,
    TTL.slow,
    () => cmsFetcher(pmLayoutsQuery, { locale }) as Promise<IPmLayout[]>
  );

export const loadDirsTexts = (locale: "en" | "ru") =>
  cachedFetch(
    `dirsTexts_${locale}`,
    TTL.slow,
    () => cmsFetcher(dirsTextsQuery, { locale }) as Promise<IDirText[]>
  );

export const loadArticleCodes = () =>
  cachedFetch("articleCodes", TTL.slow, async () => {
    const res = await cmsFetcher(articleCodesQuery);
    return res.map((a: any) => a.code) as string[];
  });

export const loadArticles = async (locale: "en" | "ru") =>
  cachedFetch(`articles_${locale}`, TTL.slow, async () => {
    const articles = (await cmsFetcher(articlesQuery, { locale }))
      ?.articles as IArticle[];

    await Promise.all(
      // вызываем в getStaticPaths чтобы потом подхватить кэш из getStaticProps
      articles.map((a) =>
        redis.set(
          `article_${a.code.toLowerCase()}_${locale}`,
          { data: a, updatedAt: Date.now() } // SWR format
        )
      )
    );

    return articles;
  });

export const loadArticle = (code: string, locale: "en" | "ru") =>
  cachedFetch(`article_${code.toLowerCase()}_${locale}`, TTL.slow, async () => {
    const res = await cmsFetcher(articleQuery, { code, locale });
    return res?.[0] || null;
  });

export const loadPossiblePairs = () =>
  cachedFetch("possible_pairs", TTL.fast, () =>
    parserFetcher("possible_pairs")
  );

export const loadPms = async () => {
  const selector = await cachedFetch("selector", TTL.slow, () =>
    cmsFetcher(selectorQuery)
  );

  if (!selector) {
    console.error(
      "Selector is undefined - check selectorQuery and CMS response"
    );
    return []; // Return empty array or throw error
  }

  return getPmsFromSelector(selector);
};

export const loadExchanger = (slug: string) =>
  cachedFetch(`exchanger_${slug}`, TTL.fast, async () => {
    const name = exchangerSlugToName(slug);
    const res = await cmsFetcher(exchangerQuery, { name });
    return res?.[0] || null;
  });

export const loadExchangers = async () => {
  const [cmsExchangers] = (await Promise.all([
    cachedFetch("cms_exchangers", TTL.fast, () => cmsFetcher(exchangersQuery)),
    // cachedFetch("parser_exchangers", TTL.fast, () =>
    //   parserFetcher("exchangers")
    // ),
  ])) as IExchangerPreview[][];

  //const merged = mergeExchangers(cmsExchangers, parserExchangers);

  // Promise.all(
  //   // вызываем в getStaticPaths чтобы потом подхватить кэш из getStaticProps
  //   cmsExchangers.map((ex) => {
  //     const slug = exchangerNameToSlug(ex.name);
  //     return redis.set(`exchanger_${slug}`, {
  //       data: ex,
  //       updatedAt: Date.now(),
  //     });
  //   })
  // );

  return cmsExchangers;
};

export const loadCities = () =>
  cachedFetch("cities", TTL.slow, async () => {
    const res = await cmsFetcher(citiesQuery);
    return (res?.cities || []) as ICity[];
  });

export const loadPopular = () =>
  cachedFetch("popular", TTL.instant, async () => {
    const res = await parserFetcher("top");
    return res || [];
  });
