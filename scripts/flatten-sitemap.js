const fs = require("fs");
const path = require("path");

const publicDir = path.join(process.cwd(), "public");
const sitemapIndexPath = path.join(publicDir, "sitemap.xml");
const firstChunkPath = path.join(publicDir, "sitemap-0.xml");

if (!fs.existsSync(firstChunkPath)) {
  process.exit(0);
}

const firstChunk = fs.readFileSync(firstChunkPath, "utf8");

if (!firstChunk.includes("<urlset")) {
  throw new Error("sitemap-0.xml does not contain a urlset");
}

fs.writeFileSync(sitemapIndexPath, firstChunk);
console.log("[sitemap] Flattened sitemap.xml from sitemap-0.xml");
