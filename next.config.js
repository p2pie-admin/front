/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const isDev = process.env.NODE_ENV === "development";
const localePrefix = i18n?.defaultLocale;

const cspHeader = `
  default-src 'self';
  script-src 'self' https://maps.googleapis.com https://maps.gstatic.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com https://cms.p2pie.help https://cms2.p2pie.help https://cms.p2pie.com https://cms2.p2pie.com https://cms.1nginx.space https://cms2.1nginx.space https://cms.2nginx.space https://cms2.2nginx.space https://converter.p2pie.help https://converter2.p2pie.help https://converter.p2pie.com https://converter2.p2pie.com https://converter.1nginx.space https://converter2.1nginx.space https://converter.2nginx.space https://converter2.2nginx.space;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://maps.googleapis.com https://cms.p2pie.help https://cms2.p2pie.help https://server.p2pie.help https://server2.p2pie.help https://converter.p2pie.help https://converter2.p2pie.help https://cms.p2pie.com https://cms2.p2pie.com https://server.p2pie.com https://server2.p2pie.com https://converter.p2pie.com https://converter2.p2pie.com https://cms.1nginx.space https://cms2.1nginx.space https://server.1nginx.space https://server2.1nginx.space https://converter.1nginx.space https://converter2.1nginx.space https://cms.2nginx.space https://cms2.2nginx.space https://server.2nginx.space https://server2.2nginx.space https://converter.2nginx.space https://converter2.2nginx.space;
  frame-src 'self' https://www.google.com;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig = {
  i18n,
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    // Only enable CSP in production
    if (!isDev) {
      return [
        {
          source: "/(.*)",
          headers: [{ key: "Content-Security-Policy", value: cspHeader }],
        },
      ];
    }
    return [];
  },
  images: {
    unoptimized: true,
    domains: [
      "localhost",
      "cms2.p2pie.help",
      "cms.p2pie.help",
      "cms2.p2pie.com",
      "cms.p2pie.com",
      "converter2.p2pie.help",
      "converter.p2pie.help",
      "converter2.p2pie.com",
      "converter.p2pie.com",
      "server2.p2pie.help",
      "server.p2pie.help",
      "server2.p2pie.com",
      "server.p2pie.com",
      "cms2.1nginx.space",
      "converter2.1nginx.space",
      "server2.1nginx.space",
      "cms2.2nginx.space",
      "converter2.2nginx.space",
      "server2.2nginx.space",
      "cms.1nginx.space",
      "converter.1nginx.space",
      "server.1nginx.space",
      "cms.2nginx.space",
      "converter.2nginx.space",
      "server.2nginx.space",
    ],
  },
  async redirects() {
    const redirects = [
      {
        source: "/:path*/",
        destination: "/:path*",
        permanent: true,
      },
    ];

    if (localePrefix) {
      redirects.push({
        source: `/${localePrefix}/:path*`,
        destination: "/:path*",
        permanent: true,
      });
    }

    redirects.push({
      source: "/:path*",
      has: [{ type: "host", value: "www.p2pie.com" }],
      destination: "https://p2pie.com/:path*",
      permanent: true,
    });

    return redirects;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
