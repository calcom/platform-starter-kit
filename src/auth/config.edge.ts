import { signUp } from "@/cal/auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { type User } from "@prisma/client";
import { type NextAuthConfig, type DefaultSession } from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";
import { db } from "prisma/client";
import "server-only";
import { z } from "zod";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      username: string;
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    username?: string;
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
    jwt: async ({ token, user, trigger, session }) => {
      let dbUser: User | null;
      // if this is a new user, sign them up to Cal
      if (!token.accessToken && trigger === "signUp") {
        // 👇 [@calcom] the `signUp` function creates a managed user with the cal platform api and handles basic setup (such as creating a default schedule)
        const toUpdate = await signUp({
          email: user.email,
          name: user.name,
        });
        // 👆 [@calcom]

        // persist cal data to our db:
        dbUser = await db.user.update({ where: { id: user.id }, data: toUpdate });
      }
      // if this is an update, let's update the token with the provided user data
      if (trigger === "update") {
        const updateSessionValidation = z
          .object({
            user: z.object({
              // default fields
              name: z.string().optional(),
              email: z.string().optional(),
              picture: z.string().optional(),
              // augmented fields
              username: z.string().optional(),
            }),
          })
          .parse(session);
        const keysToUpdate = Object.keys(updateSessionValidation.user);
        for (const key of keysToUpdate) {
          console.info(
            `
            
            [NextAuth.callbacks.jwt] Update user's token (userId: '${token.sub}') with key '${key}' to the value: ${updateSessionValidation.user[key]}
            The previous value was: ${String(token?.[key])}
            `
          );
          token[key] = updateSessionValidation.user[key];
        }
        dbUser = await db.user.update({
          where: { id: token.sub },
          data: {
            name: token.name,
            email: token.email,
            username: token.username,
            // picture: token.picture,
          },
        });
      }
      if (user) {
        // update the token with the user's data
        token.sub = user.id;
        token.email = user.email;
        token.username = (user as User).username;
        token.name = user.name;
      }

      if (dbUser) {
        // update the token with the user's data
        token.sub = dbUser.id;
        token.email = dbUser.email;
        token.username = dbUser.username;
        token.name = dbUser.name;
      }
      return token;
    },

    session: async ({ session, token }) => {
      // make the token's user fields available on the session, so that we can call auth() to fetch it (no db call needed)
      if (token?.sub) {
        session.user.id = token.sub;
      }
      if (token?.email) {
        session.user.email = token.email;
      }
      if (token?.username) {
        session.user.username = token.username;
      }
      if (token?.name) {
        session.user.name = token.name;
      }
      if (token?.picture) {
        session.user.image = token.picture;
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
