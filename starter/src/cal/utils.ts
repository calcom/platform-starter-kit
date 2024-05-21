import { type GetManagedUserOutput, type GetBookingOutput } from "./__generated/trimmed.json.zod";
import { env } from "@/env";
import dayjs from "dayjs";

export const stripCalOAuthClientIdFromText = (str: string) => {
  return str.split(`-${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}`)?.[0]?.replace(".", " ");
};

export const stripCalOAuthClientIdFromEmail = (str: string) => {
  return str.replace(`+${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}`, "");
};
