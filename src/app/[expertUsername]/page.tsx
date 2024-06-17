import { ExpertBooker } from "./_components/expert-booker";
import Image from "next/image";
import { db } from "prisma/client";

export const dynamic = "force-dynamic";
export default async function ExpertDetails({ params }: { params: { expertUsername: string } }) {
  const expert = await db.user.findUnique({
    where: { username: params.expertUsername },
    include: { calAccount: true },
  });
  if (!expert) {
    console.warn("Expert not found", params.expertUsername);
    return <div>Expert not found</div>;
  }
  return (
    <div className="flex flex-1 flex-col items-center gap-4 overflow-auto">
      <div className="flex w-full flex-col justify-between gap-4 rounded-md bg-muted/50 px-8 py-4  sm:px-10 lg:flex-row lg:px-12">
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
      <div className="w-full overflow-hidden [&_.calcom-atoms]:bg-[transparent]">
        <div className="border">
          {Boolean(expert.calAccount) && (
            <div>
              <ExpertBooker calAccount={expert.calAccount!} expert={expert} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
