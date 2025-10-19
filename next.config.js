/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  i18n,
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    domains: [
      "localhost",

      "cms.rusrates.help",
      "converter.rusrates.help",
      "server.rusrates.help",

      "cms.1nginx.space",
      "converter.1nginx.space",
      "server.1nginx.space",

      "cms.2nginx.space",
      "converter.2nginx.space",
      "server.2nginx.space",

      "cms.rusrates.help",
      "converter.rusrates.help",
      "server.rusrates.help",
    ],
  },

  async redirects() {
    return [
      {
        source: "/:path*/",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/ru/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.rusrates.com" }],
        destination: "https://rusrates.com/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
