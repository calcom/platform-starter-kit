import { signUp } from "@/cal/auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { type User } from "@prisma/client";
import { type Session, type NextAuthConfig, type DefaultSession } from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";
import { db } from "prisma/client";
import "server-only";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
      calAccessToken?: string;
      calRefreshToken?: string;
      // calAccessTokenExpiresAt?: number;
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    username?: string;
    accessToken?: string;
    refreshToken?: string;
    // expiresAt?: number;
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
      if (trigger === "update") {
        // this gets called via `unstable_update`, let's update the token according to the payload
        if (session.user.calAccessToken) token.accessToken = (session as Session).user.calAccessToken;
        if (session.user.calRefreshToken) token.refreshToken = (session as Session).user.calRefreshToken;
        // if (session.user.calAccessTokenExpiresAt) token.expiresAt = (session as Session).user.calAccessTokenExpiresAt;
        if (session.user.username) token.username = (session as Session).user.username;
        if (session.user.name) token.name = (session as Session).user.name;
      }
      if (user) {
        // User is available during sign-in & sign-up, let's sync with our db
        let dbUser: User | null;

        // if this is a new user, sign them up to Cal
        if (!token.accessToken) {
          // 👇 [@calcom] the `signUp` function creates a managed user with the cal platform api and handles basic setup (such as creating a default schedule)
          const toUpdate = await signUp({
            email: user.email,
            name: user.name,
          });
          // 👆 [@calcom]

          // persist cal data to our db:
          dbUser = await db.user.update({ where: { id: user.id }, data: toUpdate });
        }

        // if this is a sign-in and the token is expired, let's refresh
        // if (token.calAccessTokenExpiresAt && Date.now() < (token.calAccessTokenExpiresAt as number) * 1000) {
        //   // refresh the token if it's expired
        //   const url = `${env.NEXT_PUBLIC_CAL_API_URL}/oauth/${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}/refresh`;
        //   const options = {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //       "x-cal-secret-key": env.CAL_SECRET,
        //     },
        //     body: JSON.stringify({
        //       refreshToken: token.calRefreshToken,
        //     }),
        //   };
        //   const response = await fetch(url, options);

        //   if (!response.ok) {
        //     console.error(
        //       `Unable to refresh the user token for user with id '${user.id}': Invalid response from Cal after attempting to refresh the token.

        // -- REQUEST DETAILS --
        // Endpoint URL: ${url}

        // Options: ${JSON.stringify(options)}

        // -- RESPONSE DETAILS --
        // Text:
        // ${await response.text()}`
        //     );
        //     throw new Error(`[auth] Unable to refresh cal api tokens: Bad Response`);
        //   }

        //   const body = (await response.json()) as KeysResponseDto;

        //   // update the user's token in our database & in our jwt session strategy:
        //   dbUser = await db.user.update({
        //     where: { id: user.id },
        //     data: {
        //       calAccessToken: body.data.accessToken,
        //       calRefreshToken: body.data.refreshToken,
        //       // calAccessTokenExpiresAt: body.data.accessTokenExpiresAt,
        //     },
        //   });
        // }

        // if this is a sign-in and we haven't fetched our dbUser yet, let's do that
        if (!dbUser) {
          // fetch the user during signin to add fields to our token & make them available in the session without any db roundtrips
          dbUser = await db.user.findUnique({ where: { id: token.sub } });
        }
        console.log(`[auth.callbacks.jwt] updating the token: ${JSON.stringify(dbUser)}`);
        // update the token with the user's data
        token.sub = dbUser.id;
        token.email = dbUser.email;
        token.username = dbUser.username;
        token.name = dbUser.name;
        token.accessToken = dbUser.calAccessToken;
        token.refreshToken = dbUser.calRefreshToken;
        // token.expiresAt = dbUser.calAccessTokenExpiresAt;
        console.log(`[auth.callbacks.jwt] updated the token: ${JSON.stringify(token)}`);
      }
      return token;
    },

    session: async ({ session, token }) => {
      console.log(`[auth.callbacks.session] session triggered ${JSON.stringify({ session, token })}`);
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
      if (token?.name) {
        session.user.name = token.name;
      }
      if (token?.accessToken) {
        session.user.calAccessToken = token.accessToken;
      }
      if (token?.refreshToken) {
        session.user.calRefreshToken = token.refreshToken;
      }
      // if (token.accessTokenExpiresAt) {
      //   session.user.calAccessTokenExpiresAt = token.expiresAt;
      // }
      console.log(`[auth.callbacks.session] session updated ${JSON.stringify(session.user)}`);
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
