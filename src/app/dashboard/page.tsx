/* eslint-disable */
// @ts-nocheck
import { BookingsTable } from "./_components/bookings-table";
import { CalAccount, auth } from "@/auth";
import { cal } from "@/cal/api";
import { stripCalOAuthClientIdFromEmail } from "@/cal/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { type GetBookingsInput } from "node_modules/@calcom/atoms/dist/packages/platform/types";
import { Suspense } from "react";

export default async function Dashboard() {
  const sesh = await auth();
  if (!sesh.user.id) {
    return <div>Not logged in</div>;
  }
  /** [@calcom] We're fetching the bookings on the server to display them here
   * Since `filters` is currently a required parameter, we have to iterate a bit and create our flatMap in the end
   */
  const filters = ["upcoming", "recurring", "past", "cancelled", "unconfirmed"] satisfies Array<
    GetBookingsInput["filters"]["status"]
  >;

  const bookingResponses = await Promise.all(
    filters.map((filter) =>
      cal({ user: { id: sesh?.user.id } }).get("/v2/bookings", {
        query: { "filters[status]": filter, cursor: 0, limit: 20 },
      })
    )
  );

  const bookings = bookingResponses.flatMap((response, idx) => {
    if (response.status === "error") {
      console.warn(
        `Unable to fetch bookings for filter '${filters[idx]}' with status '${response.status}'`,
        response
      );
      return [];
    }
    return response.data.bookings;
  });
  /** [@calcom] End of fetching bookings */

  const lastWeekBookings = bookings.filter((booking) => {
    const startOfWeek = dayjs().startOf("week").subtract(1, "week");
    const endOfWeek = dayjs().endOf("week").subtract(1, "week");
    return dayjs(booking.startTime).isAfter(startOfWeek) && dayjs(booking.startTime).isBefore(endOfWeek);
  });

  const thisWeekBookings = bookings.filter((booking) => {
    const startOfWeek = dayjs().startOf("week");
    const endOfWeek = dayjs().endOf("week");
    return dayjs(booking.startTime).isAfter(startOfWeek) && dayjs(booking.startTime).isBefore(endOfWeek);
  });

  const lastMonthBookings = bookings.filter((booking) => {
    const startOfMonth = dayjs().startOf("month").subtract(1, "month");
    const endOfMonth = dayjs().endOf("month").subtract(1, "month");
    return dayjs(booking.startTime).isAfter(startOfMonth) && dayjs(booking.startTime).isBefore(endOfMonth);
  });

  const thisMonthBookings = bookings.filter((booking) => {
    const startOfMonth = dayjs().startOf("month");
    const endOfMonth = dayjs().endOf("month");
    return dayjs(booking.startTime).isAfter(startOfMonth) && dayjs(booking.startTime).isBefore(endOfMonth);
  });

  const thisYearBookings = bookings.filter((booking) => {
    // only show the bookings with booking.startTime for the current year:
    const startOfYear = dayjs().startOf("year");
    const endOfYear = dayjs().endOf("year");
    return dayjs(booking.startTime).isAfter(startOfYear) && dayjs(booking.startTime).isBefore(endOfYear);
  });

  const changeFromPrevious = (current: number, previous: number) => {
    return previous === 0 ? 100 : Math.round(((current - previous) / previous) * 100);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
          <CardHeader className="pb-3">
            <CardTitle>Your Bookings</CardTitle>
            <CardDescription className="max-w-lg text-balance leading-relaxed">
              See all your bookings for your services.
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-6">
            <Link href="/dashboard/settings/booking-events">
              <Button>
                Manage booking events
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        <Card x-chunk="dashboard-05-chunk-1">
          <CardHeader className="pb-2">
            <CardDescription>This Week</CardDescription>
            <CardTitle className="text-4xl">{thisWeekBookings.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {lastWeekBookings.length > 0
                ? `${changeFromPrevious(thisWeekBookings.length, lastWeekBookings.length)}% from last week`
                : "From 0 last week"}
            </div>
          </CardContent>
          <CardFooter>
            <Progress
              value={Math.abs(changeFromPrevious(thisWeekBookings.length, lastWeekBookings.length))}
              aria-label={
                lastWeekBookings.length > 0
                  ? `${changeFromPrevious(thisWeekBookings.length, lastWeekBookings.length)}% from last week`
                  : "Unknown percentage from last week (no bookings)"
              }
              className={cn(
                Math.round(
                  ((thisWeekBookings.length - lastWeekBookings.length) / lastWeekBookings.length) * 100
                ) < 0
                  ? "[&>div]:bg-destructive/80"
                  : "[&>div]:bg-success"
              )}
            />
          </CardFooter>
        </Card>
        <Card x-chunk="dashboard-05-chunk-2">
          <CardHeader className="pb-2">
            <CardDescription>This Month</CardDescription>
            <CardTitle className="text-4xl">{thisMonthBookings.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {lastMonthBookings.length > 0
                ? `${changeFromPrevious(thisMonthBookings.length, lastMonthBookings.length)}% from last week`
                : "From 0 last month"}
            </div>
          </CardContent>
          <CardFooter>
            <Progress
              value={Math.abs(changeFromPrevious(thisMonthBookings.length, lastMonthBookings.length))}
              aria-label={
                lastMonthBookings.length > 0
                  ? `${changeFromPrevious(thisMonthBookings.length, lastMonthBookings.length)}% from last week`
                  : "Unknown percentage from last month (no bookings)"
              }
              className={cn(
                Math.round(
                  ((thisMonthBookings.length - lastMonthBookings.length) / lastMonthBookings.length) * 100
                ) < 0
                  ? "[&>div]:bg-destructive/80"
                  : "[&>div]:bg-success"
              )}
            />
          </CardFooter>
        </Card>
      </div>
      <Suspense>
        <CalAccount>
          {(calAccount) => (
            <BookingsTable
              bookings={{
                all: bookings,
                currentWeek: thisWeekBookings,
                currentMonth: thisMonthBookings,
                currentYear: thisYearBookings,
              }}
              user={{
                timeZone: calAccount.timeZone,
                username: calAccount.username,
                email: stripCalOAuthClientIdFromEmail(calAccount.email),
              }}
            />
          )}
        </CalAccount>
      </Suspense>
    </main>
  );
}
