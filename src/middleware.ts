import { authConfig } from "./auth/config.edge";
import NextAuth from "next-auth";
import { NextResponse, type MiddlewareConfig } from "next/server";

export default NextAuth(authConfig).auth((req) => {
  if (req.nextUrl.pathname === "/dashboard/settings") {
    return NextResponse.redirect(new URL("/dashboard/settings/profile", req.url));
  }
});

export const config: MiddlewareConfig = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
