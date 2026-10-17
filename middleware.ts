// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Interface language on the same URLs: English visitors are rewritten to the generated /xen/* copies.
// Rule: cookie `lang` wins; otherwise any Russian-family language in Accept-Language → ru, other languages → en,
// no header at all (crawlers) → ru. Direct /xen/* links are sent back to the public URL with the cookie set.
// Links may force the language with `?lang=en` / `?lang=ru` (any page): cookie set, 307 to the URL without it.
const EN_PREFIX = "/xen";
const RU_FAMILY = /(^|,)\s*(ru|uk|be|kk|ky|tg|uz|hy|az|ka|tk|ro-md)(-[a-z]+)?\s*(;|,|$)/i;
const NOT_A_PAGE = /^\/(api|_next\/static|_next\/image|static|uploads)(\/|$)|\.[a-z0-9]+$/i;

const pickLocale = (req: NextRequest): "ru" | "en" => {
  const cookie = req.cookies.get("lang")?.value;
  if (cookie === "ru" || cookie === "en") return cookie;
  const accept = (req.headers.get("accept-language") || "").trim();
  if (!accept || RU_FAMILY.test(accept)) return "ru";
  return "en";
};

const LANG_COOKIE = { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" as const };

const languageRoute = (req: NextRequest) => {
  const url = req.nextUrl.clone();
  const { pathname } = url;
  // `?lang=en|ru` on any page: remember the choice and send the visitor to the clean URL. A redirect keeps the
  // parameter out of the index (no duplicate URLs, the canonical page stays the only one crawlers see).
  const langParam = (url.searchParams.get("lang") || "").toLowerCase();
  if (url.searchParams.has("lang") && !NOT_A_PAGE.test(pathname)) {
    url.searchParams.delete("lang");
    if (pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`)) {
      url.pathname = pathname.slice(EN_PREFIX.length) || "/";
    }
    const res = NextResponse.redirect(url, 307);
    if (langParam === "en" || langParam === "ru") res.cookies.set("lang", langParam, LANG_COOKIE);
    res.headers.set("X-Robots-Tag", "noindex");
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }
  if (pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`)) {
    url.pathname = pathname.slice(EN_PREFIX.length) || "/";
    const res = NextResponse.redirect(url, 307);
    res.cookies.set("lang", "en", LANG_COOKIE);
    return res;
  }
  if (NOT_A_PAGE.test(pathname) || pathname === "/sitemap.xml" || pathname === "/rss.xml") return null;
  if (pickLocale(req) !== "en") {
    const res = NextResponse.next();
    res.headers.set("Vary", "Cookie, Accept-Language");
    return res;
  }
  url.pathname = pathname === "/" ? EN_PREFIX : `${EN_PREFIX}${pathname}`;
  const res = NextResponse.rewrite(url);
  res.headers.set("Vary", "Cookie, Accept-Language");
  return res;
};

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const hostname = host.split(":")[0].toLowerCase();
  const base = (process.env.NEXT_PUBLIC_BASE || "p2pie.com")
    .trim()
    .replace(/^['"]|['"]$/g, "");
  const canonicalHost = base.replace(/^https?:\/\//, "").replace(/\/+$/, "");

  if (canonicalHost && hostname === `www.${canonicalHost}`) {
    const url = req.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = canonicalHost;
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  const expectedHost = base ? `front.${base}` : "";
  const isLocal =
    host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const isInternalHost = host === "front" || host.startsWith("front:");
  const isExpectedHost =
    !!expectedHost &&
    (host === expectedHost || host.startsWith(`${expectedHost}:`));

  if (expectedHost && !isLocal && (isInternalHost || isExpectedHost)) {
    const headers = new Headers(req.headers);
    headers.set("x-forwarded-host", expectedHost);
    headers.set("x-forwarded-proto", "https");
    return NextResponse.next({ request: { headers } });
  }

  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const lang = languageRoute(req);
  if (lang) return lang;

  // Match any slug containing "cash" but not already ending with "-in-moscow"
  // if (
  //   pathname &&
  //   (pathname.startsWith("cash-") || pathname.includes("-cash-")) &&
  //   !pathname.includes("-in-")
  // ) {
  //   url.pathname = `${pathname}-in-moscow`;
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}
