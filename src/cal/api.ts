import {
  KeysResponseDto,
  createApiClient,
  RefreshTokenInput,
  ManagedUserOutput,
} from "./__generated/cal-sdk";
import { auth } from "@/auth";
import { env } from "@/env";
import { type Prisma, type User } from "@prisma/client";
import { db } from "prisma/client";
import "server-only";
import { type z } from "zod";

const calApiUrl = new URL(env.NEXT_PUBLIC_CAL_API_URL);
const baseUrl = `${calApiUrl.protocol}//${calApiUrl.hostname}`;
export const cal = createApiClient(async (method, url, params) => {
  try {
    /*
     * [Validation] to ensure that SDK is used by an authenticated user
     **/
    const sesh = await auth();
    if (!sesh.user.id) {
      console.warn(`[Cal SDK] Unable to use the Cal API: No user is authenticated'`);
      throw new Error(`[Cal SDK] Unauthorized`);
    }
    // instantiate with 'let' so that we can re-assign this variable after a potential retry with a refreshed token (syncs the dbUser)
    let dbUser = await db.user.findUnique({
      where: { id: sesh.user.id },
      select: { id: true, calAccessToken: true, calAccountId: true, calRefreshToken: true },
    });
    if (!dbUser) {
      console.warn(
        `[Cal SDK] Unable to use the Cal API: No user found in the database with id '${sesh.user.id}'.`
      );
      throw new Error(`[Cal SDK] Unauthorized`);
    }

    if (!dbUser.calAccessToken) {
      console.warn(
        `[Cal SDK] Unable to use the Cal API: The user ${dbUser.id} has no access token for Cal set.`
      );
      throw new Error(`[Cal SDK] Unauthorized`);
    }
    /*
     * [Validation] End.
     **/

    // compose the fetch parameters in a variable to re-use later (for logs & retries)
    const fullUrl = new URL(url);
    // @ts-expect-error - query has `unknown` values, but we're in a try/catch to handle that case
    if (params?.query) fullUrl.search = new URLSearchParams(params.query).toString();
    const headers = {
      "x-cal-secret-key": env.CAL_SECRET,
      Authorization: `Bearer ${dbUser.calAccessToken}`,
      Origin: new URL(env.NEXT_PUBLIC_REFRESH_URL).origin ?? "http://localhost:3000",
    };
    const options = {
      headers,
      method,
      ...(params?.body && { body: JSON.stringify(params.body) }),
      cache: "no-store",
    } satisfies RequestInit;
    const fetchParameters = [fullUrl.href, options] satisfies Parameters<typeof fetch>;

    // instantiate response variables (assign with `let` so that we can re-assign after retries)
    let res = await fetch(fetchParameters[0], fetchParameters[1]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let json = await res.json();

    // [@calcom] This means the token has expired, we refresh it and retry the request (re-assigns to res & json)
    if (res.status === 498) {
      const refreshFlowData = await refreshTokens({
        refreshToken: dbUser.calRefreshToken,
        calAccountId: dbUser.calAccountId,
      });
      // if we're unable to refresh the tokens, we throw an error
      if (refreshFlowData.status === "error") {
        console.error(
          `
          
          [Cal SDK] Unable to fetch the Cal API: Entire refresh flow for user with refreshToken '${dbUser.calRefreshToken}' (user id: '${dbUser.id}') failed.
          
          `
        );
        throw new Error(`[Cal SDK] Application Error`);
      }

      // with fresh tokens, let's update the database & retry the request in parallel:
      const [_updatedUser, retryRes] = await updateDbAndRetryFetch({
        fetch: fetchParameters,
        update: {
          where: { id: dbUser.id },
          data: {
            calAccessToken: refreshFlowData.data.accessToken,
            calRefreshToken: refreshFlowData.data.refreshToken,
          },
        },
      });

      // if the retry with fresh tokens didn't work, we log the fetch debug info (not throwing, so that we return the error to the application)
      if (!retryRes.ok) {
        console.error(
          `

          [Cal SDK] Unable to fetch cal api on endpoint '${fullUrl.pathname}' after the refreshFlow: Invalid response from Cal with fresh tokens.
          
          `
        );
      }

      // re-assign the variables so that the outer closure can use it, we're done with 498 handling
      dbUser = _updatedUser;
      res = retryRes;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      json = await res.json();
    }

    // [@calcom] This means the used token has been rotated, but the token we used is outdated (ie our DB *could* be out-of-sync), let's force-refresh:
    if (res.status === 403) {
      const forceRefreshData = await forceRefresh({ calAccountId: dbUser.calAccountId });
      // if the force-refresh doesn't work, we have to throw an error, it's a dead end
      if (forceRefreshData.status === "error") throw new Error(`[Cal SDK] Application Error`);

      const [_updatedUser, retryRes] = await updateDbAndRetryFetch({
        fetch: [fullUrl, options],
        update: {
          where: { id: dbUser.id },
          data: {
            calAccessToken: forceRefreshData.data.accessToken,
            calRefreshToken: forceRefreshData.data.refreshToken,
          },
        },
      });
      // if the retry with fresh tokens didn't work, we log the fetch debug info (not throwing, so that we return the error to the application)
      if (!retryRes.ok) {
        console.error(
          `
          
          [Cal SDK] Unable to fetch cal api on endpoint '${fullUrl.pathname}' after the forceRefresh: Invalid response from Cal with fresh tokens.
          
          `
        );
      }

      // re-assign the variables so that the outer closure can use it, we're done with 403 handling
      dbUser = _updatedUser;
      res = retryRes;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      json = await res.json();
    }

    // apart from 498 & 403 (requires token rotation), we return all other responses as-is to show the error to the application consumer and/or end-user
    // but first, let's log the initial request if it failed
    if (!res.ok) {
      console.warn(
        `[Cal SDK] Unable to fetch cal api on endpoint '${fullUrl.pathname}': Invalid response from Cal after attempting to fetch the token.
      
      ${composeFetchLogs({ fetch: fetchParameters, res, cal: { id: dbUser.calAccountId } })}
      `
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return json;
  } catch (e) {
    console.error("[Cal SDK] Unknown error encountered: ", e);
    throw e;
  }
}, baseUrl);

/**
 * =================
 * TOKEN REFRESH
 * =================
 */
export const KeysSuccessDto = KeysResponseDto.shape.data.required();
type KeysSuccessData = z.infer<typeof KeysSuccessDto>;

export const refreshTokens = async (
  input: z.infer<typeof RefreshTokenInput> & { calAccountId: User["calAccountId"] }
) => {
  const inputValidation = RefreshTokenInput.extend({
    calAccountId: ManagedUserOutput.shape.id,
  }).safeParse(input);

  if (!inputValidation.success) {
    console.error(
      `[Cal SDK] Invalid input provided to refreshTokens: ${inputValidation.error.errors.map((e) => e.message).join(", ")}`
    );
    return { status: "error" } as { status: "error" };
  }

  // first attempt is to use the /refresh endpoint on `/oauth/`:
  const url = new URL(calApiUrl);
  url.pathname = `/oauth/${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}/refresh`;
  const fetchParameters = [
    url.href,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cal-secret-key": env.CAL_SECRET,
      },
      body: JSON.stringify({ refreshToken: input.refreshToken } satisfies RefreshTokenInput),
    },
  ] satisfies Parameters<typeof fetch>;

  const response = await fetch(fetchParameters[0], fetchParameters[1]);

  // early return if that worked
  if (response.ok) {
    console.info(`[Cal SDK] 🔁 Refreshed the token for user with refreshToken '${input.refreshToken}'`);
    return response.json() as Promise<{ status: "success"; data: KeysSuccessData }>;
  }

  // log for debugging if that didn't work:
  console.warn(`
    [Cal SDK] Unable to refresh the user token for user with refreshToken '${input.refreshToken}': Invalid response from Cal after attempting to refresh the token.
    Resorting to force-refresh now.
    
    ${composeFetchLogs({ fetch: fetchParameters, res: response, cal: { refreshToken: input.refreshToken } })}
    `);

  // second attempt is to use the /force-refresh endpoint on `/oauth-clients/`. We need the accountId for this:
  return forceRefresh({ calAccountId: input.calAccountId });
};

export const forceRefresh = async (input: { calAccountId: User["calAccountId"] }) => {
  const url = new URL(calApiUrl);
  url.pathname = `/v2/oauth-clients/${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}/users/${input.calAccountId}/force-refresh`;
  const fetchParameters = [
    url.href,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cal-secret-key": env.CAL_SECRET,
        origin: "http://localhost:3000",
      },
    },
  ] satisfies Parameters<typeof fetch>;

  const response = await fetch(fetchParameters[0], fetchParameters[1]);

  // if this doesn't work, log for debugging:
  if (!response.ok) {
    console.warn(
      `[Cal SDK] Unable to force-refresh the user token for user with calAccountId '${input.calAccountId}': Invalid response from Cal after attempting to refresh the token.
      
      ${composeFetchLogs({ fetch: fetchParameters, res: response, cal: { id: input.calAccountId } })}
      `
    );
    return { status: "error" } as { status: "error" };
  }

  // response.ok === true
  console.info(`[Cal SDK] 🔁 Force-refreshed the token for user with calAccountId '${input.calAccountId}'`);
  return response.json() as Promise<{ status: "success"; data: KeysSuccessData }>;
};

export const updateDbAndRetryFetch = async (input: {
  fetch: FetchParametersLike;
  update: Pick<Prisma.UserUpdateArgs, "where" | "data">;
}) => {
  // with fresh tokens, let's update the database & retry the request in parallel:
  const inputUrl = input.fetch[0];
  const retryUrl = (typeof inputUrl === "string" ? new URL(inputUrl) : inputUrl) satisfies URL;
  // overwrite the previous headers with the new access token
  const retryOptions = {
    ...input.fetch[1],
    headers: {
      ...input.fetch[1].headers,
      Authorization: `Bearer ${input.update.data.calAccessToken as string}`,
    },
  } satisfies RequestInit;
  const [updatedUser, retryRes] = await Promise.all([
    db.user.update({
      where: input.update.where,
      data: input.update.data,
    }),
    fetch(retryUrl.href, retryOptions),
  ]);

  // if the retry with fresh tokens didn't work, we log the fetch debug info (not throwing, so that we return the error to the application)
  if (!retryRes.ok) {
    console.error(
      `
      
      [Cal SDK] Unable to fetch cal api on endpoint '${retryUrl.pathname}' after the forceRefresh: Invalid response from Cal with fresh tokens.
      
      ${composeFetchLogs({ fetch: [retryUrl.href, retryOptions], res: retryRes, cal: { id: updatedUser.calAccountId } })}
      `
    );
  }
  return [updatedUser, retryRes] as const;
};

/**
 * =================
 * UTILITIES
 * =================
 */
type FetchParametersLike = [string | URL, Parameters<typeof fetch>["1"]];
export const composeFetchLogs = (ctx: {
  fetch: FetchParametersLike;
  res: Pick<Response, "status" | "statusText"> & { json: unknown };
  cal: { id: User["calAccountId"] } | { refreshToken: User["calRefreshToken"] };
}) => {
  const { fetch, res, cal } = ctx;
  const [input, init] = fetch;
  const url = typeof input === "string" ? new URL(input) : input;

  return `
  
  -- REQUEST DETAILS --

  URL: ${url.href}
  Method: ${init.method}
  Headers: ${JSON.stringify(init.headers)}
  Body: ${JSON.stringify(init.body)}

  Stringified fetch options: ${JSON.stringify(fetch[1])}

  -- RESPONSE DETAILS --

  Error Code: ${res.status}
  Error Message: ${res.statusText}
  Error Body: ${JSON.stringify(res.json)}
  Timestamp: ${Date.now()}
  
  -- CAL API DETAILS --

  OAuthClient: ${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}
  API Host: ${calApiUrl.host}
  ${"id" in cal ? `Managed User id: ${cal.id}}` : `Managed User refresh token: ${cal.refreshToken}`}
  Endpoint: ${url.pathname}
  
  `;
};

export const isCalError = (res: any): res is CalErrorResponse => res.status === "error";

export type CalErrorResponse = {
  status: "error";
  timestamp: string;
  path: string;
  error: {
    code: string;
    message: string;
    details: {
      message: string;
      error: string;
      statusCode: number;
    };
  };
};
