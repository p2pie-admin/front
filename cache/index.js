const fs = require("fs");
const path = require("path");

const cacheFilePath = path.resolve(process.cwd(), "cache", "cachedData.json");
const isProduction = process.env.NODE_ENV === "production";

const readCache = () => {
  try {
    if (fs.existsSync(cacheFilePath)) {
      const data = fs.readFileSync(cacheFilePath, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading cache file", err);
  }
  return {};
};

const writeCache = (data) => {
  if (isProduction) {
    console.warn("writeCache is disabled in production.");
    return;
  }

  try {
    const currentCache = readCache(); // Read existing cache
    const mergedCache = { ...currentCache, ...data }; // Merge with new data
    fs.mkdirSync(path.dirname(cacheFilePath), { recursive: true });
    fs.writeFileSync(
      cacheFilePath,
      JSON.stringify(mergedCache, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error("Error writing cache file", err);
  }
};

module.exports = { writeCache, readCache };
