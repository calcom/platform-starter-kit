import { authConfig } from "./config.edge";

/**
 * [@calcom] 1️⃣ Set up NextAuth's Credentials provider by importing `withCal`
 */
import { authorize as withCal } from "@/cal/auth";
import NextAuth from "next-auth";
import type { Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "prisma/client";
import "server-only";

const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  /**
   * [@calcom] 2️⃣ Attach the Credentials provider to NextAuth:
   */
  // NB: `withCal` isn't edge ready as it uses node-native apis; we therefore avoid importing it in `confige.edge.ts`
  providers: [
    Credentials({
      name: "Credentials",
      authorize: withCal,
    }),
  ],
});

export { signIn, signOut, GET, POST, auth };

// export const auth = cache(async () => {
//   try {
//     return await uncachedAuth();
//   } catch (err) {
//     console.error("Error fetching session", err);
//     // throw here instead of returning null so that nextjs navigation keeps working
//     // see https://github.com/vercel/next.js/discussions/64076
//     throw err;
//   }
// });

export const currentUser = async () => {
  const sesh = await auth();
  if (!sesh?.user.id) return null;
  const user = await db.user.findUnique({
    where: { id: sesh.user.id },
  });
  return user;
};

export async function SignedIn(props: { children: (props: { user: Session["user"] }) => React.ReactNode }) {
  const sesh = await auth();
  return sesh?.user ? <>{props.children({ user: sesh.user })}</> : null;
}

export async function SignedOut(props: { children: React.ReactNode }) {
  const sesh = await auth();
  return sesh?.user ? null : <>{props.children}</>;
}
