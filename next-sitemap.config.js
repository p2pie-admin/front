const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = {
  siteUrl: process.env.SITE_URL || "https://p2pie.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: ["/"], // block everything
      },
    ],
  },
  // Collect extra paths from Redis
  additionalPaths: async (config) => {
    const cached = await redis.get("sitemap:paths");
    const paths = cached?.data || [];

    return paths.map((p) => ({
      loc: p,
      lastmod: new Date().toISOString(),
    }));
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
