import ExpertBooker from "../_components/expert-booker";
import { cal } from "@/cal/api";
import Image from "next/image";
import { db } from "prisma/client";

export const dynamic = "force-dynamic";

export default async function BookerPage({
  params,
}: {
  params: { expertUsername: string; eventSlug: string };
}) {
  const expert = await db.user.findUnique({
    where: { username: params.expertUsername },
    select: {
      id: true,
      calAccessToken: true,
      calRefreshToken: true,
      calAccountId: true,
      name: true,
      username: true,
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
  const eventType = await cal({
    user: {
      calAccessToken: expert.calAccessToken,
      calRefreshToken: expert.calRefreshToken,
      calAccountId: expert.calAccountId,
      id: expert.id,
    },
  }).get("/v2/event-types/{username}/{eventSlug}/public", {
    path: {
      username: expert.calAccount.username,
      eventSlug: params.eventSlug,
    },
    query: {
      isTeamEvent: false,
    },
  });
  if (eventType.status === "error") {
    console.warn(
      `[BookerPage] Event not found for event slug '${params.eventSlug}'. Check logs above for more info.`
    );
    return <div>Event not found</div>;
  }

  const descriptionWithoutHtmlTags = eventType.data?.description.replace(/<[^>]*>?/gm, "");
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
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold capitalize leading-none tracking-tight">
              {expert.name}: {eventType.data?.title}
            </h1>
            <p className="text-sm text-muted-foreground">{descriptionWithoutHtmlTags}</p>
          </div>
        </div>
      </header>
      <div className="mx-auto mt-4 grid w-full gap-2 px-8 sm:px-10 lg:px-12 2xl:px-36">
        {Boolean(expert.calAccount) && (
          <ExpertBooker
            calAccount={{ username: expert.calAccount.username }}
            expert={{
              name: expert.name,
              username: expert.username,
            }}
            eventSlug={eventType.data?.slug}
            customClassNames={{ bookerContainer: "custom-grid border" }}
          />
        )}
      </div>
    </div>
  );
}
