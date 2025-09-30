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
      "converter.p2pie.help", // <-- Strapi dev
      "server.p2pie.help",
      "rusrates.com",
      "rusrates.help",
      "cms.rusrates.help", // <-- Strapi prod
      "converter.rusrates.help", // <-- Strapi dev
      "server.rusrates.help",

      // 👇 Add your reverse-proxied domains
      "1nginx.space",
      "cms.1nginx.space",
      "converter.1nginx.space",
      "server.1nginx.space",
      "stats.1nginx.space",

      "2nginx.space",
      "cms.2nginx.space",
      "converter.2nginx.space",
      "server.2nginx.space",
      "stats.2nginx.space",
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
