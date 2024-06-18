import { cal } from "@/cal/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { db } from "prisma/client";

export const dynamic = "force-dynamic";
export default async function ExpertDetails({ params }: { params: { expertUsername: string } }) {
  const expert = await db.user.findUnique({
    where: { username: params.expertUsername },
    select: {
      id: true,
      calAccessToken: true,
      calRefreshToken: true,
      calAccountId: true,
      name: true,
      username: true,
      bio: true,
      calAccount: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
  if (!expert?.calAccount?.username) {
    console.warn("Expert not found", params.expertUsername);
    return <div>Expert not found</div>;
  }
  const eventTypes = await cal({
    user: {
      calAccessToken: expert.calAccessToken,
      calRefreshToken: expert.calRefreshToken,
      calAccountId: expert.calAccountId,
      id: expert.id,
    },
  }).get("/v2/event-types/{username}/public", {
    path: {
      username: expert.calAccount.username,
    },
  });
  if (eventTypes.status === "error") {
    console.warn(
      `[ExpertDetails] Event not found for expert username '${params.expertUsername}'. Check logs above for more info.`
    );
  }
  return (
    <div className="mb-4 flex flex-1 flex-col items-center gap-4 overflow-auto">
      <header className="flex w-full flex-col justify-between gap-4 rounded-md bg-muted/50 px-8 py-4  sm:px-10 lg:flex-row lg:px-12 2xl:px-36">
        <div className="flex items-center gap-x-6">
          <Image
            alt="Expert image"
            className="aspect-square rounded-md object-cover"
            src={`avatars/${expert.id}`}
            height="64"
            width="64"
          />
          <div>
            <h1 className="text-2xl font-semibold capitalize leading-none tracking-tight">{expert.name}</h1>
          </div>
        </div>
      </header>
      <div className="mx-auto mt-4 grid w-full gap-2 px-8 sm:px-10 lg:px-12 2xl:px-36">
        <Card className="sm:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>About Us</CardTitle>
            <p className="max-w-lg text-balance leading-relaxed">{expert.bio}</p>
          </CardHeader>
        </Card>
      </div>
      <div className="mx-auto mt-4 grid w-full gap-2 px-8 sm:px-10 lg:px-12 2xl:px-36">
        {eventTypes.status === "error" ? (
          <div>User Events not found</div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Book Us</CardTitle>
              <CardDescription>Book us for any of the below events.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead>Duration (min)</TableHead>
                    <TableHead>
                      <span className="sr-only">Availability</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventTypes.data.map((eventType) => (
                    <TableRow key={eventType.id}>
                      <TableCell>
                        <Link href={`/${expert.username}/${eventType.slug}`}>
                          <div className="font-medium capitalize">{eventType.title}</div>
                          <div className="text-sm text-muted-foreground">/{eventType.slug}</div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {eventType.description}
                        </div>
                      </TableCell>
                      <TableCell>{eventType.length}</TableCell>
                      <TableCell>
                        <Link href={`/${expert.username}/${eventType.slug}`}>
                          <Button variant="ghost" size="icon">
                            <ArrowRight className="size-5 hover:size-6" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing{" "}
                <strong>
                  {eventTypes.data.length > 0 ? 1 : 0}-
                  {eventTypes.data.length > 10 ? 10 : eventTypes.data.length}
                </strong>{" "}
                of <strong>{eventTypes.data.length}</strong> event types
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
