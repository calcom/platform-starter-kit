import { signUp } from "@/cal/auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { type User } from "@prisma/client";
import { type Session, type NextAuthConfig, type DefaultSession } from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";
import { db } from "prisma/client";
import { cache, use } from "react";
import "server-only";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
      calAccessToken?: string;
      calRefreshToken?: string;
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    username?: string;
    access_token?: string;
    refresh_token?: string;
    expired_at?: number;
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
    jwt: async ({ token, user, session, trigger, account }) => {
      if (user) {
        // User is available during sign-in & sign-up

        // if this is a new user, sign them up to Cal
        let dbUser: User | null;
        if (account) {
          // account is available during sign-up
          console.info(`[@calcom] New user signed up: ${user.id}. Let's sign them up to Cal!`);
          // 👇 [@calcom] the `signUp` function creates a managed user with the cal platform api and handles basic setup (such as creating a default schedule)
          const toUpdate = await signUp({
            id: user.id,
            email: user.email,
            username: user.username,
          });
          // 👆 [@calcom]

          // persist cal data to our db:
          dbUser = await db.user.update({ where: { id: user.id }, data: toUpdate });
        }
        if (!dbUser) {
          // fetch the user during signin to add fields to our token & make them available in the session without any db roundtrips
          dbUser = await db.user.findUnique({ where: { id: token.sub } });
        }
        token.sub = dbUser.id;
        token.email = dbUser.email;
        token.username = dbUser.username;
        token.access_token = dbUser.calAccessToken;
        token.refresh_token = dbUser.calRefreshToken;
      }
      // TODO: handle the case where a user updates their profile pic so that we can display it in the session
      return token;
    },

    session: async ({ session, token, user: _, trigger }) => {
      // make the user fields available on the token from signin & signup available to our session object (so that auth() doesn't need a db roundtrip)
      if (token?.sub) {
        session.user.id = token.sub;
      }
      if (token?.email) {
        session.user.email = token.email;
      }
      if (token?.username) {
        session.user.username = token.username;
      }
      if (token?.access_token) {
        session.user.calAccessToken = token.access_token;
      }
      if (token?.refresh_token) {
        session.user.calRefreshToken = token.refresh_token;
      }
      // TODO: handle the case where a user updates their profile pic so that we can display it in the session
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
