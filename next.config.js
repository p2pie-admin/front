/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const isDev = process.env.NODE_ENV === "development";

const cspHeader = `
  default-src 'self';
  script-src 'self' https://maps.googleapis.com https://maps.gstatic.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://maps.googleapis.com;
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
    domains: [
      "localhost",
      "cms.p2pie.help",
      "converter.p2pie.help",
      "server.p2pie.help",
      "cms.1nginx.space",
      "converter.1nginx.space",
      "server.1nginx.space",
      "cms.2nginx.space",
      "converter.2nginx.space",
      "server.2nginx.space",
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
        has: [{ type: "host", value: "www.p2pie.com" }],
        destination: "https://p2pie.com/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
