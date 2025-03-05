"use client";

import { SearchBar } from "../search-bar";
import SidebarItem from "./sidebar-item";
import { filterOptions } from "@/app/_hardcoded";
import { filterSearchParamSchema } from "@/app/_searchParams";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { type FilterOption, type User } from "@prisma/client";
import { ListFilter, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQueryState, parseAsString, parseAsJson } from "nuqs";
import { type db } from "prisma/client";
import { Fragment, type ReactEventHandler, useState, type SyntheticEvent } from "react";
import React, { Suspense } from "react";
import { Balancer } from "react-wrap-balancer";
import { prop, uniqueBy } from "remeda";

export default function ResultsCard({
  slug,
  userId,
  title,
  description,
  query,
}: {
  slug: string;
  userId?: string;
  title: string;
  description: string;
  query?: string;
}) {
  const queryIndexTitle = title.toLowerCase().indexOf(query?.toLowerCase() ?? "");
  const queryIndexDescription = description.toLowerCase().indexOf(query?.toLowerCase() ?? "");
  const [error, setError] = useState<SyntheticEvent<HTMLImageElement, Event> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link href={"/" + slug} className="col-span-1 flex">
      <Card className="mx-auto overflow-hidden transition-all ease-in-out hover:rotate-1 hover:scale-105 hover:shadow-lg">
        <div
          className={cn(
            "h-[265px] w-[380px] rounded-md",
            error && "bg-muted",
            isLoading && "animate-pulse bg-muted"
          )}>
          {!error && (
            <Image
              src={`avatars/${userId}?width=380&height=265`}
              alt={title}
              className="h-full w-full rounded-md object-cover"
              height={265}
              width={380}
              objectFit="cover"
              onLoadingComplete={() => setIsLoading(false)}
              onError={setError}
            />
          )}
        </div>
        <CardHeader>
          <CardTitle className="text-xl">
            {/* this highlights the search query for the title */}
            {queryIndexTitle != undefined && query ? (
              <>
                {title.substring(0, queryIndexTitle)}
                <span className="bg-yellow-300">
                  {title.substring(queryIndexTitle, queryIndexTitle + query.length)}
                </span>
                {title.substring(queryIndexTitle + query.length)}
              </>
            ) : (
              title
            )}
          </CardTitle>
          <CardDescription>
            {/* this highlights the search query for the title */}
            {queryIndexDescription != undefined && query ? (
              <>
                {description.substring(0, queryIndexDescription)}
                <span className="bg-yellow-300">
                  {description.substring(queryIndexDescription, queryIndexDescription + query.length)}
                </span>
                {description.substring(queryIndexDescription + query.length)}
              </>
            ) : (
              description
            )}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
type UsersWithFilterOptions = Awaited<
  ReturnType<
    typeof db.user.findMany<{
      include: { selectedFilterOptions: { include: { filterOption: true } } };
    }>
  >
>;
export function Results(props: { experts: UsersWithFilterOptions; signedOut: JSX.Element }) {
  const [query] = useQueryState("q", parseAsString);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const [filters] = useQueryState("f", parseAsJson(filterSearchParamSchema.parse));
  const filtersByCategory = uniqueBy(filterOptions, prop("filterCategoryFieldId"));

  // this is the query string search:
  const experts = props.experts
    .filter((expert) => {
      if (!query) return true;
      return (
        expert?.name?.toLowerCase().includes(query?.toLowerCase()) ||
        expert?.bio?.toLowerCase().includes(query?.toLowerCase())
      );
    })
    // this is the filter search:
    .filter((expert) => {
      if (!filters) return true;
      const expertSelectedOptions = expert.selectedFilterOptions ?? [];
      // if we have filters selected, let's only show the experts who have all the selected filters:
      return Object.entries(filters).every(([_filterCategoryFieldId, filterValues]) => {
        if (!filterValues) return true;
        return filterValues.every((filterValue) =>
          expertSelectedOptions.find((option) => option.filterOption.fieldValue === filterValue)
        );
      });
    });
  return (
    <Fragment>
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
                <div className="absolute inset-0 z-40 grid rounded-2xl bg-slate-900 text-white">
                  <Loader className="z-50 animate-spin place-self-center" />
                </div>
              </div>
            }>
            <div className="block sm:flex">
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
                              category={section.filterCategoryFieldId}
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
                        (filterOption) => filterOption.filterCategoryFieldId === section.filterCategoryFieldId
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
                <div className="grid grid-cols-1 gap-4 space-x-2 md:grid-cols-3 2xl:grid-cols-4">
                  {!query && props.signedOut}
                  {experts.length ? (
                    experts.map(({ username, name, bio, id }) => (
                      <ResultsCard
                        key={username}
                        slug={username ?? ""}
                        userId={id ?? ""}
                        title={name ?? "Your title"}
                        description={bio ?? "Your bio"}
                        query={query ?? undefined}
                      />
                    ))
                  ) : (
                    <Card className="mx-auto flex items-center">
                      <div>
                        <CardHeader>
                          <CardTitle className="text-xl">No experts found</CardTitle>
                          <CardDescription>
                            We&rsquo;ve filtered our experts based on your search query and selected filters:
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Query</Label>
                              <p className="col-span-3 max-w-lg text-balance text-sm leading-relaxed">
                                {query ?? "No search query provided"}
                              </p>
                              <Label className="text-right">Filters</Label>
                              <p className="col-span-3 max-w-lg text-balance text-sm capitalize leading-relaxed">
                                {Object.keys(filters ?? {}).length
                                  ? Object.entries(filters ?? {})
                                      .map(([filterCategory, filterValues]) => {
                                        return `${filterCategory}: ${filterValues.join(", ")}`;
                                      })
                                      .join(", ")
                                  : "No filters selected"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  )}
                </div>
              </main>
            </div>
          </Suspense>
        </div>
      </div>
    </Fragment>
  );
}
