"use server";

import { auth } from "@/auth";
import { post_EventTypesController_createEventType } from "@/cal/__generated/cal-sdk";
import { cal } from "@/cal/api";
import { revalidatePath } from "next/cache";
import { type z } from "zod";

export default async function createEventType(
  _prevState: { error: null | string } | { success: null | string },
  formData: FormData
) {
  const sesh = await auth();
  if (!sesh?.user.id) {
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

  const res = await cal({ user: { id: sesh?.user.id } }).post("/v2/event-types", {
    body: input.data.body,
  });
  if (res.status === "error") {
    console.error(
      `[_actions] Error creating event type for user with id '${sesh.user.id}'. Bad response from Cal Platform API
      
        -- REQUEST DETAILS --
        Endpoint URL: POST /v2/event-types

        Options: ${JSON.stringify(input.data.body)}

        -- RESPONSE DETAILS --
        responseStatus: ${JSON.stringify(res.status)}
        
        responseData: ${JSON.stringify(res.data)}
      `
    );
    return { error: "Unable to create the booking event (something went wrong)." };
  }

  const permalink = String(formData.get("permalink"));
  permalink && revalidatePath(permalink);
  return { success: `Event type '${res.data.title}' created successfully.` };
}
