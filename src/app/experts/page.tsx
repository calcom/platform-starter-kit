import { AutocompleteSearch } from "@/app/_components/autocomplete";
import { Hero } from "@/app/_components/universal/hero";
import ExpertList from "@/app/experts/_components/result";
import { professions } from "@/lib/constants";
import { db } from "prisma/client";
import { Balancer } from "react-wrap-balancer";

export const metadata = {
  title: "Search",
  description: "Search for experts on the marketplace.",
};

export default async function ResultsPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const { q: searchValue } = searchParams as Record<string, string>;

  const experts = await db.user.findMany({
    where: {
      professions: {
        some: {
          slug: {
            equals: searchParams?.profession as string,
          },
        },
      },
    },
    include: {
      professions: true,
      services: true,
    },
  });

  return (
    <>
      <Hero title="Find your Cal.com Expert">
        <AutocompleteSearch options={professions} initialSearch={searchValue} />
      </Hero>
      {experts.length > 0 ? (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="flex-1">
            <div className="mx-auto flex max-w-[980px] flex-col items-center justify-center gap-12 px-4 py-6 md:min-w-[50vw]">
              <ExpertList experts={experts} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
