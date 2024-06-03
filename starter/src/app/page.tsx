import ResultsCard from "./_components/home/results";
import SidebarItem from "./_components/home/sidebar-item";
import SignupCard from "./_components/home/signup-card";
import { Navigation } from "./_components/navigation";
import { SearchBar } from "./_components/search-bar";
import { filterOptions } from "./_hardcoded";
import { SignedOut, currentUser } from "@/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ListFilter, Loader, LogIn } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import { Balancer } from "react-wrap-balancer";
import { prop, uniqueBy } from "remeda";

export default async function Home(props: {
  searchParams: {
    q: string | undefined;
    f: Array<{ label: "category" | "freelancer"; selected: Array<string> }> | undefined;
  };
}) {
  const { q: query, f: _filters } = props.searchParams;
  // TODO: move to database after signup
  const experts = [
    {
      slug: "basement",
      image:
        "https://vercel.com/_next/image?url=https://images.ctfassets.net/e5382hct74si/2cKHP3FPydq6qS76yUDt0r/802ababba7f7b15fcbff2907cd730547/thumb.png&w=2048&q=75&dpl=dpl_EfzrzLzob7m1yj8Yjz3EuANQAvmc",
      title: "basement.studio",
      description:
        "Basement is a multidisciplinary studio based in Mar Del Plata, Buenos Aires, and Los Angeles California.",
    },
    {
      slug: "rubric",
      image:
        "https://images.ctfassets.net/e5382hct74si/6DWvvYVIAezwlxv402Cjgg/f8c7a170db1e31fc80082f12fbb1c796/Cover_Image__DISCOVERY_.svg",
      title: "Rubric",
      description: "Rubric is a digital agency building AI-first software.",
    },
  ]
    // this is the query string search:
    .filter((expert) => {
      if (!query) return true;
      return (
        expert.title.toLowerCase().includes(query?.toLowerCase()) ||
        expert.description.toLowerCase().includes(query?.toLowerCase())
      );
    });

  // using the cached version here so that we don't re-fetch the user on every search param change with router.replace()
  const user = await currentUser();

  const filtersByCategory = uniqueBy(filterOptions, prop("filterCategoryFieldId"));

  return (
    <React.Fragment>
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border/40 bg-muted/40 px-4 py-2 backdrop-blur lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex font-display text-2xl">
          Cal.com <span className="font-display text-sm">®</span>
        </Link>
        <Navigation />
        <div>
          {user ? (
            <Link href="/dashboard">
              <Button className="w-full">
                Dashboard
                <LogIn className="ml-1 size-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/signup">
              <Button className="w-full">Sign Up</Button>
            </Link>
          )}
        </div>
      </header>
      <main className="flex-1">
        <div
          className="flex min-h-96 flex-col justify-center bg-cover bg-center bg-no-repeat py-20"
          style={{ backgroundImage: "url('/hero.jpg')" }}>
          <div className="container mt-16 flex flex-col items-center justify-center gap-12 px-4 py-6">
            <h1 className="font-display text-5xl font-extrabold tracking-tight text-white">
              <Balancer>Find your Cal.com Expert</Balancer>
            </h1>
            <SearchBar />
          </div>
        </div>
        <div className="flex-1">
          <div className="sm:my-10">
            <Suspense
              fallback={
                <div className="relative h-max w-full max-w-sm place-self-center">
                  <div className=" absolute inset-0 z-40 grid rounded-2xl bg-slate-900 text-white">
                    <Loader className="z-50 animate-spin place-self-center" />
                  </div>
                </div>
              }>
              <div className="block max-h-[80vh] sm:flex">
                <div className="flex items-center gap-2 p-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1 sm:hidden">
                        <span>Filter</span>
                        <ListFilter className="size-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="sm:max-w-xs">
                      {filtersByCategory.map((section) => (
                        <div
                          key={section.filterCategoryValue}
                          className="mb-8 space-y-4 border-b border-gray-200 pb-8">
                          <p className="text-base font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {section.filterCategoryLabel}
                          </p>
                          {filterOptions
                            .filter(
                              (filterOption) =>
                                filterOption.filterCategoryFieldId === section.filterCategoryFieldId
                            )
                            .map((filterOption) => (
                              <SidebarItem
                                category={section.filterCategoryLabel}
                                key={filterOption.fieldId}
                                id={filterOption.fieldId}
                                label={filterOption.fieldLabel}
                              />
                            ))}
                        </div>
                      ))}
                    </SheetContent>
                  </Sheet>
                </div>
                <aside className="hidden w-full overflow-scroll border-r border-gray-300 p-4 sm:max-h-full sm:w-72 sm:border-0 md:block">
                  {filtersByCategory.map((section) => (
                    <div
                      key={section.filterCategoryValue}
                      className="mb-8 space-y-4 border-b border-gray-200 pb-8">
                      <p className="text-base font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {section.filterCategoryLabel}
                      </p>
                      {filterOptions
                        .filter(
                          (filterOption) =>
                            filterOption.filterCategoryFieldId === section.filterCategoryFieldId
                        )
                        .map((filterOption) => (
                          <SidebarItem
                            category={section.filterCategoryValue}
                            key={filterOption.fieldId}
                            id={filterOption.fieldId}
                            label={filterOption.fieldLabel}
                          />
                        ))}
                    </div>
                  ))}
                </aside>
                <main className="w-full p-4 pt-0">
                  <div className="block grid-cols-3 gap-4 space-x-2 md:grid">
                    <SignedOut>
                      <SignupCard />
                    </SignedOut>
                    {experts.map(({ slug, image, title, description }) => (
                      <ResultsCard
                        key={slug}
                        slug={slug}
                        image={image}
                        title={title}
                        description={description}
                        query={query}
                      />
                    ))}
                  </div>
                </main>
              </div>
            </Suspense>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}
