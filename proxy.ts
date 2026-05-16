import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedin = !!req.auth;
  const { pathname } = req.nextUrl;

  // 1. If at login and already logged in, go to dashboard
  if (pathname === "/login" && isLoggedin && req.auth?.user?.id) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // 2. If at dashboard and NOT logged in, go to login
  if (pathname.startsWith("/dashboard") && !isLoggedin) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
