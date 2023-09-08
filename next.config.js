/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config");
const nextConfig = {
  i18n,
  typescript: {
    //
    ignoreBuildErrors: true,
  },
  // experimental: {
  //   // выключил, потому что https://github.com/vercel/next.js/issues/32360 для CircularMenu
  //   esmExternals: false,
  // },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
