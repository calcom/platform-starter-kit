import { authConfig } from "./config.edge";
import {  loginSchema, signUpSchema } from "@/cal/utils";
import { env } from "@/env";

/**
 * [@calcom] 1️⃣ Set up NextAuth's Credentials provider by importing `withCal`
 */
import { type CalAccount, type User } from "@prisma/client";
import NextAuth from "next-auth";
import type { Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { db } from "prisma/client";
import { cache } from "react";
import "server-only";
import { z } from "zod";

async function hash(password: string) {
  return new Promise<string>((resolve, reject) => {
    const salt = randomBytes(16).toString("hex");
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        console.error("Error hashing password", err);
        reject(err);
      }
      resolve(`${salt}.${derivedKey.toString("hex")}`);
    });
  });
}

async function compare(password: string, hash: string) {
  return new Promise<boolean>((resolve, reject) => {
    const [salt, hashKey] = hash.split(".") as [string, string];
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        console.error("Error comparing password", err);
        reject(err);
      }
      resolve(timingSafeEqual(Buffer.from(hashKey, "hex"), derivedKey));
    });
  });
}

const {
  auth: uncachedAuth,
  handlers: { GET, POST },
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  ...authConfig,
  /**
   * [@calcom] 2️⃣ Attach the Credentials provider to NextAuth:
   */
  // NB: `withCal` isn't edge ready as it uses node-native apis; we therefore avoid importing it in `confige.edge.ts`
  providers: [
    Credentials({
      name: "Credentials",
      authorize: async (c) => {
        const credentials = loginSchema.safeParse(c);

        if (!credentials.success) {
          console.error(
            `[auth] Invalid sign in submission because of missing credentials: ${credentials.error.errors.map((e) => e.message).join(", ")}`
          );
          // return `null` to indicate that the credentials are invalid
          return null;
        }

        let user: User | null = null;
        try {
          user = await db.user.findUnique({
            where: { email: credentials.data.email },
          });
          if (user) {
            // if user exists, this comes from our login page, let's check the password
            console.info(`User ${user.id} attempted login with password`);
            if (!user.hashedPassword) {
              console.debug(`OAuth User ${user.id} attempted signin with password`);
              return null;
            }
            const pwMatch = await compare(credentials.data.password, user.hashedPassword);
            if (!pwMatch) {
              console.debug(`User ${user.id} attempted login with bad password`);
              return null;
            }
            console.log("[auth.Credentials.authorize] User signed in successfully, returning user");
            return user;
          } else {
            // if user doesn't exist, this comes from our signup page w/ additional fields
            const signupData = signUpSchema.safeParse(c);

            if (!signupData.success) {
              console.error(
                `[auth] Invalid sign in submission because of missing signup data: ${signupData.error.errors
                  .map((e) => {
                    // return the path of the error with the message:
                    return `${e.path.join(".")} (${e.message}) -> '${e.code}'`;
                  })
                  .join(", ")}`
              );
              return null;
            }
            user = await db.user.create({
              data: {
                username: signupData.data.username,
                name: signupData.data.name,
                hashedPassword: await hash(credentials.data.password),
                bio: signupData.data.bio,
                email: credentials.data.email,
              },
            });
            // now that we have the userId, connect the user to the filters:
            const selectedFilterOptions = [
              { filterOpdtionFieldIds: signupData.data.budgets, filterCategoryFieldId: "budgets" },
              { filterOpdtionFieldIds: signupData.data.capabilities, filterCategoryFieldId: "capabilities" },
              { filterOpdtionFieldIds: signupData.data.categories, filterCategoryFieldId: "categories" },
              { filterOpdtionFieldIds: signupData.data.frameworks, filterCategoryFieldId: "frameworks" },
              { filterOpdtionFieldIds: signupData.data.languages, filterCategoryFieldId: "languages" },
            ].map(({ filterOpdtionFieldIds, filterCategoryFieldId }) => {
              return filterOpdtionFieldIds.map((fieldId) => ({
                filterCategoryFieldId,
                filterOptionFieldId: fieldId,
                userId: user.id,
              }));
            });
            const data = selectedFilterOptions.flat();
            await db.filterOptionsOnUser.createMany({
              data,
            });

            return user;
          }
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
  ],
});

export { signIn, signOut, GET, POST, unstable_update, uncachedAuth };

export const auth = cache(async () => {
  return await uncachedAuth();
});
export const currentUser = cache(async () => {
  const sesh = await auth();
  if (!sesh?.user.id) return null;
  return db.user.findUnique({
    where: { id: sesh.user.id },
  });
});
export const currentUserWithCalAccount = cache(async () => {
  const sesh = await auth();
  if (!sesh?.user.id) throw new Error("somehting's wrong here");
  return db.calAccount.findUnique({
    where: { email: sesh.user.email.replace("@", `+${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}@`) },
  });
});

export async function SignedIn(props: { children: (props: { user: Session["user"] }) => React.ReactNode }) {
  const sesh = await auth();
  return sesh?.user ? <>{props.children({ user: sesh.user })}</> : null;
}

export async function SignedOut(props: { children: React.ReactNode }) {
  const sesh = await auth();
  return sesh?.user ? null : <>{props.children}</>;
}

export async function CurrentUser(props: { children: (props: User) => React.ReactNode }) {
  const user = await currentUser();
  console.log(`[Auth] CurrentUser -> ${JSON.stringify(user)}`);
  return <>{props.children(user)}</>;
}
export async function CalAccount(props: { children: (props: CalAccount) => React.ReactNode }) {
  const calAccount = await currentUserWithCalAccount();
  return <>{props.children(calAccount)}</>;
}
