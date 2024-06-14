"use server";

import { auth } from "@/auth";
import { post_EventTypesController_createEventType } from "@/cal/__generated/cal-sdk";
import { cal, isCalError } from "@/cal/api";
import { env } from "@/env";
import { revalidatePath } from "next/cache";
import { db } from "prisma/client";
import { type z } from "zod";

export default async function createEventType(
  _prevState: { error: null | string } | { success: null | string },
  formData: FormData
) {
  const sesh = await auth();
  if (!sesh.user.id) {
    console.log("[_actions] Unauthorized user edit", formData);
    return { error: "Unauthorized" };
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const updateEventTypeBodyData = Object.fromEntries(
    Array.from(formData.entries())
      .filter(([key]) => !key.toLowerCase().startsWith("$action"))
      .map(([key, value]) => {
        if (key === "length") return [key, Number(value)];
        return [key, value];
      })
  );
  const updateEventTypeParameters = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    body: updateEventTypeBodyData,
  } satisfies z.infer<typeof post_EventTypesController_createEventType.parameters>;

  const input = post_EventTypesController_createEventType.parameters.safeParse(updateEventTypeParameters);

  if (!input.success) {
    console.log("[_actions] Invalid form data", formData);
    return { error: "Invalid form data" };
  }

  const res = await cal.post("/v2/event-types", {
    body: input.data.body,
  });
  if (isCalError(res)) {
    // if cal returns a 400 error, it's likely a validation error, so let's show the user the error message
    if (res.error.details.statusCode === 400)
      return { error: `Unable to create event type: ${res.error.details.message}` };

    // otherwise, we don't really know what's up. let's log & recover for our user
    console.warn(
      `[dashboard/settings/booking-events/_actions.ts] 
      Error creating event type for user with id '${sesh.user.id}'.

      -- RESPONSE --
      ${JSON.stringify(res)}

      
      👉 Check the logs for the cal request with path '/v2/event-types' & timestamp by searching for 'Timestamp: ${Date.now().toString().slice(0, -3)}'.`
    );
    return { error: `Unable to create event type. Please try again later or contact support.` };
  }

  const permalink = String(formData.get("permalink"));
  permalink && revalidatePath(permalink);
  return { success: `Event type '${res.data.title}' created successfully` };
}

const retry = async () => {
  // [@calcom] we'll catch a 498 (expired token) response from cal by attempting a single retry after the refresh flow
  let retriedOnceRes = res;
  let calAccount: CalAccount | null = null;

  if (res.status === 498) {
    console.info(
      `[Cal SDK] The accessToken for user with id '${sesh.user.id}' has expired. Attempting to refresh the token.`
    );
    let freshCalTokens: KeysResponseDto["data"] | null = null;

    const refreshUrl = new URL(
      `${env.NEXT_PUBLIC_CAL_API_URL}/oauth/${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}/refresh`
    );
    const refreshOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cal-secret-key": env.CAL_SECRET,
      },
      body: JSON.stringify({
        refreshToken: sesh.user.calRefreshToken,
      }),
    };
    const refresh = await fetch(refreshUrl.href, refreshOptions);
    const refreshJson = (await refresh.json()) as KeysResponseDto | CalErrorResponse;

    if (refresh.ok && "data" in refreshJson) {
      freshCalTokens = refreshJson.data;
    } else if (isCalError(refreshJson)) {
      // both conditions are needed to narrow the type outside of this closure properly
      if (refreshJson.error.details.statusCode > 499) {
        // [@calcom] if the cal api responds with a 500 error, we throw an error, this is not recoverable
        throw new Error(
          `[Cal SDK] 🚧 Cal responded with an internal server error on endpoint '${url.pathname}'. The user won't be able to use any Cal features. 🚧`
        );
      }

      // this means that the refresh flow failed because of a request error, we now have to force-refresh the token
      calAccount = await db.calAccount.findUnique({
        // cal appends the client id to the email to find the user
        where: { email: sesh.user.email.replace("@", `+${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}@`) },
      });
      const forceRefreshUrl = new URL(
        `${env.NEXT_PUBLIC_CAL_API_URL}/oauth-clients/${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}/users/${calAccount.id}/force-refresh`
      );
      const forceRefreshOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cal-secret-key": env.CAL_SECRET,
        },
      } satisfies RequestInit;
      const forceRefreshResponse = await fetch(forceRefreshUrl.href, forceRefreshOptions);
      const forceRefreshJson = (await forceRefreshResponse.json()) as KeysResponseDto | CalErrorResponse;

      if (forceRefreshResponse.ok && "data" in forceRefreshJson) {
        freshCalTokens = forceRefreshJson.data;
      } else if (isCalError(forceRefreshJson)) {
        console.error(
          `[Cal SDK] Attempted *forced* token rotation failed for user with id '${sesh.user.id}': Invalid response from Cal after attempting to refresh the token.

        -- REQUEST DETAILS --
        URL: ${forceRefreshUrl.href}
        Method: ${forceRefreshOptions.method}
        Headers: ${JSON.stringify(forceRefreshOptions.headers)}
        Body: ${"body" in forceRefreshOptions ? JSON.stringify(forceRefreshOptions.body) : ""}

        -- RESPONSE DETAILS --

        Error Code: ${forceRefreshResponse.status}
        Error Message: ${forceRefreshResponse.statusText}
        Error Body: ${JSON.stringify(forceRefreshJson)}
        Timestamp: ${Date.now()}

        -- CAL API DETAILS --

        OAuthClient: ${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}
        API Host: ${new URL(env.NEXT_PUBLIC_CAL_API_URL).host}
        Managed User id: ${calAccount?.id}
        Endpoint: ${forceRefreshUrl.pathname}`
        );
        // [@calcom] if the cal api responds with a 500 error, we throw an error, this is not recoverable
        throw new Error(
          `[Cal SDK] 🚧 Cal responded with an internal server error on endpoint '${forceRefreshUrl.pathname}'. The user won't be able to use any Cal features. 🚧`
        );
      }
    }

    // if we don't have a set of fresh tokens after attempted refresh & force-refresh, the user is now blocked.
    if (!freshCalTokens) {
      // [@calcom] if the cal api responds with a 500 error, we throw an error, this is not recoverable
      throw new Error(
        `[Cal SDK] 🚧 Unable to refresh the cal tokens after attempted refresh & force-refresh. The user won't be able to use any Cal features. 🚧`
      );
    } else {
      // we can now run three things in parallel: db update, session update, and the original request
      const sessionPayload = {
        user: {
          calAccessToken: freshCalTokens.accessToken,
          calRefreshToken: freshCalTokens.refreshToken,
          // , calAccessTokenExpiresAt: body.data.accessTokenExpiresAt
        },
      };
      console.log(`[Cal SDK] Updated user with id '${sesh.user.id}' with fresh cal tokens, now persisting to DB & session.
      
      Payload:
      ${JSON.stringify(sessionPayload)}`);

      const [_, __, apiResponse] = await Promise.all([
        db.user.update({
          where: { id: sesh.user.id },
          data: sessionPayload.user,
        }),
        // we're not able to refresh the token here since the function can only be called in Server Action or Route handler
        // which means, the retry logic has to be handled from our action directly :(
        // -> this moves to the createEventAction
        unstable_update(sessionPayload),
        fetch(fullUrl.href, {
          ...options,
          headers: { Authorization: `Bearer ${sessionPayload.user.calAccessToken}` },
        }),
      ]);
      retriedOnceRes = apiResponse;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json = await retriedOnceRes.json();
  if (!retriedOnceRes.ok) {
    console.info(`[CAL SDK] made a request to ${fullUrl.pathname} with status ${retriedOnceRes.status}.
      
      -- REQUEST DETAILS --

        URL: ${fullUrl.href}
        Method: ${options.method}
        Headers: 
          ${JSON.stringify(options.headers)}
        Body: 
          ${options?.body ?? "not provided"}

        -- RESPONSE DETAILS --

        Error Code: ${retriedOnceRes.status}
        Error Message: ${retriedOnceRes.statusText}
        Error Body: ${JSON.stringify(json)}
        Timestamp: ${Date.now()}

        -- CAL API DETAILS --

        OAuthClient: ${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}
        API Host: ${new URL(env.NEXT_PUBLIC_CAL_API_URL).host}
        Managed User id: ${calAccount?.id ?? "not provided"}
        Endpoint: ${fullUrl.pathname}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
};
