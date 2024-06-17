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

export const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(32),
});
