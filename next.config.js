/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config");
const nextConfig = {
  i18n,
  typescript: {
    //
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["localhost", "p2pie.com"],
  },
  // experimental: {
  //   // выключил, потому что https://github.com/vercel/next.js/issues/32360 для CircularMenu
  //   esmExternals: false,
  // },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = {
  async redirects() {
    return [
      {
        source: "/:path*/",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/",
        destination: "",
        permanent: true,
      },
      {
        source: "/ru/:path*", // Matches any path under /ru/
        destination: "/:path*", // Redirects to the same path without /ru/
        permanent: true, // Indicates a permanent redirect (301)
      },
    ];
  },
};
module.exports = withBundleAnalyzer(nextConfig);
