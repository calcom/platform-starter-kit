import { ExpertBooker } from "./_components/expert-booker";
import { auth } from "@/auth";
import Image from "next/image";
import { db } from "prisma/client";

export default async function ExpertDetails({ params }: { params: { expertUsername: string } }) {
  const expert = await db.user.findUnique({
    where: { username: params.expertUsername },
    include: { calAccount: true },
  });
  if (!expert) {
    console.warn("Expert not found", params.expertUsername);
    return <div>Expert not found</div>;
  }
  const sesh = await auth();
  const calAccessToken = sesh.user.calAccessToken;
  return (
    <div className="flex flex-1 flex-col items-center gap-4 overflow-auto">
      <div className="flex w-full flex-col justify-between gap-4 rounded-md bg-muted/50 px-8 py-4  sm:px-10 lg:flex-row lg:px-12">
        <div className="flex items-center gap-x-6">
          <Image
            alt="Expert image"
            className="aspect-square rounded-md object-cover"
            src="https://picsum.photos/200"
            height="64"
            width="64"
          />
          <div>
            <h1 className="text-2xl font-semibold capitalize leading-none tracking-tight">{expert.name}</h1>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-4 grid w-full gap-2 px-8 sm:px-10 lg:px-12">
        <h2 className="text-3xl font-semibold">About Us</h2>
      </div>
      <div className="mx-auto mt-4 grid w-full gap-2 px-8 sm:px-10 lg:px-12">
        <p className="max-w-lg text-balance text-sm leading-relaxed text-muted-foreground">{expert.bio}</p>
      </div>
      <div className="mx-auto mt-4 grid w-full gap-2 px-8 sm:px-10 lg:px-12">
        <h2 className="text-3xl font-semibold">Availability</h2>
      </div>
      <div className="border-subtle mx-8 mt-12 flex aspect-[2.5/1] flex-col-reverse items-center overflow-x-clip rounded-2xl border bg-muted pb-6 pl-6 pt-6 shadow-sm max-md:pr-6 sm:mx-10 md:grid md:grid-cols-[minmax(440px,1fr)_minmax(0,2.5fr)] lg:mx-12">
        <div className="md:min-w-[96vw] [&_.calcom-atoms]:bg-[transparent]">
          {Boolean(expert.calAccount) && (
            <ExpertBooker calAccessToken={calAccessToken} calAccount={expert.calAccount!} expert={expert} />
          )}
        </div>
      </div>
    </div>
  );
}
