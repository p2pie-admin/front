import { initCMSFetcher, initParserFetcher } from "../services/fetchers";
import {
  TextBoxQuery,
  MainTextsQuery,
  pmLayoutsQuery,
  dirsTextQuery,
  articleCodesQuery,
  articlesQuery,
  articleQuery,
  selectorQuery,
  exchangerQuery,
  exchangersQuery,
  citiesQuery,
  massDirTextIdsQuery,
  massDirTextQuery,
} from "../services/queries";
import {
  convertSlugIntoMassDirText,
  getPmsFromSelector,
  mergeExchangers,
} from "./helper";
import { cachedArrayFetch, cachedFetch } from "./cache";
import { ICity, IDirText, IPmLayout } from "../types/exchange";
import { Redis } from "@upstash/redis";
import {
  exchangerNameToSlug,
  exchangerSlugToName,
} from "../components/exchangers/helper";
import { IArticle } from "../types/pages";
import { IExchanger, IExchangerPreview } from "../types/exchanger";
import { IMassDirTextId, IMassDirText, IMassRate } from "../types/mass";

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
    const res = (await cmsFetcher(TextBoxQuery, {
      locale,
      key: "root",
    })) as IDirText[];
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

export const loadArticleCodes = () =>
  cachedFetch("articleCodes", TTL.slow, async () => {
    const res = await cmsFetcher(articleCodesQuery);
    return res.map((a: any) => a.code) as string[];
  });

// export const loadArticles = async (locale: "en" | "ru") =>
//   cachedFetch(`articles_${locale}`, TTL.slow, async () => {
//     const articles = (await cmsFetcher(articlesQuery, { locale }))
//       ?.articles as IArticle[];

//     await Promise.all(
//       // вызываем в getStaticPaths чтобы потом подхватить кэш из getStaticProps
//       articles.map((a) =>
//         redis.set(
//           `article_${a.code.toLowerCase()}_${locale}`,
//           { data: a, updatedAt: Date.now() } // SWR format
//         )
//       )
//     );

//     return articles;
//   });

export const loadArticle = (code: string, locale: "en" | "ru") =>
  cachedFetch(`article_${code.toLowerCase()}_${locale}`, TTL.slow, async () => {
    const res = await cmsFetcher(articleQuery, { code, locale });
    return res?.[0] || null;
  });

export const loadPossibleDirs = () =>
  cachedFetch("dirs", TTL.fast, async () => {
    const pdirs = await parserFetcher("dirs"); // {"BTC_USDTTRC20": 119, "BTC_ETH": 34, ...}
    return Object.keys(pdirs);
  });

export const loadPms = async () => {
  const pms = await cachedFetch("pms", TTL.slow, async () => {
    try {
      const selector = await cmsFetcher(selectorQuery);
      if (!selector) {
        console.error(
          "Selector is undefined - check selectorQuery and CMS response"
        );
        return []; // safe fallback
      }

      return getPmsFromSelector(selector);
    } catch (e) {
      console.log("error loading pms: ", e);
      return [];
    }
  });
  return pms;
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

export const preloadCustomDirTexts = (locale: string, slug: string) => {};

export const loadCustomDirText = (locale: string, slug: string) =>
  cachedFetch(`custom_dir_text_${slug}`, TTL.instant, async () => {
    const res = await cmsFetcher(TextBoxQuery, { locale, key: slug });
    return res?.[0] as IDirText;
  });

// export const loadDirsTexts = (locale: "en" | "ru") =>
//   cachedFetch(
//     `dirsTexts_${locale}`,
//     TTL.slow,
//     () => cmsFetcher(dirsTextQuery, { locale }) as Promise<IDirText[]>
//   );
export const preloadDirTexts = () => {};

export const loadDirText = (
  locale: "en" | "ru",
  sectionGive: string,
  sectionGet: string
) =>
  cachedFetch(`dirText_${locale}_${sectionGive}_${sectionGet}`, TTL.slow, () =>
    cmsFetcher(dirsTextQuery, { locale })
  ).then((r) => r[0]) as Promise<IDirText>;

export const loadMassDirTextIds = ({
  locale,
  isSell,
}: {
  locale: "en" | "ru";
  isSell: boolean;
}) =>
  cachedFetch(
    `massDirTexts_${locale}_${isSell ? "sell" : "buy"}`,
    TTL.slow,
    async () => {
      const massDirTextIds = (await cmsFetcher(massDirTextIdsQuery, {
        locale,
        isSell,
      })) as IMassDirTextId[];
      return massDirTextIds;
    }
  );

export const loadMassDirText = ({
  locale,
  massDirTextId,
  isSell,
}: {
  locale: "en" | "ru";
  massDirTextId: IMassDirTextId;
  isSell: boolean;
}) =>
  cachedFetch(
    `${locale}_${isSell ? "sell" : "buy"}_${massDirTextId.code}_${
      massDirTextId.currency
    }`,
    TTL.slow,
    async () => {
      const massDirText = (
        await cmsFetcher(massDirTextQuery, {
          locale,
          ...massDirTextId,
          currencyCode: massDirTextId.currency.code,
        })
      )[0] as IMassDirText;
      return massDirText;
    }
  );

export const loadMassRates = ({
  currencyCode,
  code,
  isSell,
}: {
  currencyCode: string;
  code: string;
  isSell: boolean;
}) =>
  parserFetcher(
    `crypto=${code.toLowerCase()}/${currencyCode.toLowerCase()}/${
      isSell ? "sell" : "buy"
    }`
  ) as Promise<IMassRate[]>;
