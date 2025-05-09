const fs = require("fs");
const path = require("path");

const cacheFilePath = path.resolve(process.cwd(), "cache", "cachedData.json");
const isProduction = process.env.NODE_ENV === "production";

const validateCache = (data) => {
  if (typeof data !== "object" || data === null) {
    console.warn("Invalid cache data structure. Returning empty object.");
    return {};
  }
  return data;
};

const readCache = () => {
  try {
    if (fs.existsSync(cacheFilePath)) {
      const data = fs.readFileSync(cacheFilePath, "utf8");
      try {
        console.log("readCache length: ", data.length);
        return validateCache(JSON.parse(data));
      } catch (parseErr) {
        console.error(`Error parsing cache file at ${cacheFilePath}`, parseErr);
        return {};
      }
    }
    return {};
  } catch (err) {
    console.error(`Error reading cache file at ${cacheFilePath}`, err);
    return {};
  }
};

const writeCache = (data) => {
  try {
    const currentCache = readCache();
    const mergedCache = { ...currentCache, ...data };

    try {
      fs.mkdirSync(path.dirname(cacheFilePath), { recursive: true });
    } catch (err) {
      console.error(
        `Error creating cache directory at ${path.dirname(cacheFilePath)}`,
        err
      );
      return;
    }

    const tempFilePath = `${cacheFilePath}.tmp`;
    fs.writeFileSync(
      tempFilePath,
      JSON.stringify(mergedCache, null, 2),
      "utf8"
    );
    fs.renameSync(tempFilePath, cacheFilePath); // Atomic rename
  } catch (err) {
    console.error(`Error writing cache file at ${cacheFilePath}`, err);
  }
};

module.exports = { writeCache, readCache };
