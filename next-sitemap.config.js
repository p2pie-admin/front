const { Redis } = require("@upstash/redis");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

function createRedis() {
  const useRedis = String(process.env.USE_REDIS).toLowerCase() === "true";
  if (!useRedis) {
    console.warn("[sitemap] USE_REDIS is false. Skipping Redis.");
    return null;
  }
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    console.warn(
      "[sitemap] Upstash credentials missing. Falling back to static paths."
    );
    return null;
  }
  try {
    return new Redis({ url, token });
  } catch (error) {
    console.error("[sitemap] Failed to init Redis client:", error);
    return null;
  }
}

const redis = createRedis();
function resolveAllowCrawlers() {
  if (
    Object.prototype.hasOwnProperty.call(
      process.env,
      "NEXT_PUBLIC_ALLOW_CRAWLERS"
    )
  ) {
    return (
      String(process.env.NEXT_PUBLIC_ALLOW_CRAWLERS).toLowerCase() !== "false"
    );
  }
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return true;
  const parsed = dotenv.parse(fs.readFileSync(envPath));
  if (!Object.prototype.hasOwnProperty.call(parsed, "NEXT_PUBLIC_ALLOW_CRAWLERS")) {
    return true;
  }
  return String(parsed.NEXT_PUBLIC_ALLOW_CRAWLERS).toLowerCase() !== "false";
}

const allowCrawlers = resolveAllowCrawlers();
const siteUrl = process.env.SITE_URL || "https://p2pie.com";
const sitemapDirectionMinRates = Number(process.env.SITEMAP_DIRECTIONS_MIN_RATES || 2);
const defaultPriority = 0.7;
const homePriority = 1;

const normalizeEnvValue = (value) => {
  if (typeof value !== "string") return value;
  return value.trim().replace(/^['"]|['"]$/g, "");
};

const normalizeHost = (value, fallback = "p2pie.com") =>
  (normalizeEnvValue(value) || fallback)
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");

const serviceIndex =
  normalizeEnvValue(process.env.NEXT_PUBLIC_INDEX) === "0"
    ? ""
    : normalizeEnvValue(process.env.NEXT_PUBLIC_INDEX) || "";
const publicBase = normalizeHost(process.env.NEXT_PUBLIC_BASE);
const cmsGraphqlUrl =
  normalizeEnvValue(process.env.SITEMAP_CMS_GRAPHQL_URL) ||
  `https://cms${serviceIndex}.${publicBase}/graphql`;
const parserBaseUrl =
  normalizeEnvValue(process.env.SITEMAP_PARSER_BASE_URL) ||
  `https://server${serviceIndex}.${publicBase}`;

const massDirTextIdsQuery = `
  query massDirTextIdsQuery($locale: I18NLocaleCode, $isSell: Boolean) {
    massDirsTexts(
      locale: $locale
      pagination: { start: 0, limit: 200000 }
      filters: { isSell: { eq: $isSell } }
    ) {
      data {
        id
        attributes {
          code
          currency {
            data {
              id
              attributes {
                code
              }
            }
          }
          isSell
        }
      }
    }
  }
`;

const selectorQuery = `
  query Selector {
    selector {
      data {
        id
        attributes {
          sections {
            id
            en_title
            pm_groups(
              pagination: { start: 0, limit: 2000 }
              filters: { countries: { null: true } }
            ) {
              data {
                id
                attributes {
                  en_name
                  ru_name
                  countries
                  prefix
                  color
                  options {
                    ... on ComponentSelectorSubgroup {
                      id
                      name
                      code
                      alternative_codes
                      currency {
                        data {
                          id
                          attributes {
                            code
                            accuracy
                          }
                        }
                      }
                    }
                    ... on ComponentSelectorCurrency {
                      id
                      currency {
                        data {
                          id
                          attributes {
                            code
                            accuracy
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const articleCodesQuery = `
  query Articles($locale: I18NLocaleCode) {
    articles(
      locale: $locale
      pagination: { start: 0, limit: 1000 }
      filters: { or: [{ type: { ne: "page" } }, { type: { null: true } }] }
    ) {
      data {
        attributes {
          code
        }
      }
    }
  }
`;

const exchangerSlugsQuery = `
  query SitemapExchangers {
    exchangers(
      pagination: { start: 0, limit: 2000 }
      filters: {
        status: { in: ["active", "suspended"] }
        ref_link: { notNull: true }
        rates_link: { notNull: true }
      }
    ) {
      data {
        attributes {
          name
        }
      }
    }
  }
`;

const p2pMakerSlugsQuery = `
  query SitemapP2PMakers {
    p2PMakers(
      pagination: { start: 0, limit: 2000 }
      filters: { status: { in: ["active", "suspended", "disabled"] } }
    ) {
      data {
        id
        attributes {
          telegram_username
        }
      }
    }
  }
`;

const staticSitemapPaths = [
  "/about",
  "/articles",
  "/contacts",
  "/exchangers",
  "/faq",
  "/map",
  "/map/moscow",
  "/p2p",
  "/partnership",
];

const graphqlRequest = async (query, variables) => {
  const response = await fetch(cmsGraphqlUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map((error) => error.message).join("; "));
  }

  return json.data;
};

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed ${response.status} ${response.statusText}: ${url}`);
  }
  return response.json();
};

const normalizePath = (value) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  let pathname = trimmed;
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      pathname = new URL(trimmed).pathname;
    } catch {
      return null;
    }
  }

  const normalized = (pathname.startsWith("/") ? pathname : `/${pathname}`)
    .replace(/\/+/g, "/")
    .replace(/\/$/, "");

  return normalized || "/";
};

const getOptionCurrency = (option) => {
  const data = option?.currency?.data;
  if (!data?.attributes?.code) return null;
  return {
    id: data.id,
    ...data.attributes,
  };
};

const getOptionCode = (option, prefix) => {
  const currencyCode = option?.currency?.code?.toUpperCase();
  if (!currencyCode) return "";
  if (option?.code) return option.code.toUpperCase();
  if (prefix && prefix.toUpperCase() !== currencyCode) {
    return `${prefix.toUpperCase()}${currencyCode}`;
  }
  return currencyCode;
};

const getPmsFromPmGroup = (pmGroup) => {
  if (!pmGroup?.options?.length) return [];

  return pmGroup.options.flatMap((option) => {
    const code = getOptionCode(option, pmGroup.prefix);
    if (!code) return [];

    return {
      pm_group_id: pmGroup.id,
      code,
      en_name: pmGroup.en_name,
      ru_name: pmGroup.ru_name,
      subgroup_name: option.name?.toUpperCase() || null,
      currency: option.currency,
      color: pmGroup.color,
      section: pmGroup.section || "",
    };
  });
};

const getPmsFromSelector = (selector) => {
  const sections = selector?.sections || [];
  return sections.flatMap((section) => {
    const pmGroups = section.pm_groups?.data || [];
    return pmGroups.flatMap((pmGroup) => {
      const attributes = pmGroup.attributes || {};
      const options = (attributes.options || [])
        .map((option) => ({
          ...option,
          currency: getOptionCurrency(option),
        }))
        .filter((option) => option.currency?.code);

      return getPmsFromPmGroup({
        id: pmGroup.id,
        ...attributes,
        options,
        section: section.en_title?.toLowerCase() || "",
      });
    });
  });
};

const pmsToSlug = ({ givePm, getPm }) => {
  if (!givePm || !getPm) return "";
  const slug = `${givePm.en_name}-${givePm.currency.code}${
    givePm.subgroup_name ? `-${givePm.subgroup_name}` : ""
  }-to-${getPm.en_name}-${getPm.currency.code}${
    getPm.subgroup_name ? `-${getPm.subgroup_name}` : ""
  }`;

  return slug.toLowerCase().replaceAll(" ", "").replaceAll("/", "");
};

const exchangerNameToSlug = (name) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/-+/g, "-");

const normalizeTelegramUsername = (username) =>
  (username || "").trim().replace(/^@/, "");

const fetchArticlePaths = async () => {
  const data = await graphqlRequest(articleCodesQuery, { locale: "ru" });
  const items = data?.articles?.data || [];
  return items
    .map((item) => item?.attributes?.code)
    .filter(Boolean)
    .map((code) => `/articles/${code.toLowerCase()}`);
};

const fetchExchangerPaths = async () => {
  const data = await graphqlRequest(exchangerSlugsQuery);
  const items = data?.exchangers?.data || [];
  return items
    .map((item) => item?.attributes?.name)
    .filter(Boolean)
    .map((name) => `/exchangers/${exchangerNameToSlug(name)}`);
};

const fetchP2PPaths = async () => {
  const data = await graphqlRequest(p2pMakerSlugsQuery);
  const items = data?.p2PMakers?.data || [];
  return items
    .map((item) => {
      const slug = normalizeTelegramUsername(item?.attributes?.telegram_username) || item?.id;
      return slug ? `/p2p/${slug}` : null;
    })
    .filter(Boolean);
};

const fetchMassDirectionSlugs = async (isSell) => {
  const data = await graphqlRequest(massDirTextIdsQuery, {
    locale: "ru",
    isSell,
  });
  const items = data?.massDirsTexts?.data || [];

  return items
    .map((item) => {
      const attributes = item?.attributes || {};
      const code = attributes.code;
      const currencyCode = attributes.currency?.data?.attributes?.code;
      if (!code || !currencyCode) return null;
      return `${code.toLowerCase()}-for-${currencyCode.toLowerCase()}`;
    })
    .filter(Boolean);
};

const fetchMassDirectionPaths = async () => {
  const [buySlugs, sellSlugs] = await Promise.all([
    fetchMassDirectionSlugs(false),
    fetchMassDirectionSlugs(true),
  ]);
  const slugs = Array.from(new Set([...buySlugs, ...sellSlugs]));

  return slugs.flatMap((slug) => [`/buy/${slug}`, `/sell/${slug}`]);
};

const fetchExchangeDirectionPaths = async () => {
  const [dirs, selectorData] = await Promise.all([
    fetchJson(`${parserBaseUrl}/dirs`),
    graphqlRequest(selectorQuery),
  ]);

  const pms = getPmsFromSelector(selectorData?.selector?.data?.attributes);
  const pmMap = new Map(pms.map((pm) => [pm.code.toUpperCase(), pm]));

  return Object.entries(dirs || {})
    .filter(([, rates]) => Number(rates) >= sitemapDirectionMinRates)
    .map(([direction]) => {
      const [giveCode, getCode] = direction.split("_");
      const slug = pmsToSlug({
        givePm: pmMap.get(giveCode?.toUpperCase()),
        getPm: pmMap.get(getCode?.toUpperCase()),
      });
      return slug ? `/${slug}` : null;
    })
    .filter(Boolean);
};

const readCachedSitemapPaths = async () => {
  if (!redis) return [];
  try {
    const cached = await redis.get("sitemap:paths");
    return cached?.data || [];
  } catch (error) {
    console.error("[sitemap] Failed to read cached paths:", error);
    return [];
  }
};

const collectDynamicSitemapPaths = async () => {
  const [
    cachedPaths,
    articlePaths,
    exchangerPaths,
    p2pPaths,
    massDirectionPaths,
    exchangePaths,
  ] = await Promise.all([
    readCachedSitemapPaths(),
    fetchArticlePaths().catch((error) => {
      console.error("[sitemap] Failed to fetch article paths:", error);
      return [];
    }),
    fetchExchangerPaths().catch((error) => {
      console.error("[sitemap] Failed to fetch exchanger paths:", error);
      return [];
    }),
    fetchP2PPaths().catch((error) => {
      console.error("[sitemap] Failed to fetch P2P paths:", error);
      return [];
    }),
    fetchMassDirectionPaths().catch((error) => {
      console.error("[sitemap] Failed to fetch mass directions:", error);
      return [];
    }),
    fetchExchangeDirectionPaths().catch((error) => {
      console.error("[sitemap] Failed to fetch exchange directions:", error);
      return [];
    }),
  ]);

  return Array.from(
    new Set(
      [
        ...staticSitemapPaths,
        ...cachedPaths,
        ...articlePaths,
        ...exchangerPaths,
        ...p2pPaths,
        ...massDirectionPaths,
        ...exchangePaths,
      ]
        .map(normalizePath)
        .filter(Boolean)
    )
  );
};

const toSitemapEntry = (loc, config) => ({
  loc,
  lastmod: new Date().toISOString(),
  changefreq: config.changefreq || "daily",
  priority: loc === "/" ? homePriority : config.priority ?? defaultPriority,
});

const robotsDisallow = [
  "/api/",
  "/admin/",
  "/dashboard/",
  "/account/",
  "/profile/",
  "/settings/",
  "/auth/",
  "/login",
  "/logout",
  "/register",
  "/signup",
  "/signin",
  "/forgot-password",
  "/reset-password",
  "/verify",
  "/checkout/",
  "/cart/",
  "/payment/",
  "/orders/",
  "/favorites/",
  "/messages/",
  "/notifications/",
  "/search",
  "/search/",
  "/*?*",
  "/*?utm_",
  "/*?ref=",
  "/*?sort=",
  "/*?filter=",
  "/*?page=",
  "/preview/",
  "/draft/",
  "/404",
];

const robotsTxt = [
  "User-agent: *",
  "",
  ...robotsDisallow.map((path) => `Disallow: ${path}`),
  "",
  "Sitemap: https://p2pie.com/sitemap.xml",
  "",
].join("\n");

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  priority: defaultPriority,
  transform: async (config, loc) => toSitemapEntry(loc, config),
  robotsTxtOptions: allowCrawlers
    ? {
        policies: [
          {
            userAgent: "*",
            disallow: robotsDisallow,
          },
        ],
        transformRobotsTxt: async () => robotsTxt,
      }
    : {
        policies: [
          {
            userAgent: "*",
            disallow: "/",
          },
        ],
        transformRobotsTxt: async () =>
          ["User-agent: *", "Disallow: /", ""].join("\n"),
      },
  exclude: ["/404", "/auth/*"],
  additionalPaths: async (config) => {
    const paths = await collectDynamicSitemapPaths();
    console.log(`[sitemap] Collected ${paths.length} dynamic path(s).`);
    return paths.map((loc) => toSitemapEntry(loc, config));
  },
};

// const { readCache } = require("./cache"); // Adjust the path as necessary

// const siteUrl = "https://p2pie.com";
// const locales = ["en", "ru"];

// const config = {
//   siteUrl,
//   generateRobotsTxt: true,
//   robotsTxtOptions: {
//     policies: [{ userAgent: "*", disallow: "/" }],
//   },
//   additionalPaths: async (config) => {
//     const cachedData = readCache();
//     let paths = [];
//     Object.keys(cachedData.slugToCodes).forEach((path) => {
//       locales.forEach((locale) => {
//         paths.push({
//           loc: `/${locale}${`/${path}`}`,
//           lastmod: new Date().toISOString(),
//         });
//       });
//     });

//     const enArticles = cachedData[`enData`]?.articles || [];
//     const ruArticles = cachedData[`ruData`]?.articles || [];

//     enArticles.forEach((article) => {
//       paths.push({
//         loc: `/en/${`${article.code.toLowerCase()}`}`,
//         lastmod: new Date().toISOString(),
//       });
//     });

//     ruArticles.forEach((article) => {
//       paths.push({
//         loc: `/ru/${`${article.code.toLowerCase()}`}`,
//         lastmod: new Date().toISOString(),
//       });
//     });

//     const exchangerSlugs = cachedData?.exchangerSlugs;

//     if (exchangerSlugs) {
//       exchangerSlugs.forEach((exchangerSlug) => {
//         paths.push({
//           loc: `/exchangers/${exchangerSlug}`,
//           lastmod: new Date().toISOString(),
//         });
//       });
//     }

//     console.log("paths for sitemap collected: ", paths.length);
//     return paths;
//   },
// };

// module.exports = config;
