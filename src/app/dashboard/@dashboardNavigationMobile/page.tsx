import { dashboardNavigationData } from "../data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import slugify, { cn } from "@/lib/utils";
import Link from "next/link";

// Note: The root breadcrum is required since optional catch-all routes aren't supported yet by Nextjs parallel routes
export default function DashboardNavigationMobileDefault() {
  const pathname = "/dashboard";
  return (
    <nav className="grid gap-6 text-lg font-medium">
      <Link href="/dashboard" className="group h-10 shrink-0 font-display text-lg font-semibold md:text-base">
        Cal.com <span className="font-display text-xs">®</span>
      </Link>
      {dashboardNavigationData.map((navigationItem) => {
        const hasSubItems = navigationItem.subItems?.length;
        if (!hasSubItems) {
          return (
            <Link
              key={navigationItem.href}
              href={navigationItem.href}
              className={cn(
                "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                navigationItem.href === pathname && "text-muted-foreground"
              )}>
              <navigationItem.icon className="size-5 transition-all group-hover:scale-110" />
              {navigationItem.label}
            </Link>
          );
        }
        return (
          <Accordion type="single" collapsible key={slugify(navigationItem.label)} defaultValue={pathname}>
            <AccordionItem
              value={pathname}
              className="border-b-0"
              key={slugify(navigationItem.label)}
              defaultValue={navigationItem.subItems[0].href}>
              <AccordionTrigger
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  pathname === navigationItem.href && "bg-muted text-primary"
                )}>
                <div className="flex items-center gap-3">
                  <navigationItem.icon className="size-4" />
                  <span>{navigationItem.label}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {navigationItem.subItems.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={cn(
                      "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                      subItem.href === pathname && "text-muted-foreground"
                    )}>
                    <subItem.icon className="size-5 transition-all group-hover:scale-110" />
                    {subItem.label}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </nav>
  );
}
