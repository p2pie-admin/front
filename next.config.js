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
      "p2pie.com",
      "p2pie.help",
      "cms.p2pie.help", // <-- Strapi prod
      "converter.p2pie.help", // <-- Strapi dev, if you have it
      "server.p2pie.help",
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
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
