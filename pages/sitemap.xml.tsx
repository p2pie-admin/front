import { GetServerSideProps } from "next";
import { collectSitemapEntries, renderSitemapXml } from "../cache/sitemap";

// Dynamic sitemap: built from live data on request, see cache/sitemap.ts.
// The build-time file from next-sitemap is deleted in postbuild so this route is served.
// Prod runs with USE_REDIS=false, so cachedFetch does not cache and a build takes 6–10 s;
// keep the rendered XML in process memory and refresh it in the background (stale-while-revalidate),
// so crawlers always get an instant answer.
const FRESH_MS = 10 * 60 * 1000;
let memo: { xml: string; at: number } | null = null;
let refreshing: Promise<string | null> | null = null;

const build = (): Promise<string | null> =>
  (refreshing ??= collectSitemapEntries()
    .then((entries) => {
      if (!entries?.length) return null;
      const xml = renderSitemapXml(entries);
      memo = { xml, at: Date.now() };
      return xml;
    })
    .catch((error) => {
      console.error("[sitemap] failed to collect entries:", error);
      return null;
    })
    .finally(() => {
      refreshing = null;
    }));

const SitemapPage = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let xml: string;
  if (memo) {
    xml = memo.xml;
    if (Date.now() - memo.at > FRESH_MS) void build();
  } else {
    xml = (await build()) ?? renderSitemapXml([{ loc: "/" }]);
  }

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=1800, stale-while-revalidate=86400",
  );
  res.write(xml);
  res.end();
  return { props: {} };
};

export default SitemapPage;
