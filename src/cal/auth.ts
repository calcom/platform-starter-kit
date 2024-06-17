import { type CreateManagedUserInput } from "./__generated/cal-sdk";
import { cal } from "./api";
import { env } from "@/env";
import { type User, type Prisma } from "@prisma/client";

export async function signUp({ email, name, user }: CreateManagedUserInput & { user: Pick<User, "id"> }) {
  /** [@calcom] 1. Let's first create a managed user on the Cal Platform: */
  const userCreation = await cal({ user }).post("/v2/oauth-clients/{clientId}/users", {
    path: { clientId: env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID },
    body: {
      email,
      name,
      // [@calcom] If we supply the timeZone as wwell, we create a default schedule for the managed user
      timeZone: new Intl.DateTimeFormat().resolvedOptions().timeZone.toString(),
    },
  });

  if (userCreation.status === "error") {
    console.log(
      `[Cal auth] Unable to create user '${email}' on Cal Platform. Check the logs above for more details`
    );
    throw new Error(`Unable to create user '${email}' on Cal Platform`);
  }

  /** [@calcom] 3. Finally, return the user as an object in the form of prisma's UserUpdateInput payload */
  const toUpdate = {
    calAccessToken: userCreation.data.accessToken,
    calRefreshToken: userCreation.data.refreshToken,
    // calAccessTokenExpiresAt: calUser.accessTokenExpiresAt,
    calAccount: {
      connectOrCreate: {
        where: { id: userCreation.data.user.id },
        create: {
          ...userCreation.data.user,
        },
      },
    },
  } satisfies Prisma.UserUpdateInput;
  return toUpdate;
}
