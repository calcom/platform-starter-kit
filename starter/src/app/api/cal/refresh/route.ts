import { unstable_update } from "@/auth";
import { env } from "@/env";
import { db } from "prisma/client";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request: Request) {
  const authorizationHeader = request.headers.get("Authorization");
  const token = authorizationHeader?.replace("Bearer ", "");
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const user = await db.user.findUnique({
      where: { calAccessToken: token },
    });
    if (!user) {
      console.error(`Unable to refresh the user token for the access token '${token}':
        No user found with the token for the access token '${token}'`);
      return new Response("Not Found", { status: 404 });
    }

    /** [@calcom] Make a POST request to calcom/atoms' /oauth/<client_id>/refresh endpoint to retrieve a fresh token
     * ☝️ This endpoint is /oauth/ and not /oauth-clients/ so it's different from the `/force-refresh`
     */
    const url = `${env.NEXT_PUBLIC_CAL_API_URL}/oauth/${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}/refresh`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cal-secret-key": env.CAL_SECRET,
      },
      body: JSON.stringify({
        refreshToken: user.calRefreshToken,
      }),
    };
    const response = await fetch(url, options);

    if (!response.ok) {
      console.error(
        `Unable to refresh the user token for user with id '${user.id}': Invalid response from Cal after attempting to refresh the token.
        
        -- REQUEST DETAILS --
        Endpoint URL: ${url}

        Options: ${JSON.stringify(options)}

        -- RESPONSE DETAILS --
        Text:
        ${await response.text()}`
      );
      return new Response("Bad Request", { status: 400 });
    }

    const body = (await response.json()) as {
      data: {
        accessToken: string;
        refreshToken: string;
        // ; expiresAt: string
      };
    };

    // update the user's token in our database & in our jwt session strategy:
    const [updated] = await Promise.all([
      db.user.update({
        where: { id: user.id },
        data: {
          calAccessToken: body.data.accessToken,
          calRefreshToken: body.data.refreshToken,
          // calTokenExpiresAt: body.data.expiresAt,
        },
        include: { calAccount: true },
      }),
      unstable_update({
        user: {
          calAccessToken: body.data.accessToken,
          calRefreshToken: body.data.refreshToken,
          // , calTokenExpiresAt: body.data.expiresAt
        },
      }),
    ]);

    /** [@calcom] You have to return the accessToken back to calcom/atoms api for future refresh requests. */
    return new Response(JSON.stringify({ accessToken: updated.calAccessToken }), {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }
}
