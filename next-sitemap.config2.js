const readCache = require("./cache");

module.exports = {
  siteUrl: "https://p2pie.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  additionalPaths: async (config) => {
    const cachedData = readCache();

    cachedData.paths.forEach(({ params, locale }) => {
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
