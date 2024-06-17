import { env } from "@/env";
import { z } from "zod";

export const stripCalOAuthClientIdFromText = (str: string) => {
  if (str === "") return str;
  return str.split(`-${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}`)?.[0]?.replace(".", " ");
};

export const stripCalOAuthClientIdFromEmail = (str: string) => {
  if (str === "") return str;
  return str.replace(`+${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}`, "");
};

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(32),
});

export const signUpSchema = loginSchema.merge(
  z.object({
    username: z.string().min(1).max(32),
    name: z.string().min(1).max(32),
    bio: z.string().min(1).max(500),
    // for all sidebaritems, let's create the zod schema:
    categories: z.preprocess((val) => {
      if (typeof val !== "string") return val; // should error
      return JSON.parse(val);
    }, z.array(z.string())),
    capabilities: z.preprocess((val) => {
      if (typeof val !== "string") return val; // should error
      return JSON.parse(val);
    }, z.array(z.string())),
    frameworks: z.preprocess((val) => {
      if (typeof val !== "string") return val; // should error
      return JSON.parse(val);
    }, z.array(z.string())),
    budgets: z.preprocess((val) => {
      if (typeof val !== "string") return val; // should error
      return JSON.parse(val);
    }, z.array(z.string())),
    languages: z.preprocess((val) => {
      if (typeof val !== "string") return val; // should error
      return JSON.parse(val);
    }, z.array(z.string())),
    regions: z.preprocess((val) => {
      if (typeof val !== "string") return val; // should error
      return JSON.parse(val);
    }, z.array(z.string())),
  })
);
