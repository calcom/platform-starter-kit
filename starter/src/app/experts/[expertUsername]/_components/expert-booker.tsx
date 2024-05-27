"use client";

import { Booker, useEventTypesPublic } from "@calcom/atoms";
import type { CalAccount, User } from "@prisma/client";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type BookerProps = Parameters<typeof Booker>[number];
export const ExpertBooker = (
  props: {
    className?: string;
    calAccount: CalAccount;
    expert: User;
  } & Partial<BookerProps>
) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rescheduleUid = searchParams.get("rescheduleUid") ?? undefined;
  const { isLoading: isLoadingEvents, data: eventTypes } = useEventTypesPublic(props.calAccount.username);
  if (!props.calAccount.username) {
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
      <div className="w-full text-center">
        Sorry. Unable to load ${props.expert.name}&apos;s availabilities.
      </div>
    );
  }

  return (
    <Booker
      eventSlug={eventTypes[0]?.slug ?? ""}
      username={props.calAccount.username}
      onCreateBookingSuccess={(booking) => {
        toast.success("Booking successful! ");
        router.push(
          `/experts/${props.expert.username}/booking/${booking.data.uid}${booking.data.fromReschedule ? `?${new URLSearchParams({ fromReschedule: booking.data.fromReschedule }).toString()}` : ""}`
        );
      }}
      rescheduleUid={rescheduleUid}
    />
  );
};
export default ExpertBooker;
