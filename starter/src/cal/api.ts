import { createApiClient } from "./__generated/cal-sdk";
import { auth } from "@/auth";
import { env } from "@/env";
import "server-only";

export const cal = createApiClient(
  async (method, url, params) => {
    try {
      const fullUrl = new URL(url);
      // @ts-expect-error - query has `unknown` values, but we're in a try/catch to handle that case
      if (params?.query) fullUrl.search = new URLSearchParams(params.query).toString();

      const sesh = await auth();

      if (!sesh.user.calAccessToken) {
        throw new Error(
          `Unable to fetch cal api on endpoint '${fullUrl.href}': No cal access token found for user with id '${sesh.user.id}'`
        );
      }

      // TODO: add token refresh logic once we have access to the expiry time.
      // if (sesh.user.calAccessTokenExpiresAt && Date.now() < sesh.user.calAccessTokenExpiresAt * 1000) {
      //   // refresh the token if it's expired
      //   const url = `${env.NEXT_PUBLIC_CAL_API_URL}/oauth/${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}/refresh`;
      //   const options = {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       "x-cal-secret-key": env.CAL_SECRET,
      //     },
      //     body: JSON.stringify({
      //       refreshToken: sesh.user.calRefreshToken,
      //     }),
      //   };
      //   const response = await fetch(url, options);

      //   if (!response.ok) {
      //     console.error(
      //       `Unable to refresh the user token for user with id '${sesh.user.id}': Invalid response from Cal after attempting to refresh the token.

      //   -- REQUEST DETAILS --
      //   Endpoint URL: ${url}

      //   Options: ${JSON.stringify(options)}

      //   -- RESPONSE DETAILS --
      //   Text:
      //   ${await response.text()}`
      //     );
      //     throw new Error(
      //       `Unable to fetch cal api on endpoint '${fullUrl.href}': Expired token for user with id '${sesh.user.id}'`
      //     );
      //   }

      //   const body = (await response.json()) as KeysResponseDto;

      //   // update the user's token in our database & in our jwt session strategy:
      //   await Promise.all([
      //     db.user.update({
      //       where: { id: sesh.user.id },
      //       data: {
      //         calAccessToken: body.data.accessToken,
      //         calRefreshToken: body.data.refreshToken,
      //         // calAccessTokenExpiresAt: body.data.accessTokenExpiresAt,
      //       },
      //     }),
      //     unstable_update({
      //       user: {
      //         calAccessToken: body.data.accessToken,
      //         calRefreshToken: body.data.refreshToken,
      //         // , calAccessTokenExpiresAt: body.data.accessTokenExpiresAt
      //       },
      //     }),
      //   ]);
      // }

      const headers = {
        "x-cal-secret-key": env.CAL_SECRET,
        ...(sesh.user.calAccessToken && { Authorization: `Bearer ${sesh.user.calAccessToken}` }),
      };
      return fetch(fullUrl.href, {
        headers,
        method,
        ...(params?.body && { body: JSON.stringify(params.body) }),
      }).then((res) => res.json());
    } catch (e) {
      // DEBUG: query.params values are `unknown` -- could that be the culprit?
      console.error("[typed-openapi] error: ", e);
      throw e;
    }
  },
  env.NEXT_PUBLIC_CAL_API_URL.replace("/v2", "")
);
