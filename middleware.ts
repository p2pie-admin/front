// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

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
