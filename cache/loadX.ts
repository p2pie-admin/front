import { initCMSFetcher, initParserFetcher } from "../services/fetchers";
import {
  TextBoxQuery,
  MainTextsQuery,
  pmLayoutsQuery,
  dirsTextQuery,
  articleCodesQuery,
  // articlesQuery,
  articleQuery,
  selectorQuery,
  exchangerQuery,
  exchangersQuery,
  citiesQuery,
  massDirTextIdsQuery,
  massDirTextQuery,
  articlesQuery,
  FAQbyCategoryCodeQuery,
  FAQsQuery,
  allReviewsQuery,
} from "../services/queries";
import { getPmsFromSelector } from "./helper";
import { cachedFetch } from "./cache";
import { ICity, IDirText, IPmLayout } from "../types/exchange";
import {
  exchangerNameToSlug,
  exchangerSlugToName,
} from "../components/exchangers/helper";
import { IArticle } from "../types/pages";
import { IExchanger, IExchangerPreview } from "../types/exchanger";
import { IMassDirTextId, IMassDirText, IMassRate } from "../types/mass";
import { IFaqCategory } from "../types/faq";
import { IExchangerReview } from "../types/exchanger";

const locale = process.env.NEXT_PUBLIC_SITE_LANG || "ru";

const cmsFetcher = initCMSFetcher();
const parserFetcher = initParserFetcher();

export const TTL = {
  instant: 60 * 2,
  fast: 60 * 10,
  slow: 60 * 60,
  slowest: 60 * 60 * 10,
  never: -1,
};

export const loadRootText = () =>
  cachedFetch(`root_text_${locale}`, TTL.slow, async () => {
    const res = (await cmsFetcher(TextBoxQuery, {
      locale,
      key: "root",
    })) as IDirText[];
    return res?.[0] || null;
  });

export const loadMainTexts = () =>
  cachedFetch(`main_texts_${locale}`, TTL.slow, () =>
    cmsFetcher(MainTextsQuery, { locale })
  );

export const loadParserExchangers = () =>
  cachedFetch("exchangers", TTL.fast, () => parserFetcher("exchangers"));

export const loadPmLayouts = () =>
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

export const loadArticle = (code: string) =>
  cachedFetch(`article_${code.toLowerCase()}_${locale}`, TTL.slow, async () => {
    const res = await cmsFetcher(articleQuery, { code, locale });
    return (res?.[0] || null) as IArticle | null;
  });

export const loadPossibleDirs = () =>
  cachedFetch("dirs", TTL.fast, async () => {
    const dirs = (await parserFetcher("dirs")) as Record<string, number>; // {"BTC_USDTTRC20": 119, "BTC_ETH": 34, ...}

    return dirs;
  });

export const limitedPossibleDirs = (
  dirs: Record<string, number>,
  strength: "low" | "middle" | "high"
): string[] => {
  const limit =
    strength == "low"
      ? 2
      : strength == "middle"
      ? process.env.NEXT_PUBLIC_RATES_MIN || 5
      : process.env.NEXT_PUBLIC_RATES_RENDER_MIN || 10;
  return Object.entries(dirs)
    .filter(([dir, rates]) => rates >= +limit)
    .map((v) => v[0]);
};

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
    return (res?.[0] as IExchanger) || null;
  });

export const loadExchangers = async () => {
  const [cmsExchangers] = (await Promise.all([
    cachedFetch("cms_exchangers", TTL.fast, () => cmsFetcher(exchangersQuery)),
  ])) as IExchangerPreview[][];
  return cmsExchangers;
};

export const loadArticles = async () => {
  const articles = await cachedFetch("articles", TTL.fast, () =>
    cmsFetcher(articlesQuery)
  );
  return articles;
};

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

export const loadCustomDirText = (slug: string) =>
  cachedFetch(`custom_dir_text_${slug}`, TTL.instant, async () => {
    const res = await cmsFetcher(TextBoxQuery, { locale, key: slug });
    return res?.[0] as IDirText;
  });

export const loadFAQs = () =>
  cachedFetch(`faqs_${locale}`, TTL.slow, async () => {
    const res = (await cmsFetcher(FAQsQuery, { locale })) as
      | IFaqCategory[]
      | null;
    return res || [];
  });

export const loadFAQbyCategoryCode = (code: string) =>
  cachedFetch(
    `faq_${code.toLowerCase()}_${locale}`,
    TTL.slow,
    async () => {
      const res = (await cmsFetcher(FAQbyCategoryCodeQuery, {
        code,
        locale,
      })) as IFaqCategory[] | null;
      return res?.[0] || null;
    }
  );

export const loadAllReviews = () =>
  cachedFetch(`all_reviews_${locale}`, TTL.fast, async () => {
    const res = (await cmsFetcher(allReviewsQuery, {
      locale,
    })) as unknown;

    if (!res) return [];
    if (Array.isArray(res)) return res as IExchangerReview[];
    if (Array.isArray((res as any).reviews))
      return (res as any).reviews as IExchangerReview[];
    if (Array.isArray((res as any)?.reviews?.data)) {
      return (res as any).reviews.data.map((item: any) => ({
        id: item?.id?.toString?.() ?? "",
        ...item?.attributes,
      }));
    }
    return [];
  });

// export const loadDirsTexts = (locale: "en" | "ru") =>
//   cachedFetch(
//     `dirsTexts_${locale}`,
//     TTL.slow,
//     () => cmsFetcher(dirsTextQuery, { locale }) as Promise<IDirText[]>
//   );
export const preloadDirTexts = () => {};

export const loadDirText = (sectionGive: string, sectionGet: string) =>
  cachedFetch(`dirText_${locale}_${sectionGive}_${sectionGet}`, TTL.slow, () =>
    cmsFetcher(dirsTextQuery, { locale })
  ).then((r) => r[0]) as Promise<IDirText>;

export const loadMassDirTextIds = ({ isSell }: { isSell: boolean }) =>
  cachedFetch(
    `massDirTexts_${locale}_${isSell ? "sell" : "buy"}`,
    TTL.slow,
    async () => {
      const massDirTextIds = (await cmsFetcher(massDirTextIdsQuery, {
        isSell,
      })) as IMassDirTextId[];
      return massDirTextIds;
    }
  );

export const loadMassDirText = ({
  massDirTextId,
  isSell,
}: {
  massDirTextId: IMassDirTextId;
  isSell: boolean;
}) =>
  cachedFetch(
    `${locale}_${isSell ? "sell" : "buy"}_${massDirTextId.code}_${
      massDirTextId.currency.code
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
      isSell ? "give" : "get"
    }`
  ) as Promise<IMassRate[]>;
