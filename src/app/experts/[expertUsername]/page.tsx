import { ExpertBooker } from "./_components/expert-booker";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { db } from "prisma/client";

interface Item {
  name: string;
}

interface ExpertDetailsSectionProps {
  title: string;
  items: Item[];
  itemLimit: number;
}

interface Profession {
  name: string;
}

interface Expert {
  name: string;
  professions: Profession[];
}

function ExpertHeader({ expert }: { expert: Expert }) {
  return (
    <div className="flex items-center gap-x-6">
      <Image
        alt="Expert image"
        className="aspect-square rounded-md object-cover"
        src="https://picsum.photos/200"
        height="64"
        width="64"
      />
      <div>
        <div className="text-sm leading-6 text-muted-foreground">
          {expert.professions.map((profession) => profession.name).join(", ")}
        </div>
        <h1 className="text-2xl font-semibold leading-none tracking-tight">{expert.name}</h1>
      </div>
    </div>
  );
}

function ExpertDetailsSection({ title, items, itemLimit }: ExpertDetailsSectionProps) {
  return (
    <div className="flex flex-col space-y-1.5 p-0 lg:p-6">
      <div className="text-sm leading-6 text-muted-foreground">{title}</div>
      <div className="flex gap-1">
        {items.slice(0, itemLimit).map(({ name }, idx) => (
          <Badge key={name}>{name}</Badge>
        ))}
        {items.length > itemLimit && <Badge>+{items.length - itemLimit} more</Badge>}
      </div>
    </div>
  );
}

export default async function ExpertDetails({ params }: { params: { expertUsername: string } }) {
  console.log("expertUsername: ", params.expertUsername);
  const expert = await db.user.findUnique({
    where: { username: params.expertUsername },
    include: { calAccount: true, services: true, professions: true },
  });
  if (!expert) {
    console.warn("Expert not found", params.expertUsername);
    return <div>Expert not found</div>;
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-4 overflow-auto">
      <div className="flex w-full flex-col justify-between gap-4 rounded-md bg-muted/50 px-8 py-4  sm:px-10 lg:flex-row lg:px-12">
        <ExpertHeader expert={expert} />
        <div className="flex items-center gap-x-4 sm:gap-x-6">
          <ExpertDetailsSection title="Professions" items={expert.professions} itemLimit={2} />
          <ExpertDetailsSection title="Services" items={expert.services} itemLimit={2} />
        </div>
      </div>
      <div className="mx-auto mt-4 grid w-full gap-2 px-8 sm:px-10 lg:px-12">
        <h2 className="text-3xl font-semibold">Availability</h2>
      </div>
      <div className="border-subtle mx-8 mt-12 flex aspect-[2.5/1] flex-col-reverse items-center overflow-x-clip rounded-2xl border bg-muted pb-6 pl-6 pt-6 shadow-sm max-md:pr-6 sm:mx-10 md:grid md:grid-cols-[minmax(440px,1fr)_minmax(0,2.5fr)] lg:mx-12">
        <div className="md:min-w-[96vw] [&_.calcom-atoms]:bg-[transparent]">
          {Boolean(expert.calAccount) && <ExpertBooker calAccount={expert.calAccount!} expert={expert} />}
        </div>
      </div>
    </div>
  );
}
