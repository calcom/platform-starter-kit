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
    },
  });
  console.log(`[@/cal/auth] User creation response
    ${JSON.stringify(userCreation, null, 2)}
    `);

  if (userCreation.status === "error") {
    console.log(
      `[Cal auth] Unable to create user '${email}' on Cal Platform. Check the logs above for more details`
    );
    throw new Error(`Unable to create user '${email}' on Cal Platform`);
  }

  /** [@calcom] 2. After we created the user on Cal's end, we create a schedule on behalf of our users: */
  const { user: calAccount, accessToken, refreshToken } = userCreation.data;
  const scheduleCreation = await cal({
    user: {
      calAccessToken: accessToken,
      calRefreshToken: refreshToken,
      calAccountId: calAccount.id,
      id: user.id,
    },
  }).post("/v2/schedules", {
    body: {
      name: "Platform Starter Schedule",
      timeZone: calAccount.timeZone,
      isDefault: true,
    },
  });
  console.log("[@/cal/auth] Schedule creation response", scheduleCreation);

  if (scheduleCreation.status === "error") {
    // [@calcom] If we can't create the schedule, we *do not* throw, as it's recoverable from the /dashboard later on
    console.warn(
      `[Cal auth] Unable to create default schedule for the User with id '${user.id}' on Cal's Platform (calAccountId: ${calAccount.id}).`
    );
  }

  /** [@calcom] 3. Finally, return the user as an object in the form of prisma's UserUpdateInput payload */
  const toUpdate = {
    calAccessToken: accessToken,
    calRefreshToken: refreshToken,
    // calAccessTokenExpiresAt: calUser.accessTokenExpiresAt,
    calAccount: {
      connectOrCreate: {
        where: { id: calAccount.id },
        create: {
          ...calAccount,
        },
      },
    },
  } satisfies Prisma.UserUpdateInput;
  return toUpdate;
}
