const { readCache } = require("./cache"); // Adjust the path as necessary

const siteUrl = "https://www.p2pie.com";

const config = {
  siteUrl,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
  additionalPaths: async (config) => {
    const cachedData = readCache();
    let paths = [];
    cachedData.exchangePaths.forEach(({ params, locale }) => {
      const cityPath = params.city ? params.city.join("/") : "";
      const fullPath = cityPath
        ? `/exchange/${cityPath}/${params.slug}`
        : `/exchange/${params.slug}`;

      paths.push({
        loc: `/${locale}${fullPath}`,
        lastmod: new Date().toISOString(),
      });
    });
    console.log("paths for sitemap collected: ", paths);
    return paths;
  },
};

module.exports = config;
