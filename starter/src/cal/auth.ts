import { env } from "@/env";
import { type Prisma, type User } from "@prisma/client";

/** [@calcom] This return type is typed out from the docs
 * @link: https://cal.com/docs/platform/quick-start#create-managed-users-via-our-api
 */
type CalManageUserResponse = {
  status: string;
  data: {
    user: {
      id: number;
      email: string;
      username: string;
      timeZone: string;
      weekStart: string;
      createdDate: string;
      timeFormat: number;
      defaultScheduleId: number | null;
    };
    accessToken: string;
    refreshToken: string;
  };
};
type CalCreateScheduleResponse = {
  status: "success";
  data: {
    id: number;
    name: string;
    isManaged: boolean;
    workingHours: Array<{
      days: Array<number>;
      startTime: number;
      endTime: number;
      userId: number;
    }>;
    schedule: Array<{
      id: number;
      userId: number;
      eventTypeId: number | null;
      days: Array<number>;
      startTime: string;
      endTime: string;
      date: Date | null;
      scheduleId: number;
    }>;
    availability: Array<
      Array<{
        start: string;
        end: string;
      }>
    >;
    timeZone: string;
    dateOverrides: Array<{
      ranges: Array<{
        start: string;
        end: string;
      }>;
    }>;
    isDefault: boolean;
    isLastSchedule: boolean;
    readOnly: boolean;
  };
};

export async function signUp({ email, name, id }: Pick<User, "email" | "name" | "id">) {
  const url = `${env.NEXT_PUBLIC_CAL_API_URL}/oauth-clients/${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}/users`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-cal-secret-key": env.CAL_SECRET,
    },
    body: JSON.stringify({
      email: email,
      name: name,
    }),
  });
  let calUser: CalManageUserResponse["data"] | null = null;
  if (response.ok) {
    const json = (await response.json()) as Omit<CalManageUserResponse, "status">;
    calUser = json.data;
  } else {
    const text = await response.text();
    if (!text.includes("already exists")) {
      throw new Error(
        `Unable to create user '${email}': Invalid response from Cal after POSTing to ${url}
        
        Response text:
        ${await response.text()}
        `
      );
    }
    // [@calcom] This means that the user already exists on cal's end but we didn't have them in our db
    // We can just look them up by email and create the user in our db:
    // let's fetch all users and get it from there.
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "x-cal-secret-key": env.CAL_SECRET,
      },
    });
    if (!res.ok) {
      throw new Error(
        `Unable to create user '${email}': Invalid response from Cal after GETting: ${url}

        ℹ️ This means the user already exists in cal, but we can't fetch it to get the id.
        
        Response text:
        ${await res.text()}
        `
      );
    }
    const calUsers = (await res.json()) as Omit<CalManageUserResponse, "data"> & {
      data: Array<CalManageUserResponse["data"]["user"]>;
    };
    const fromCal = calUsers.data.find((calUser) => {
      // [@calcom] the cal email adds `+<clientId>` before the @ in the email, so let's do the same four our matching:
      const emailAsCal = email.replace("@", `+${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}@`);
      return calUser.email === emailAsCal;
    });
    if (!fromCal) {
      throw new Error(
        `Unable to create user '${email}': User not found in Cal

        ℹ️ This means the user already exists in cal, but we couldn't reconcile it from the response. Here are the emails:
        ${calUsers.data.map((u) => u.email).join(", ")}
        `
      );
    }
    // [@calcom] OK, we reconciled the user. Let's force refreshing their tokens so that we can store everything in our db
    const forceRefreshUrl = `${env.NEXT_PUBLIC_CAL_API_URL}/oauth-clients/${env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}/users/${fromCal.id}/force-refresh`;
    const forceRefreshResponse = await fetch(forceRefreshUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cal-secret-key": env.CAL_SECRET,
      },
    });
    if (!forceRefreshResponse.ok) {
      throw new Error(
        `Unable to create user '${email}': Invalid response from Cal after attempting to force-refresh tokens for cal user with id '${fromCal.id}'
        
        Endpoint URL: ${forceRefreshUrl}
        
        Response text:
        ${await forceRefreshResponse.text()}
        `
      );
    }
    const {
      data: {
        accessToken,
        refreshToken,
        // accessTokenExpiresAt
      },
    } = (await forceRefreshResponse.json()) as {
      status: string;
      data: {
        accessToken: string;
        refreshToken: string;
        // accessTokenExpiresAt: string
      };
    };
    // [@calcom] ✅ Now, we have successfully recovered our users tokens. Let's allocate this to our `calUser`
    calUser = {
      user: fromCal,
      accessToken,
      refreshToken,
      // accessTokenExpiresAt,
    };
  }

  /** [@calcom] 2. After we created the user on Cal's end, we have to create a default schedule: */
  const createScheduleUrl = `${env.NEXT_PUBLIC_CAL_API_URL}/schedules`;
  const createScheduleOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // [@calcom] We need to send the user's access token to create the schedule on their behalf
      Authorization: `Bearer ${calUser.accessToken}`,
    },
    body: JSON.stringify({
      name: "Default Schedule",
      timeZone: calUser.user.timeZone,
      isDefault: true,
    }),
  };
  const createScheduleResponse = await fetch(createScheduleUrl, createScheduleOptions);

  if (!createScheduleResponse.ok) {
    throw new Error(
      `Unable to create default schedule for user '${email}': Invalid response from Cal after attempting to create the default schedule.

        -- REQUEST DETAILS --

        Endpoint Url: ${createScheduleUrl}
        
        Options: ${JSON.stringify(createScheduleOptions)}

        -- RESPONSE DETAILS --
        Text:
        ${await createScheduleResponse.text()}
        `
    );
  }

  const schedule = (await createScheduleResponse.json()) as CalCreateScheduleResponse;
  calUser.user.defaultScheduleId = schedule.data.id;

  /** [@calcom] 3. Finally, return the user so that we can create the user in our db */
  const toUpdate = {
    calAccessToken: calUser.accessToken,
    calRefreshToken: calUser.refreshToken,
    // calAccessTokenExpiresAt: calUser.accessTokenExpiresAt,
    calAccount: {
      connectOrCreate: {
        where: { id: calUser.user.id },
        create: {
          ...calUser.user,
        },
      },
    },
  } satisfies Prisma.UserUpdateInput;
  return toUpdate;
}
