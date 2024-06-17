import EventTypeCreateForm from "./event-type-create";
import { ButtonSubmit } from "@/app/_components/submit-button";
import { auth } from "@/auth";
import { cal } from "@/cal/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Video } from "lucide-react";
import { Fragment } from "react";

export default async function DashboardSettingsBookingEvents() {
  const sesh = await auth();
  if (!sesh?.user.id) {
    return <div>Not logged in</div>;
  }
  const getEventTypes = await cal({ user: { id: sesh?.user.id } }).get("/v2/event-types");
  if (getEventTypes.status === "error") {
    console.error("[dashboard/settings/booking-events/page.tsx] Error fetching event types", getEventTypes);
    // TODO debug this error
    console.warn(`[dashboard/settings/booking-events/page.tsx] Error fetching event types. Check logs above`);
  }
  const eventTypes = getEventTypes?.data?.eventTypeGroups?.flatMap((group) => group.eventTypes) ?? [
    {
      length: 60,
      slug: "60min",
      title: "60min",
      description: "A 60 minute session",
      locations: [
        {
          type: "location",
          link: "https://cal.com/locations/1",
        },
      ],
      id: 1,
    },
    {
      length: 30,
      slug: "30min",
      title: "30min",
      description: "A 30 minute session",
      locations: [
        {
          type: "location",
          link: "https://cal.com/locations/1",
        },
      ],
      id: 2,
    },
  ];
  return (
    <Fragment>
      <div className="flex items-center">
        <div className="mr-auto flex items-center gap-2">
          {/* TODO: add filter logic via url params */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="size-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Event Type</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create a new Booking Event</DialogTitle>
              </DialogHeader>
              <EventTypeCreateForm permalink="/dashboard/settings/booking-events">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    {(
                      [
                        {
                          name: "length",
                          label: "Duration",
                          type: "number",
                          min: "15",
                          step: "15",
                          max: "300",
                          required: true,
                        },
                        {
                          name: "slug",
                          label: "URL Slug",
                          pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
                          required: true,
                        },
                        {
                          name: "title",
                          label: "Title",
                          type: "text",
                          minlength: "3",
                          maxlength: "30",
                          required: true,
                        },
                        {
                          name: "description",
                          label: "Description",
                          type: "text",
                          minlength: "3",
                          maxlength: "300",
                        },
                      ] as const
                    ).map(({ name, label, ...inputAttributes }) => (
                      <Fragment key={name}>
                        <Label htmlFor={name} className="text-right">
                          {label}
                        </Label>
                        {name === "description" ? (
                          <Textarea id={name} name={name} {...inputAttributes} className="col-span-3" />
                        ) : (
                          <Input id={name} name={name} {...inputAttributes} className="col-span-3" />
                        )}
                      </Fragment>
                    ))}
                  </div>
                </div>
                <DialogFooter className="sm:justify-content justify-center">
                  <ButtonSubmit variant="default">Save</ButtonSubmit>
                </DialogFooter>
              </EventTypeCreateForm>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Event Types</CardTitle>
          <CardDescription>Manage your event type and view their sales performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Locations</TableHead>
                <TableHead className="hidden md:table-cell">Duration (min)</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventTypes.map((eventType) => (
                <TableRow key={eventType.id}>
                  <TableCell>
                    <div className="font-medium capitalize">{eventType.title}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">/{eventType.slug}</div>
                  </TableCell>
                  <TableCell>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {eventType.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    {eventType.locations?.map((location, idx) => (
                      <Badge key={idx} variant="default">
                        {location.type === "integrations:daily" && (
                          <div className="text-emphasis inline-flex items-center justify-center gap-x-1 text-xs font-medium leading-3">
                            <Video className="size-3" />
                            Cal Video
                          </div>
                        )}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{eventType.length}</TableCell>
                  {/* TODO: Add CRUD on Event Types */}
                  {/* <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <strong>
              {eventTypes.length > 0 ? 1 : 0}-{eventTypes.length > 10 ? 10 : eventTypes.length}
            </strong>{" "}
            of <strong>{eventTypes.length}</strong> event types
          </div>
        </CardFooter>
      </Card>
    </Fragment>
  );
}
