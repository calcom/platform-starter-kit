import { unstable_update } from "@/auth";
import { authConfig } from "@/auth/config.edge";
import { type KeysResponseDto } from "@/cal/__generated/cal-sdk";
import { type CalErrorResponse, isCalError } from "@/cal/api";
import { env } from "@/env";
import { type CalAccount, type User } from "@prisma/client";
import NextAuth from "next-auth";
import { db } from "prisma/client";

export const dynamic = "force-dynamic"; // defaults to auto
export const GET = NextAuth(authConfig).auth(async function GET(request) {
  const authorizationHeader = request.headers.get("Authorization");
  const token = authorizationHeader?.replace("Bearer ", "");

  const missingCookies = !request.auth;
  if (missingCookies && !token) {
    return new Response(JSON.stringify({ data: "Unauthorized" }), { status: 401 });
  }

  // try to look up the user
  let user: (User & { calAccount: CalAccount }) | null = null;
  const { searchParams } = new URL(request.url);
  const providedAccessToken = request.auth?.user.calAccessToken ?? token;
  user = await db.user.findUnique({
    where: {
      calAccessToken: providedAccessToken,
    },
    include: { calAccount: true },
  });
  if (!user) {
    console.info(
      `[Cal Refresh] Unable to find user with access token '${providedAccessToken}'. Trying with search params now.`
    );
    if (!searchParams.has("userId")) {
      console.info(`[Cal Refresh] No search params present. Not Found.`);
      return new Response(JSON.stringify({ data: "Not Found" }), { status: 404 });
    }
    user = await db.user.findUnique({
      where: {
        id: searchParams.get("userId"),
      },
      include: { calAccount: true },
    });
  }
  // if we still don't have a user, return a 404
  if (!user) {
    return new Response(JSON.stringify({ data: "Not Found" }), { status: 404 });
  }

  try {
    /** [@calcom] Make a POST request to calcom/atoms' /oauth/<client_id>/refresh endpoint to retrieve a fresh token
     * ☝️ This endpoint is /oauth/ and not /oauth-clients/ so it's different from the `/force-refresh`
     */
    let freshCalTokens: KeysResponseDto["data"] | null = null;
    let refreshUrl = new URL(
      `${env.NEXT_PUBLIC_CAL_API_URL}/oauth/${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}/refresh`
    );
    let refreshOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cal-secret-key": env.CAL_SECRET,
      },
      body: JSON.stringify({
        refreshToken: user.calRefreshToken,
      }),
      cache: "no-store",
    } satisfies RequestInit;
    let refreshResponse = await fetch(refreshUrl.href, refreshOptions);

    let refreshJson = (await refreshResponse.json()) as KeysResponseDto | CalErrorResponse;
    if (refreshResponse.ok && "data" in refreshJson) {
      console.log(`[Cal Refresh] Successfully refreshed the token for user with id '${user.id}'`);
      freshCalTokens = refreshJson.data;
    } else if (isCalError(refreshJson)) {
      console.info(
        `[Cal Refresh] Attempted token rotation failed for user with id '${user.id}'. Trying to force-refresh now.
        
        -- REQUEST DETAILS --
        URL: ${refreshUrl.href}
        Method: ${refreshOptions.method}
        Headers: ${JSON.stringify(refreshOptions.headers)}
        Body: ${JSON.stringify(refreshOptions.body)}

        -- RESPONSE DETAILS --

        Error Code: ${refreshResponse.status}
        Error Message: ${refreshResponse.statusText}
        Error Body: ${JSON.stringify(refreshJson)}
        Timestamp: ${Date.now()}

        -- CAL API DETAILS --

        OAuthClient: ${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}
        API Host: ${new URL(env.NEXT_PUBLIC_CAL_API_URL).host}
        Managed User id: ${user.calAccountId}

        `
      );
      // force refresh as last resort:
      refreshUrl = new URL(
        `${env.NEXT_PUBLIC_CAL_API_URL}/oauth-clients/${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}/users/${user.calAccountId}/force-refresh`
      );
      refreshOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cal-secret-key": env.CAL_SECRET,
        },
        cache: "no-store",
      };
      refreshResponse = await fetch(refreshUrl.href, refreshOptions);
      refreshJson = (await refreshResponse.json()) as KeysResponseDto | CalErrorResponse;
    }
    if (refreshResponse.ok && "data" in refreshJson) {
      console.log(`[Cal Refresh] Successfully force-refreshed the token for user with id '${user.id}'`);
      freshCalTokens = refreshJson.data;
    } else if (isCalError(refreshJson)) {
      console.error(
        `[Cal SDK] Attempted *forced* token rotation failed for user with id '${user.id}': Invalid response from Cal after attempting to refresh the token.
  
          -- REQUEST DETAILS --
          URL: ${refreshUrl.href}
          Method: ${refreshOptions.method}
          Headers: ${JSON.stringify(refreshOptions.headers)}
          Body: ${"body" in refreshOptions ? JSON.stringify(refreshOptions.body) : ""}
  
          -- RESPONSE DETAILS --
  
          Error Code: ${refreshResponse.status}
          Error Message: ${refreshResponse.statusText}
          Error Body: ${JSON.stringify(refreshJson)}
          Timestamp: ${Date.now()}
  
          -- CAL API DETAILS --
  
          OAuthClient: ${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}
          API Host: ${new URL(env.NEXT_PUBLIC_CAL_API_URL).host}
          Managed User email: ${user.email.replace("@", `+${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}@`)}
          Endpoint: ${refreshUrl.pathname}
            `
      );
      // [@calcom] if the cal api responds with a 500 error, we throw an error, this is not recoverable
      throw new Error(
        `[Cal SDK] 🚧 Cal responded with an internal server error on endpoint '${refreshUrl.pathname}'. The user won't be able to use any Cal features. 🚧`
      );
    }
    console.log(`

      [Cal Refresh] Compare the token rotation before/after:

      Cal Access Token: ${user.calAccessToken}
      Cal Refresh Token: ${user.calRefreshToken}
      ------------------------------
      freshCalTokens: ${JSON.stringify(freshCalTokens)}
      refreshJson: ${JSON.stringify(refreshJson)}

      `);
    // update the user's token in our database & in our jwt session strategy:
    const sessionPayload = {
      user: {
        calAccessToken: freshCalTokens.accessToken,
        calRefreshToken: freshCalTokens.refreshToken,
        // , calTokenExpiresAt: body.data.expiresAt
      },
    };
    console.log(`
    
    [Cal Refresh] Updated user with id '${user.id}' with fresh cal tokens, now persisting to DB & session.
      
      Payload: 
      ${JSON.stringify(sessionPayload)}`);
    await unstable_update(sessionPayload);
    const [updatedDb] = await Promise.all([
      db.user.update({
        where: { id: user.id },
        data: sessionPayload.user,
        include: { calAccount: true },
      }),
    ]);

    /** [@calcom] You have to return the accessToken back to calcom/atoms api for future refresh requests. */
    return new Response(
      JSON.stringify({
        accessToken: updatedDb.calAccessToken,
        refreshToken: updatedDb.calRefreshToken,
      } satisfies KeysResponseDto["data"]),
      {
        status: 200,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }
});
