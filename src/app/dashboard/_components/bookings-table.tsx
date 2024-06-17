"use client";

import { type GetBookingsDataEntry } from "@/cal/__generated/cal-sdk";
import { stripCalOAuthClientIdFromEmail, stripCalOAuthClientIdFromText } from "@/cal/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { type User, type CalAccount } from "@prisma/client";
import { Separator } from "@radix-ui/react-separator";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { type BookingStatus } from "node_modules/@calcom/atoms/dist/packages/prisma-client";
import { Fragment, useState } from "react";

export const BookingsTable = (props: {
  bookings: {
    all: Array<GetBookingsDataEntry>;
    currentWeek: Array<GetBookingsDataEntry>;
    currentMonth: Array<GetBookingsDataEntry>;
    currentYear: Array<GetBookingsDataEntry>;
  };
  user: { timeZone: CalAccount["timeZone"]; username: User["username"]; email: User["email"] };
}) => {
  // send this ref to: rable-row-hoverable element
  // then use it in order-details element to read the currently hovered event
  const [selectedElement, setSelectedElement] = useState<GetBookingsDataEntry | null | undefined>(
    props.bookings?.currentWeek?.[0] ?? null
  );
  const [selectedTab, setSelectedTab] = useState<"week" | "month" | "year">("week");
  const tabs = [
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "Year", value: "year" },
  ] as const;

  // to display the booking detail's attendees
  const who = {
    host: `${selectedElement?.user?.name} (Host) - ${stripCalOAuthClientIdFromEmail(props.user.email ?? "")}`,
    attendees: selectedElement?.attendees.map((attendee) => {
      return {
        name: stripCalOAuthClientIdFromText(attendee?.name ?? ""),
        email: stripCalOAuthClientIdFromEmail(attendee?.email ?? ""),
      };
    }),
  };

  const bookings =
    selectedTab === "week"
      ? props.bookings.currentWeek
      : selectedTab === "month"
        ? props.bookings.currentMonth
        : props.bookings.currentYear;
  return (
    <Fragment>
      <Tabs
        defaultValue="week"
        className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3"
        onValueChange={(val) => setSelectedTab(val as "week" | "month" | "year")}>
        <div className="flex items-center lg:col-span-2 xl:col-span-3">
          <TabsList>
            {tabs.map((tab, idx) => (
              <TabsTrigger key={idx} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabs.map((tab, idx) => {
          return (
            <TabsContent value={tab.value} key={idx} className="xl:col-span-2">
              <Card>
                <CardHeader className="px-7">
                  <CardTitle>Bookings</CardTitle>
                  <CardDescription>Bookings from potential customers.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Initiator</TableHead>
                        <TableHead className="hidden sm:table-cell">Event Type</TableHead>
                        <TableHead className="hidden sm:table-cell">Status</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-right">Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.length ? (
                        bookings.map((booking, idx) => {
                          const initiator = booking.attendees[0];
                          const isEven = idx % 2 === 0;
                          return (
                            <TableRow
                              key={booking.id}
                              className={cn(
                                "data-[current=true]:bg-muted-foreground/30",
                                isEven && "bg-accent"
                              )}
                              data-current={
                                bookings.findIndex((booking) => booking.id === selectedElement?.id) === idx
                              }
                              onClick={() => setSelectedElement(booking)}>
                              <TableCell>
                                <div className="font-medium capitalize">
                                  {stripCalOAuthClientIdFromText(initiator?.name ?? "")}
                                </div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                  {stripCalOAuthClientIdFromEmail(initiator?.email ?? "")}
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">{booking.eventType.slug}</TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <Badge
                                  variant={
                                    // so that we show the destructive badge for cancelled meetings, and success badge for confirmed meetings
                                    (["CANCELLED", "REJECTED"] as Array<BookingStatus>).includes(
                                      // @ts-expect-error: There are missing types in the openapi specs for cal's api, this should likely be: BookingStatus
                                      booking.status
                                    )
                                      ? "destructive"
                                      : (["PENDING", "ACCEPTED", "AWAITING HOST"] as Array<BookingStatus>)
                                            // @ts-expect-error: There are missing types in the openapi specs for cal's api, this should likely be: BookingStatus
                                            .includes(booking.status)
                                        ? "success"
                                        : "default"
                                  }
                                  className={cn(
                                    "text-xs",
                                    // so that we show a gray badge for pending meetings
                                    (booking.status as BookingStatus) === "PENDING" &&
                                      "border-transparent bg-muted text-muted-foreground hover:bg-muted/80"
                                  )}>
                                  {/* @ts-expect-error: There are missing types in the openapi specs for cal's api, this should likely be: BookingStatus */}
                                  {booking.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {dayjs(booking.startTime).format("YYYY-MM-DD")}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="font-medium capitalize">
                                  {dayjs(booking.startTime).format("h:mma")}
                                </div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                  {props.user.timeZone}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell>
                            <p className="text-sm text-muted-foreground">
                              In the current {tab.label.toLocaleLowerCase()}, you don&rsquo;t have any
                              bookings.
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
        <Card className="mt-2" x-chunk="dashboard-05-chunk-4">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                {stripCalOAuthClientIdFromText(selectedElement?.title ?? "No booking selected")}
                <Button
                  size="icon"
                  variant="outline"
                  className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100">
                  <Copy className="h-3 w-3" />
                  <span className="sr-only">Copy Booking ID</span>
                </Button>
              </CardTitle>
              <CardDescription className="flex flex-col"></CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-sm">
            <div className="grid gap-3">
              <div className="font-semibold">Booking Details</div>
              <ul className="grid gap-3">
                <li className="flex items-center justify-between text-muted-foreground">
                  <span>Booking Uid:</span>
                  <span>{selectedElement?.uid}</span>
                </li>
                <li className="flex items-center justify-between text-muted-foreground">
                  <span>Date:</span>
                  <span>
                    {selectedElement?.startTime
                      ? dayjs(selectedElement?.startTime).format("MMMM DD, YYYY")
                      : "MMMM DD, YYYY"}
                  </span>
                </li>
                <li className="flex items-center justify-between text-muted-foreground">
                  <span>Status:</span>
                  <span>
                    <Badge
                      variant={
                        // so that we show the destructive badge for cancelled meetings, and success badge for confirmed meetings
                        (["CANCELLED", "REJECTED"] as Array<BookingStatus>).includes(
                          // @ts-expect-error: There are missing types in the openapi specs for cal's api, this should likely be: BookingStatus
                          selectedElement?.status
                        )
                          ? "destructive"
                          : (["PENDING", "ACCEPTED", "AWAITING HOST"] as Array<BookingStatus>)
                                // @ts-expect-error: There are missing types in the openapi specs for cal's api, this should likely be: BookingStatus
                                .includes(selectedElement?.status)
                            ? "success"
                            : "default"
                      }
                      className={cn(
                        "w-fit text-xs",
                        // so that we show a gray badge for pending meetings
                        (selectedElement?.status as BookingStatus) === "PENDING" &&
                          "border-transparent bg-muted text-muted-foreground hover:bg-muted/80"
                      )}>
                      {/* @ts-expect-error: There are missing types in the openapi specs for cal's api, this should likely be: BookingStatus */}
                      {selectedElement?.status}
                    </Badge>
                  </span>
                </li>
              </ul>
              <Separator className="my-2" />
              <div className="font-semibold">Attendees</div>
              <ul className="grid gap-3">
                {who.attendees?.map((attendee, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span className="capitalize text-muted-foreground">{attendee.name}</span>
                    <span>{attendee.email}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Customer Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Customer</dt>
                  <dd className="capitalize">
                    {stripCalOAuthClientIdFromText(selectedElement?.attendees[0]?.name ?? "")}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>
                    <a href="mailto:">
                      {stripCalOAuthClientIdFromEmail(selectedElement?.attendees[0]?.email ?? "")}
                    </a>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Language</dt>
                  <dd>
                    {selectedElement?.attendees[0]?.locale
                      ? new Intl.DisplayNames([navigator.language], { type: "language" }).of(
                          selectedElement?.attendees[0]?.locale ?? "English"
                        )
                      : ""}{" "}
                    {selectedElement?.attendees[0]?.locale
                      ? `(${selectedElement?.attendees[0]?.locale})`
                      : ""}
                  </dd>
                </div>
              </dl>
            </div>
          </CardContent>
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
              Updated <time dateTime={Date.now().toLocaleString()}>Today</time>
            </div>
            <Pagination className="ml-auto mr-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6"
                    onClick={() =>
                      setSelectedElement((prev) => {
                        if (!prev) return bookings[0] ?? null;
                        const currentIndex = bookings?.findIndex((booking) => booking.id === prev.id);
                        return bookings[currentIndex - 1];
                      })
                    }
                    disabled={
                      bookings.findIndex((booking) => booking.id === selectedElement?.id) === 0 ||
                      bookings.length < 2
                    }>
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span className="sr-only">Previous Booking</span>
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6"
                    onClick={() =>
                      setSelectedElement((prev) => {
                        if (!prev) return bookings[0] ?? null;
                        const currentIndex = bookings.findIndex((booking) => booking.id === prev?.id);
                        return bookings[currentIndex + 1];
                      })
                    }
                    disabled={
                      bookings.findIndex((booking) => booking.id === selectedElement?.id) ===
                        bookings.length - 1 || bookings.length < 2
                    }>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="sr-only">Next Booking</span>
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </Tabs>
    </Fragment>
  );
};
