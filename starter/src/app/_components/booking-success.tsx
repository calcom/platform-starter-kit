"use client";

import { useGetBooking, useCancelBooking } from "@calcom/atoms";
import dayjs from "dayjs";
import { CheckCircleIcon, CircleX, ExternalLinkIcon, Loader } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { BookingStatus } from "node_modules/@calcom/atoms/dist/packages/prisma/enums";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { cn, stripCalOAuthClientIdFromEmail, stripCalOAuthClientIdFromText } from "~/lib/utils";

export const BookingSuccess = () => {
  const params = useSearchParams();
  const bookingUid = params.get("bookingUid");
  const expertUsername = params.get("expert");
  const fromReschedule = params.get("fromReschedule");
  const { isLoading, data: booking, refetch } = useGetBooking(bookingUid ?? "");
  // TODO: We're doing this to cast the type since @calcom/atoms doesn't type them properly
  const bookingStatus = booking?.status as BookingStatus;
  const { mutate: cancelBooking } = useCancelBooking({
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onSuccess: async () => {
      await refetch();
    },
  });
  //   [@calcom] The API returns the UID of the previous booking in case you'd like to show changed booking details in your UI.
  const bookingPrevious = useGetBooking(fromReschedule ?? "");
  if (!bookingUid) {
    return <div>No Booking UID.</div>;
  }

  if (isLoading) {
    return <Loader className="z-50 animate-spin place-self-center" />;
  }

  if (!booking) {
    return <div>Booking not found</div>;
  }

  const startTime = dayjs(booking?.startTime).format(12 === 12 ? "h:mma" : "HH:mm");
  const endTime = dayjs(booking?.endTime).format(12 === 12 ? "h:mma" : "HH:mm");
  const date = dayjs(booking?.startTime).toDate();
  // const dateToday = dayjs(booking?.startTime).date();
  const year = dayjs(booking?.startTime).year();
  const day = dayjs(date).format("dddd");
  const dayAsNumber = dayjs(date).format("DD");
  const month = dayjs(date).format("MMMM");

  const what = stripCalOAuthClientIdFromText(booking.title) ?? booking.title;
  const formerWhat = bookingPrevious?.data?.title
    ? stripCalOAuthClientIdFromText(bookingPrevious?.data?.title)
    : bookingPrevious?.data?.title;

  const when = `${day}, ${month} ${dayAsNumber} ${year} | ${startTime} - ${endTime} (${booking?.user?.timeZone})`;
  const formerWhen = `${day}, ${month} ${dayAsNumber} ${year} | ${startTime} - ${endTime} (${bookingPrevious.data?.user?.timeZone})`;

  console.log({ when, formerWhen, what, formerWhat });
  // TODO: Add these two as well to show updated details
  // const who = booking?.user?.name;
  // const formerWho

  // const where = booking.location;
  // const formerWhere = bookingPrevious.data.location;

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-4 px-8">
        <div className="flex items-center justify-center space-x-2">
          {/* FIX: The type casting here is necessary only because @calcom/ */}
          {bookingStatus.toLowerCase() === "cancelled" && (
            <div className="flex flex-col items-center space-y-4">
              <CircleX className="h-8 w-8 text-destructive" />
              <CardTitle className="text-2xl">Meeting Cancelled</CardTitle>
            </div>
          )}
          {bookingStatus.toLowerCase() === "accepted" && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
              <CardTitle className="text-2xl">Meeting scheduled successfully</CardTitle>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 px-8 pt-2 text-sm">
        <Separator className="mb-8" />
        <div className="grid gap-3">
          <ul className="grid gap-3">
            <li className="flex flex-col">
              <span className="font-semibold">What</span>
              {formerWhat !== what && (
                <span className={cn("text-muted-foreground line-through")}>{formerWhat}</span>
              )}
              <span
                className={cn(
                  "text-muted-foreground",
                  bookingStatus.toLowerCase() === "cancelled" && "line-through"
                )}>
                {what}
              </span>
            </li>
            <li className="flex flex-col">
              <span className="font-semibold">When</span>
              {formerWhen !== when && (
                <span className={cn("text-muted-foreground line-through")}>{formerWhen}</span>
              )}
              <span
                className={cn(
                  "text-muted-foreground",
                  bookingStatus.toLowerCase() === "cancelled" && "line-through"
                )}>
                {when}
              </span>
            </li>
            <li className="flex flex-col">
              <span className="font-semibold">Who</span>
              <ul>
                <li
                  className={cn(
                    "text-muted-foreground",
                    bookingStatus.toLowerCase() === "cancelled" && "line-through"
                  )}>
                  {booking?.user?.name} (Host) - {stripCalOAuthClientIdFromEmail(booking?.user?.email ?? "")}
                </li>
                {(booking.attendees as Array<{ email: string; name: string }>).map((attendee, idx) => (
                  <li
                    key={idx}
                    className={cn(
                      "text-muted-foreground",
                      bookingStatus.toLowerCase() === "cancelled" && "line-through"
                    )}>
                    {stripCalOAuthClientIdFromText(attendee.name)} -{" "}
                    {stripCalOAuthClientIdFromEmail(attendee.email)}
                  </li>
                ))}
              </ul>
            </li>
            <li className="flex flex-col">
              <span className="font-semibold">Where</span>
              <span
                className={cn(
                  "text-muted-foreground",
                  bookingStatus.toLowerCase() === "cancelled" && "line-through"
                )}>
                {booking.location && booking.location === "integrations:daily" ? (
                  <span className="border-b-0 border-transparent hover:border-b hover:border-current">
                    <Link
                      className={cn(
                        "inline-flex items-center gap-1",
                        bookingStatus.toLowerCase() === "cancelled" && "cursor-not-allowed"
                      )}
                      href={
                        bookingStatus.toLowerCase() === "cancelled"
                          ? "#"
                          : (booking?.metadata as { videoCallUrl?: string })?.videoCallUrl ?? "#"
                      }>
                      Online (Cal Video)
                      <ExternalLinkIcon className="size-4" />
                    </Link>
                  </span>
                ) : (
                  booking.location
                )}
              </span>
            </li>
            {Boolean(booking.description) && (
              <li className="flex flex-col">
                <span className="font-semibold">Event Description</span>
                <span
                  className={cn(
                    "text-muted-foreground",
                    bookingStatus.toLowerCase() === "cancelled" && "line-through"
                  )}>
                  {booking.description}
                </span>
              </li>
            )}
          </ul>
        </div>
        {bookingStatus.toLowerCase() !== "cancelled" && <Separator className="mt-8" />}
      </CardContent>
      {bookingStatus.toLowerCase() !== "cancelled" && (
        <CardFooter className="flex flex-col px-8">
          <div>
            <span>Need to make changes? </span>
            <span>
              <Link href={`/experts/${expertUsername}?rescheduleUid=${bookingUid}`} className="underline">
                Reschedule
              </Link>{" "}
              or{" "}
              <div
                className="cursor-pointer underline"
                onClick={() => {
                  return cancelBooking({
                    id: booking.id,
                    uid: booking.uid,
                    cancellationReason: "User request",
                    allRemainingBookings: true,
                  });
                }}>
                Cancel
              </div>
            </span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default BookingSuccess;
