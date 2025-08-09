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

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const cmsFetcher = initCMSFetcher();
const parserFetcher = initParserFetcher();

export const TTL = {
  root_text: 3600,
  main_texts: 3600,
  exchangers: 600,
  pmLayouts: 3600,
  dirsTexts: 3600,
  articleCodes: 1800,
  articles: 1800,
  article: 1800,
  possible_pairs: 300,
  selector: 3600,
  exchanger: 600,
  cms_exchangers: 600,
  parser_exchangers: 600,
  cities: 86400,
};

export const loadRootText = (locale: "en" | "ru") =>
  cachedFetch(`root_text_${locale}`, TTL.root_text, async () => {
    const res = await cmsFetcher(TextBoxQuery, { locale, key: "root" });
    return res?.[0] || null;
  });

export const loadMainTexts = (locale: "en" | "ru") =>
  cachedFetch(`main_texts_${locale}`, TTL.main_texts, () =>
    cmsFetcher(MainTextsQuery, { locale })
  );

export const loadParserExchangers = () =>
  cachedFetch("exchangers", TTL.exchangers, () => parserFetcher("exchangers"));

export const loadPmLayouts = (locale: "en" | "ru") =>
  cachedFetch(
    `pmLayouts_${locale}`,
    TTL.pmLayouts,
    () => cmsFetcher(pmLayoutsQuery, { locale }) as Promise<IPmLayout[]>
  );

export const loadDirsTexts = (locale: "en" | "ru") =>
  cachedFetch(
    `dirsTexts_${locale}`,
    TTL.dirsTexts,
    () => cmsFetcher(dirsTextsQuery, { locale }) as Promise<IDirText[]>
  );

export const loadArticleCodes = () =>
  cachedFetch("articleCodes", TTL.articleCodes, async () => {
    const res = await cmsFetcher(articleCodesQuery);
    return res.map((a: any) => a.code) as string[];
  });

export const loadArticles = async (locale: "en" | "ru") =>
  cachedFetch(`articles_${locale}`, TTL.articles, async () => {
    const articles = (await cmsFetcher(articlesQuery, { locale }))
      ?.articles as IArticle[];

    await Promise.all(
      // вызываем в getStaticPaths чтобы потом подхватить кэш из getStaticProps
      articles.map((a) =>
        redis.set(
          `article_${a.code}_${locale}`,
          { data: a, updatedAt: Date.now() } // SWR format
        )
      )
    );

    return articles;
  });

export const loadArticle = (code: string, locale: "en" | "ru") =>
  cachedFetch(`article_${code}_${locale}`, TTL.article, () =>
    cmsFetcher(articleQuery, { code, locale })
  );

export const loadPossiblePairs = () =>
  cachedFetch("possible_pairs", TTL.possible_pairs, () =>
    parserFetcher("possible_pairs")
  );

export const loadPms = async () => {
  const selector = await cachedFetch("selector", TTL.selector, () =>
    cmsFetcher(selectorQuery)
  );
  return getPmsFromSelector(selector);
};

export const loadExchanger = (slug: string) =>
  cachedFetch(`exchanger_${slug}`, TTL.exchanger, async () => {
    const name = exchangerSlugToName(slug);
    const res = await cmsFetcher(exchangerQuery, { name });
    return res?.[0] || null;
  });

export const loadExchangers = async () => {
  const [cmsExchangers, parserExchangers] = await Promise.all([
    cachedFetch("cms_exchangers", TTL.cms_exchangers, () =>
      cmsFetcher(exchangersQuery)
    ),
    cachedFetch("parser_exchangers", TTL.parser_exchangers, () =>
      parserFetcher("exchangers")
    ),
  ]);

  const merged = mergeExchangers(cmsExchangers, parserExchangers);

  await Promise.all(
    // вызываем в getStaticPaths чтобы потом подхватить кэш из getStaticProps
    merged.map((ex) => {
      const slug = exchangerNameToSlug(ex.name);
      return redis.set(`exchanger_${slug}`, {
        data: ex,
        updatedAt: Date.now(),
      });
    })
  );

  return merged;
};

export const loadCities = () =>
  cachedFetch("cities", TTL.cities, async () => {
    const res = await cmsFetcher(citiesQuery);
    return (res?.cities || []) as ICity[];
  });
