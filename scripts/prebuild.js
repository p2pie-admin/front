const fs = require("fs");
const path = require("path");
const { initCMSFetcher, initParserFetcher } = require("../services/fetchers");
const cacheFilePath = path.resolve(process.cwd(), "cache", "cachedData.json");

const populateCache = async () => {
  try {
    console.info("[Prebuild] Starting cache population...");

    const parserFetcher = initParserFetcher();
    const possiblePairs = await parserFetcher("possible_pairs");

    const cmsFetcher = initCMSFetcher();
    const { selector } = await cmsFetcher(selectorQuery);
    const { parserSetting } = await cmsFetcher(citiesQuery);

    const cacheData = {
      possiblePairs,
      selector,
      parserSetting,
    };

    fs.mkdirSync(path.dirname(cacheFilePath), { recursive: true });
    fs.writeFileSync(cacheFilePath, JSON.stringify(cacheData, null, 2), "utf8");

    console.info("[Prebuild] Cache populated successfully.");
  } catch (err) {
    console.error("[Prebuild] Error populating cache:", err);
    process.exit(1);
  }
};

populateCache();