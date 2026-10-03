const fs = require("fs");
const path = require("path");

// sitemap.xml is served dynamically by pages/sitemap.xml.tsx. next-sitemap still runs in
// postbuild for robots.txt, but any sitemap files it writes into public/ would shadow the
// dynamic route (static files win), so remove them here.
const publicDir = path.join(process.cwd(), "public");

for (const name of fs.readdirSync(publicDir)) {
  if (/^sitemap(-\d+)?\.xml$/.test(name)) {
    fs.unlinkSync(path.join(publicDir, name));
    console.log(`[sitemap] removed build-time ${name}; dynamic route serves it`);
  }
}
