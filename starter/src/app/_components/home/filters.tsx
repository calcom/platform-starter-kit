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
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";

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
        <div className="dialog flex flex-row-reverse px-4">
          <Dialog modal={false}>
            <DialogTrigger asChild>
              <Button className="openFilters">Open Filters</Button>
            </DialogTrigger>
            <DialogPortal>
              <DialogOverlay className="dialogOverlay" />
              <DialogContent className="dialogContent">
                <div className="flex max-h-[90vh] flex-col overflow-x-auto">
                  {sidebarCategories.map(({ title, items }: SidebarCategory) => (
                    <SidebarItem key={title} title={title} items={items} />
                  ))}
                </div>
                <DialogClose asChild>
                  <Button className="IconButton" aria-label="Close">
                    Close
                  </Button>
                </DialogClose>
              </DialogContent>
            </DialogPortal>
          </Dialog>
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
