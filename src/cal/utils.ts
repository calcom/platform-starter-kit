import { env } from "@/env";

export const stripCalOAuthClientIdFromText = (str: string) => {
  if (str === "") return str;
  return str.split(`-${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}`)?.[0]?.replace(".", " ");
};

export const stripCalOAuthClientIdFromEmail = (str: string) => {
  if (str === "") return str;
  return str.replace(`+${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}`, "");
};

export const isCalSandbox =
  env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID === "cluwyp9yb0001p61n2dkqdmo1" &&
  "https://api.cal.dev/v2" === env.NEXT_PUBLIC_CAL_API_URL;
