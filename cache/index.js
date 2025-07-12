const fs = require("fs");
const path = require("path");

const cacheFilePath = path.resolve(process.cwd(), "cache", "cachedData.json");

const validateCache = (data) => {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    console.warn("Invalid cache data structure. Returning empty object.");
    return;
  }

  // const now = Date.now();
  // // Check if the cache is still valid (5 minutes)
  // if (data?.timestamp && now - data.timestamp < 1000 * 60 * 5) {
  //   return data;
  // }
  return data;
};

const readCache = () => {
  try {
    if (!fs.existsSync(cacheFilePath)) return;

    const raw = fs.readFileSync(cacheFilePath, "utf8");
    try {
      return validateCache(JSON.parse(raw));
    } catch (parseErr) {
      console.error(`Error parsing cache file at ${cacheFilePath}:`, parseErr);
      return;
    }
  } catch (err) {
    console.error(`Error reading cache file at ${cacheFilePath}:`, err);
    return;
  }
};

const writeCache = (data) => {
  try {
    if (typeof data !== "object" || data === null) {
      console.warn("Attempted to write non-object cache data. Skipping.");
      return;
    }

    // Ensure cache directory exists
    fs.mkdirSync(path.dirname(cacheFilePath), { recursive: true });

    // Write to a temporary file first
    const tempFilePath = `${cacheFilePath}.tmp`;
    fs.writeFileSync(tempFilePath, JSON.stringify(data, null, 2), "utf8");

    // Atomic replace
    fs.renameSync(tempFilePath, cacheFilePath);
  } catch (err) {
    console.error(`Error writing cache file at ${cacheFilePath}:`, err);
  }
};

module.exports = { writeCache, readCache };
