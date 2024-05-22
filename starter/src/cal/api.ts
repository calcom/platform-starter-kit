import { createApiClient } from "./__generated/cal-sdk";
import { currentUser } from "@/auth";
import { env } from "@/env";
import "server-only";

export const cal = createApiClient(
  async (method, url, params) => {
    try {
      const fullUrl = new URL(url);
      // @ts-expect-error - query has `unknown` values, but we're in a try/catch to handle that case
      fullUrl.search = new URLSearchParams(params.query).toString();

      const user = await currentUser();
      const headers = {
        "x-cal-secret-key": env.CAL_SECRET,
        ...(user.calAccount.accessToken && { Authorization: `Bearer ${user.calAccount.accessToken}` }),
      };
      return fetch(fullUrl.href, {
        headers,
        method,
        body: JSON.stringify(params.body),
      }).then((res) => res.json());
    } catch (e) {
      // DEBUG: query.params values are `unknown` -- could that be the culprit?
      console.error("[typed-openapi] error: ", e);
      throw e;
    }
  },
  env.NEXT_PUBLIC_CAL_API_URL.replace("/v2", "")
);
