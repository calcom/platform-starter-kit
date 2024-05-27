"use client";

/* */
import Results from "@/app/_components/home/results";
import SidebarItem from "@/app/_components/home/sidebar-item";
import SignupCard from "@/app/_components/home/signup-card";
import { useBreakpoint } from "@/app/_components/universal/hooks/use-breakpoint";
import { Layout } from "@/app/_components/universal/layout";
import { sidebarCategories, resultItems } from "@/app/constants";
import type { SidebarCategory, ResultItem } from "@/app/constants";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

export const HomeFilters = () => {
  const isMd = useBreakpoint("md");
  if (isMd)
    return (
      <Layout flex fullWidth={false}>
        <Layout.Aside>
          {sidebarCategories.map(({ title, items }: SidebarCategory) => (
            <SidebarItem key={title} title={title} items={items} />
          ))}
        </Layout.Aside>
        <Layout.Main>
          <div className="grid grid-cols-2 gap-4 space-x-2 xl:grid-cols-3">
            <SignupCard />
            <Results items={resultItems} />
          </div>
        </Layout.Main>
      </Layout>
    );

  return (
    <>
      <Layout flex fullWidth={false} align="end">
        <div className="flex flex-row-reverse px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="openFilters">Open Filters</Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="pretty-scrollbar flex-col overflow-y-scroll">
                {sidebarCategories.map(({ title, items }: SidebarCategory) => (
                  <SidebarItem key={title} title={title} items={items} />
                ))}
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">Close</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </Layout>
      <Layout flex fullWidth={false} align="center">
        <div className="grid grid-cols-2 gap-4 space-x-2 p-4 xl:grid-cols-3 ">
          <SignupCard />
          <Results items={resultItems as ResultItem[]} />
        </div>
      </Layout>
    </>
  );
};
