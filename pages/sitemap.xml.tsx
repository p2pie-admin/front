import { GetServerSideProps } from "next";
import { collectSitemapEntries, renderSitemapXml } from "../cache/sitemap";

// Dynamic sitemap: built from live data on request (cached 10 min), see cache/sitemap.ts.
// The build-time file from next-sitemap is deleted in postbuild so this route is served.
const SitemapPage = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let xml = renderSitemapXml([{ loc: "/" }]);
  try {
    const entries = await collectSitemapEntries();
    if (entries?.length) xml = renderSitemapXml(entries);
  } catch (error) {
    console.error("[sitemap] failed to collect entries:", error);
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
