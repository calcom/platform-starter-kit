import { authConfig } from "@/auth/config.edge";
import { type KeysResponseDto } from "@/cal/__generated/cal-sdk";
import { refreshTokens } from "@/cal/api";
import NextAuth from "next-auth";
import { db } from "prisma/client";

export const dynamic = "force-dynamic"; // defaults to auto
export const GET = NextAuth(authConfig).auth(async function GET(request) {
  const authorizationHeader = request.headers.get("Authorization");
  const token = authorizationHeader?.replace("Bearer ", "");

  if (!request.auth) {
    // deny any request that doesn't come from a browser from our website
    console.warn(`[Cal Refresh] Refresh route was triggered without a session attached.`);
    return new Response(JSON.stringify({ data: "Unauthorized" }), { status: 401 });
  }
  if (!token) {
    console.warn(`[Cal Refresh] Refresh route was triggered without an Authorization token.`);
    return new Response(JSON.stringify({ data: "Unauthorized" }), { status: 401 });
  }

  // try to look up the user
  const user = await db.user.findUnique({
    where: {
      calAccessToken: token,
    },
    include: { calAccount: true },
  });
  // if we can't lookup the user from the provided token, return a 404
  if (!user) {
    return new Response(JSON.stringify({ data: "Not Found" }), { status: 404 });
  }

  try {
    if (!user.calAccount || !user.calRefreshToken) {
      throw new Error(`[Cal Refresh] User with id ${user.id} does not have a calAccount or a refresh token.`);
    }
    /** [@calcom] Attempt to refresh the token via the refresh flow
     */
    const refreshFlow = await refreshTokens({
      refreshToken: user.calRefreshToken,
      calAccountId: user.calAccount.id,
    });

    if (refreshFlow.status === "error") {
      console.error(`[Cal Refresh] Unable to refresh token. Check logs above`);
      return new Response(JSON.stringify({ data: "Internal Server Error" }), { status: 500 });
    }

    const updatedDb = await db.user.update({
      where: { id: user.id },
      data: {
        calAccessToken: refreshFlow.data.accessToken,
        calRefreshToken: refreshFlow.data.refreshToken,
        // TODO: uncomment this once the endpoint returns expiration as well
        // calAccessTokenExpiresAt: body.data.accessTokenExpiresAt,
      },
    });
    if (!updatedDb.calAccessToken || !updatedDb.calRefreshToken) {
      throw new Error(`[Cal Refresh] Unable to update user with id ${user.id} with the new tokens.`);
    }

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
    return new Response(JSON.stringify({ data: "Internal Server Error" }), { status: 500 });
  }
});
