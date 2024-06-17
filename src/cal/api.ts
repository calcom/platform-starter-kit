import {
  KeysResponseDto,
  createApiClient,
  RefreshTokenInput,
  ManagedUserOutput,
  type CreateManagedUserInput,
  type CreateManagedUserOutput,
} from "./__generated/cal-sdk";
import { isCalSandbox } from "./utils";
import { env } from "@/env";
import { type Prisma, type User } from "@prisma/client";
import { unstable_noStore } from "next/cache";
import { db } from "prisma/client";
import "server-only";
import { type z } from "zod";

const calApiUrl = new URL(env.NEXT_PUBLIC_CAL_API_URL);
const baseUrl = `${calApiUrl.protocol}//${calApiUrl.hostname}`;
// create a class instance of the Cal SDK that requires a user id as an input & returns the createApiClient's return:
type SDKInput = Pick<User, "id"> & Partial<Pick<User, "calAccessToken" | "calRefreshToken" | "calAccountId">>;
export const cal = (input: { user: SDKInput }) =>
  createApiClient(async (method, url, params) => {
    unstable_noStore(); // TODO: whenever we upgrade to next15, replace this with `unstable_rethrow` to support react's throwing mechanism under the hood @link: https://nextjs.org/docs/messages/ppr-caught-error
    const fullUrl = new URL(url);
    // the pathname contains variables that need to be replaced with our params.path (if defined). e.g. `v2/oauth-clients/%7BclientId%7D/users` should be rpelaced with the params.path["clientId"]:
    if (params?.path && Object.keys(params.path).length > 0)
      fullUrl.pathname = fullUrl.pathname.replace(
        // a regex, that takes the key inside `%7B` and `%7D` and replaces this with the value from the params.path object
        /%7B([^%7D]+)%7D/g,
        (match, key) => params.path?.[key as keyof typeof params.path] as string
      );

    try {
      if (!input.user.id) {
        console.warn(`[Cal SDK] Unable to use the Cal API: No user is authenticated'`);
        throw new Error(`[Cal SDK] Unauthorized`);
      }

      // instantiate with 'let' so that we can re-assign this variable after a potential retry with a refreshed token (syncs the dbUser)
      let dbUser: SDKInput | null = input.user;
      if (!dbUser.calAccessToken || !dbUser.calRefreshToken || !dbUser.calAccountId) {
        dbUser = await db.user.findUnique({
          where: { id: input.user.id },
          select: { id: true, calAccessToken: true, calAccountId: true, calRefreshToken: true },
        });
      }
      if (!dbUser) {
        console.warn(
          `[Cal SDK] Unable to use the Cal API: No user found in the database with id '${input.user.id}'.`
        );
        throw new Error(`[Cal SDK] Unauthorized`);
      }

      if (!dbUser.calAccessToken && !isAdminEndpoint(fullUrl.pathname)) {
        console.warn(
          `[Cal SDK] Unable to use the Cal API on a non-admin endpoint ('${fullUrl.pathname}'): The user ${dbUser.id} has no access token for Cal set.`
        );
        throw new Error(`[Cal SDK] Unauthorized`);
      }
      /*
       * [Validation] End.
       **/

      // compose the fetch parameters in a variable to re-use later (for logs & retries)
      // @ts-expect-error - query has `unknown` values, but we're in a try/catch to handle that case
      if (params?.query) fullUrl.search = new URLSearchParams(params.query).toString();

      const options = {
        headers: {
          ...calHeaders,
          Authorization: `Bearer ${dbUser.calAccessToken}`,
        },
        method,
        body: JSON.stringify(params?.body),
        cache: "no-store",
      } satisfies RequestInit;
      const fetchParameters = [fullUrl.href, options] satisfies Parameters<typeof fetch>;

      // instantiate response variables (assign with `let` so that we can re-assign after retries)
      unstable_noStore(); // TODO: whenever we upgrade to next15, replace this with `unstable_rethrow` to support react's throwing mechanism under the hood @link: https://nextjs.org/docs/messages/ppr-caught-error
      let res = await fetch(fetchParameters[0], fetchParameters[1]);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      let json = await res.json();

      // [@calcom] This means the token has expired, we refresh it and retry the request (re-assigns to res & json)
      if (res.status === 498) {
        if (!dbUser.calRefreshToken || !dbUser.calAccountId) {
          console.warn(
            `[Cal SDK] Unable to use the Cal API: The user ${dbUser.id} has no refresh token for Cal set and the access token has expired.`
          );
          throw new Error(`[Cal SDK] Unauthorized`);
        }
        const refreshFlowData = await refreshTokens({
          refreshToken: dbUser.calRefreshToken,
          calAccountId: dbUser.calAccountId,
        });
        // if we were unable to refresh the tokens, we throw an error
        if (refreshFlowData.status === "error") {
          console.error(
            `[Cal SDK] Unable to fetch the Cal API: Entire refresh flow for user with refreshToken '${dbUser.calRefreshToken}' (user id: '${dbUser.id}') failed.`
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
        if (!retryRes.res.ok) {
          console.error(
            `[Cal SDK] Unable to fetch cal api on endpoint '${fullUrl.pathname}' after the refreshFlow: Invalid response from Cal with fresh tokens.`
          );
        }

        // re-assign the variables so that the outer closure can use it, we're done with 498 handling
        dbUser = _updatedUser;
        res = retryRes.res;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        json = retryRes.json;
      }

      // [@calcom] This means the used token has been rotated, but the token we used is outdated (ie our DB *could* be out-of-sync), let's force-refresh:
      if (res.status === 403) {
        if (!dbUser.calAccountId) {
          console.warn(
            `[Cal SDK] Unable to use the Cal API: The user ${dbUser.id} has no refresh token for Cal set and the access token has expired.`
          );
          throw new Error(`[Cal SDK] Unauthorized`);
        }
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
        if (!retryRes.res.ok) {
          console.error(
            `
          
          [Cal SDK] Unable to fetch cal api on endpoint '${fullUrl.pathname}' after the forceRefresh: Invalid response from Cal with fresh tokens.
          
          `
          );
        }

        // re-assign the variables so that the outer closure can use it, we're done with 403 handling
        dbUser = _updatedUser;
        res = retryRes.res;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        json = retryRes.json;
      }

      // apart from 498 & 403 (requires token rotation), we return all other responses as-is to show the error to the application consumer and/or end-user
      // but first, let's log the initial request if it failed
      if (!res.ok) {
        console.warn(
          `[Cal SDK] Unable to fetch cal api on endpoint '${fullUrl.pathname}': Invalid response from Cal.
      
      ${composeFetchLogs({ fetch: fetchParameters, res, json, ...(dbUser.calAccountId && { cal: { id: dbUser.calAccountId } }) })}
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
export const KeysSuccessDto = KeysResponseDto.shape.data;
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
  url.pathname = `/v2/oauth/${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}/refresh`;
  const fetchParameters = [
    url.href,
    {
      method: "POST",
      headers: calHeaders,
      cache: "no-store",
      body: JSON.stringify({ refreshToken: input.refreshToken } satisfies RefreshTokenInput),
    },
  ] satisfies Parameters<typeof fetch>;

  unstable_noStore(); // TODO: whenever we upgrade to next15, replace this with `unstable_rethrow` to support react's throwing mechanism under the hood @link: https://nextjs.org/docs/messages/ppr-caught-error
  const response = await fetch(fetchParameters[0], fetchParameters[1]);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json = await response.json();

  // early return if that worked
  if (response.ok) {
    console.info(`[Cal SDK] 🔁 Refreshed the token for user with refreshToken '${input.refreshToken}'`);
    return json as { status: "success"; data: KeysSuccessData };
  }

  // log for debugging if that didn't work:
  console.warn(`
    [Cal SDK] Unable to refresh the user token for user with refreshToken '${input.refreshToken}': Invalid response from Cal after attempting to refresh the token.
    Resorting to force-refresh now.
    
    ${composeFetchLogs({ fetch: fetchParameters, res: response, json, cal: { refreshToken: input.refreshToken } })}
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json = await response.json();

  // if this doesn't work, log for debugging:
  if (!response.ok) {
    console.warn(
      `[Cal SDK] Unable to force-refresh the user token for user with calAccountId '${input.calAccountId}': Invalid response from Cal after attempting to refresh the token.
      
      ${composeFetchLogs({ fetch: fetchParameters, res: response, json, cal: { id: input.calAccountId } })}
      `
    );
    return { status: "error" } as { status: "error" };
  }

  // response.ok === true
  console.info(`[Cal SDK] 🔁 Force-refreshed the token for user with calAccountId '${input.calAccountId}'`);
  return json as Promise<{ status: "success"; data: KeysSuccessData }>;
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const retryJson = await retryRes.json();

  // if the retry with fresh tokens didn't work, we log the fetch debug info (not throwing, so that we return the error to the application)
  if (!retryRes.ok) {
    console.error(
      `
      
      [Cal SDK] Unable to fetch cal api on endpoint '${retryUrl.pathname}' after the forceRefresh: Invalid response from Cal with fresh tokens.
      
      ${composeFetchLogs({ fetch: [retryUrl.href, retryOptions], res: retryRes, json: retryJson, ...(updatedUser.calAccountId && { cal: { id: updatedUser.calAccountId } }) })}
      `
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return [updatedUser, { res: retryRes, json: retryJson }] as const;
};

/**
 * =================
 * USER MANAGEMENT
 * =================
 */

export const createUser = async (input: CreateManagedUserInput) => {
  const url = new URL(calApiUrl);
  url.pathname = `/v2/oauth-clients/${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}/users`;
  const fetchParameters = [
    url.href,
    {
      method: "POST",
      headers: calHeaders,
      body: JSON.stringify(input),
    },
  ] satisfies Parameters<typeof fetch>;

  const response = await fetch(fetchParameters[0], fetchParameters[1]);

  // if the initial response fails, there is a possibility that we attempted to create a duplicate user -- let's handle this
  if (!response.ok) {
    const text = await response.text();
    // if the response is bad and anything but a duplicate response, we log for debugging & throw
    if (!text.includes("already exists")) {
      console.error(
        `[Cal SDK] Unable to create Managed User '${input.email.slice(0, 4)}*****': Invalid response from Cal after attempting to create the user.
        
        ${composeFetchLogs({ fetch: fetchParameters, res: response, json: text })}
        `
      );
      // TODO: should we return cal's error message here?
      return { status: "error" } as { status: "error" };
    }

    // otherwise, it means that Cal already has this user signed up
    if (isCalSandbox) {
      // in the sandbox, we have to return an error as we there are potentially multiple apps using the same Cal OAuth sandbox client, have the user create a unique email:
      console.warn(`
        [Cal SDK] Unable to create Managed User '${input.email.slice(0, 4)}*****': User already exists in Cal. 
        
        ℹ️ In Cal's OAuth sandbox, the user must provide a unique email address. ℹ️
        `);
      return { status: "error" } as { status: "error" };
    }

    // let's try to reconcile our user from Cal's OAuth Managed users
    const users = await getUsers();
    if (users.status === "error") {
      console.error(
        `[Cal SDK] Unable to create user '${input.email.slice(0, 4)}*****': The user exists in Cal but we couldn't fetch the user list. Check logs above.`
      );
      return { status: "error" } as { status: "error" };
    }

    // [@calcom] 💡 Find our using by adding `+<clientId>` before the @ in the email -- that's what Cal does internally.
    const user = users.data.find((calUser) => {
      const ourEmailAsCal = input.email.replace("@", `+${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}@`);
      return calUser.email === ourEmailAsCal;
    });

    // if we couldn't find it, the signup fails
    if (!user) {
      console.error(
        `[Cal SDK] Unable to create user '${input.email.slice(0, 4)}*****': The user exists in Cal but we couldn't reconcile it from the response. Is there anything wrong with the 'users.data.find' predicate?`
      );
      return { status: "error" } as { status: "error" };
    }
    // We have found the user, but are missing the accessToken, let's force-refresh them:
    const refreshedTokens = await forceRefresh({ calAccountId: user.id });
    if (refreshedTokens.status === "error") {
      // this is somewhat of a weird state as we found the user but couldn't refresh the tokens, try to force-refresh manually.
      console.error(
        `[Cal SDK] Unable to create user '${input.email.slice(0, 4)}*****': You need to force-refresh tokens manually for the calAccountId§ '${user.id}'.`
      );
      return { status: "error" } as { status: "error" };
    }

    return { status: "success", data: { ...refreshedTokens.data, user } } satisfies {
      status: "success";
      data: CreateManagedUserOutput["data"];
    };
  }

  return response.json() as Promise<{ status: "success"; data: CreateManagedUserOutput["data"] }>;
};

export const getUsers = async () => {
  const url = new URL(calApiUrl);
  url.pathname = `/v2/oauth-clients/${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}/users`;
  const fetchParameters = [
    url.href,
    {
      headers: {
        "Content-Type": "application/json",
        "x-cal-secret-key": env.CAL_SECRET,
      },
    },
  ] satisfies Parameters<typeof fetch>;

  const response = await fetch(fetchParameters[0], fetchParameters[1]);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json = response.json();

  if (!response.ok) {
    console.error(
      `
      [Cal SDK] Unable to fetch all users: Invalid response from Cal after attempting to fetch all users.

      ${composeFetchLogs({ fetch: fetchParameters, res: response, json })}
      `
    );
    return { status: "error" } as { status: "error" };
  }

  return json as Promise<{ status: "success"; data: Array<ManagedUserOutput> }>;
};

/**
 * =================
 * UTILITIES
 * =================
 */
type FetchParametersLike = [string | URL, Parameters<typeof fetch>["1"] & { body?: string }];
export const composeFetchLogs = (ctx: {
  fetch: FetchParametersLike;
  res: Pick<Response, "status" | "statusText">;
  json: unknown;
  cal?: { id: User["calAccountId"] } | { refreshToken: User["calRefreshToken"] };
}) => {
  const { fetch, res, cal, json } = ctx;
  const [input, init] = fetch;
  const url = typeof input === "string" ? new URL(input) : input;

  return `
  
  -- REQUEST DETAILS --

  URL: ${url.href}
  Method: ${init?.method ?? "GET"}
  Headers: ${JSON.stringify(init?.headers)}
  Body: ${init?.body}


  -- RESPONSE DETAILS --

  Error Code: ${res.status}
  Error Message: ${res.statusText}
  Error Body: ${JSON.stringify(json)}
  Timestamp: ${Date.now()}
  
  -- CAL API DETAILS --

  OAuthClient: ${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}
  API Host: ${calApiUrl.host}
  ${!cal && "Manaded User id: Not available"}
  ${cal && ("id" in cal ? `Managed User id: ${cal.id}}` : `Managed User refresh token: ${cal.refreshToken}`)}
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

export const calHeaders = {
  "x-cal-secret-key": env.CAL_SECRET,
  // "cal-api-version": "2024-05-21", 06-11 -> latest version & 07-15 is the previous
  "cal-api-version": "2024-06-11", // 06-11 -> latest version & 07-15 is the previous
  Origin: new URL(env.NEXT_PUBLIC_REFRESH_URL).origin ?? "http://localhost:3000",
  // ⚠️ NestJS requires this header otherwise it won't consume the body
  "Content-type": "application/json",
} as const;

export const isAdminEndpoint = (pathname: string) => pathname.startsWith("/v2/oauth");
