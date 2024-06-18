"use client";

import { Booker, useEventTypesPublic } from "@calcom/atoms";
import type { CalAccount, User } from "@prisma/client";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

/**
 * [@calcom] Make sure to wrap your app with our `CalProvider` to enable the use of our hooks.
 * @link https://cal.com/docs/platform/quick-start#5.3-setup-root-of-your-app
 */
type BookerProps = Parameters<typeof Booker>[number];
export const ExpertBooker = (
  props: {
    className?: string;
    calAccount: Pick<CalAccount, "username">;
    expert: Pick<User, "name" | "username">;
  } & Partial<BookerProps>
) => {
  const { className, calAccount, expert, ...rest } = props;
  const router = useRouter();
  const searchParams = useSearchParams();
  const rescheduleUid = searchParams.get("rescheduleUid") ?? undefined;
  const { isLoading: isLoadingEvents, data: eventTypes } = useEventTypesPublic(calAccount.username ?? "");
  if (!calAccount.username) {
    return <div className="w-full text-center">Sorry. We couldn&apos;t find this experts&apos; user.</div>;
  }
  if (isLoadingEvents) {
    return (
      <div className="flex items-center justify-center">
        <Loader className="z-50 animate-spin" />
      </div>
    );
  }
  if (!eventTypes?.length) {
    return (
      <div className="w-full text-center">Sorry. Unable to load ${expert.name}&apos;s availabilities.</div>
    );
  }

  return (
    <Booker
      eventSlug={eventTypes[0]?.slug ?? ""}
      username={calAccount.username}
      onCreateBookingSuccess={(booking) => {
        toast.success("Booking successful! ");
        router.push(
          `/${expert.username}/booking/${booking.data.uid}${booking.data.fromReschedule ? `?${new URLSearchParams({ fromReschedule: booking.data.fromReschedule }).toString()}` : ""}`
        );
      }}
      rescheduleUid={rescheduleUid}
      {...rest}
    />
  );
};
export default ExpertBooker;
