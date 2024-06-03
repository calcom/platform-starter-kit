import { authConfig } from "./auth/config";
import NextAuth from "next-auth";
import type { MiddlewareConfig } from "next/server";

export default NextAuth(authConfig).auth;

export const config: MiddlewareConfig = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
