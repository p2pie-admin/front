// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const csp = (nonce: string) => {
  const directives = [
    "default-src 'self'",
    [
      "script-src",
      `'self'`,
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      "https://maps.googleapis.com",
      "https://maps.gstatic.com",
      "https://va.vercel-scripts.com",
      "https://va.vercel-analytics.com",
    ].join(" "),
    [
      "style-src",
      `'self'`,
      `'nonce-${nonce}'`,
      "'unsafe-inline'",
      "https://fonts.googleapis.com",
      "https://maps.googleapis.com",
    ].join(" "),
    [
      "img-src",
      `'self'`,
      "data:",
      "blob:",
      "https://maps.gstatic.com",
      "https://maps.googleapis.com",
      "https://*.gstatic.com",
      "https://*.googleapis.com",
    ].join(" "),
    [
      "connect-src",
      `'self'`,
      "https://maps.googleapis.com",
      "https://maps.gstatic.com",
      "https://*.googleapis.com",
      "https://*.gstatic.com",
      "https://va.vercel-analytics.com",
      "https://va.vercel-scripts.com",
    ].join(" "),
    [
      "font-src",
      `'self'`,
      "https://fonts.gstatic.com",
      "data:",
    ].join(" "),
    [
      "frame-src",
      `'self'`,
      "https://*.google.com",
      "https://*.googleapis.com",
    ].join(" "),
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests",
  ];

  return directives.join("; ");
};

export function middleware(req: NextRequest) {
  const nonce = crypto.randomUUID();
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", csp(nonce));
  response.headers.set("X-Nonce", nonce);

  return response;
}
