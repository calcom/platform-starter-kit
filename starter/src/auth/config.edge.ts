import { PrismaAdapter } from "@auth/prisma-adapter";
import { type Session, type NextAuthConfig, type DefaultSession } from "next-auth";
import { db } from "prisma/client";
import "server-only";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
    };
  }
}

export const authConfig = {
  logger: {
    debug: (message, metadata) => console.debug(message, { metadata }),
    error: (error) => console.error(error),
    warn: (message) => console.warn(message),
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    signIn: async ({ user }) => {
      if (user.id) {
        return true;
      }
      return false;
    },
    jwt: async ({ token, user, session, trigger }) => {
      if (trigger === "update") {
        if ((session as Session)?.user?.name) token.name = (session as Session).user.name;
        if ((session as Session)?.user?.username) token.username = (session as Session).user.username;
      }
      if (trigger === "signIn") {
        if ((session as Session)?.user?.name) token.name = (session as Session).user.name;
        if ((session as Session)?.user?.username) token.username = (session as Session).user.username;
      }
      if (user) {
        token.sub = user.id;
      }
      return token;
    },

    session: async ({ session, token, user: _ }) => {
      if (token?.sub) {
        session.user.id = token.sub;
        const dbUser = await db.user.findUnique({ where: { id: token.sub } });
        session.user.email = dbUser.email;
        session.user.username = dbUser.username;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        // so that we return to login page if isLoggedIn is false
        return isLoggedIn;
      }
      // we explicitly allow our public pages to be accessed by anyone
      return true;
    },
  },
  // NB: we avoid the credentials provider definition here, so that we can use node-native apis (pw hash) but use this config in the Vercel Edge runtime (middleware)
  providers: [],
} satisfies NextAuthConfig;
