const { readCache } = require("./cache"); // Adjust the path as necessary

const siteUrl = "https://p2pie.com";

const config = {
  siteUrl,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: "*", disallow: "/" }],
  },
  additionalPaths: async (config) => {
    const cachedData = readCache();
    let paths = [];
    cachedData.exchangePaths.forEach(({ params, locale }) => {
      paths.push({
        loc: `/${locale}${`/${params.exchange}`}`,
        lastmod: new Date().toISOString(),
      });
    });

    cachedData.articleCodes.forEach((code) =>
      paths.push({
        loc: `/ru/articles/${`/${code}`}`,
        lastmod: new Date().toISOString(),
      })
    );
    console.log("paths for sitemap collected: ", paths);
    return paths;
  },
};

module.exports = config;
