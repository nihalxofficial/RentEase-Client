import { NextResponse } from "next/server";
import { getUserSession } from "./lib/core/session";

export async function proxy(request) {
  const user = await getUserSession();
  const pathname = request.nextUrl.pathname;

  // If logged in, redirect away from login/signup
  //   if (user && (pathname === "/login" || pathname === "/signup")) {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }

  // If not logged in, redirect away from protected routes
  // if (!user && (pathname.startsWith("/dashboard") || pathname.startsWith("/all-pets/"))) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // If not logged in, redirect to login with callbackUrl
  if (!user && pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
