import { env } from "@/env";

export const stripCalOAuthClientIdFromText = (str: string) => {
  return str.split(`-${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}`)?.[0]?.replace(".", " ");
};

export const stripCalOAuthClientIdFromEmail = (str: string) => {
  return str.replace(`+${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}`, "");
};
