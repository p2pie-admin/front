const { readCache } = require("./cache"); // Adjust the path as necessary

const siteUrl = "https://p2pie.com";
const locales = ["en", "ru"];

const config = {
  siteUrl,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: "*", disallow: "/" }],
  },
  additionalPaths: async (config) => {
    const cachedData = readCache();
    let paths = [];
    Object.keys(cachedData.slugToCodes).forEach((path) => {
      locales.forEach((locale) => {
        paths.push({
          loc: `/${locale}${`/${path}`}`,
          lastmod: new Date().toISOString(),
        });
      });
    });

    cachedData.enData.articleCodes.forEach((code) =>
      paths.push({
        loc: `/ru/articles/${`/${code}`}`,
        lastmod: new Date().toISOString(),
      })
    );

    cachedData.ruData.articleCodes.forEach((code) =>
      paths.push({
        loc: `/en/articles/${`/${code}`}`,
        lastmod: new Date().toISOString(),
      })
    );
    console.log("paths for sitemap collected: ", paths.length);
    return paths;
  },
};

module.exports = config;
