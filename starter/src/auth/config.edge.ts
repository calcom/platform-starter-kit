import { type NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  pages: { signIn: "/login" },
  callbacks: {
    signIn: async ({ user }) => {
      if (user.id) {
        return true;
      }
      return false;
    },
    session: async ({ session, token, user: _ }) => {
      if (token?.sub) {
        session.user.id = token.sub;
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
} satisfies NextAuthConfig;
