import { dashboardNavigationData } from "../data";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Note: The root breadcrum is required since optional catch-all routes aren't supported yet by Nextjs parallel routes
export default function DashboardNavigationMobileDefault() {
  return (
    <nav className="grid gap-6 text-lg font-medium">
      <Link href="/dashboard" className="group h-10 shrink-0 font-display text-lg font-semibold md:text-base">
        Cal.com <span className="font-display text-xs">®</span>
      </Link>
      {dashboardNavigationData.map((navigationItem) => {
        return (
          <Link
            key={navigationItem.href}
            href={navigationItem.href}
            className={cn(
              "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
              navigationItem.href === "dashboard" && "text-muted-foreground"
            )}>
            <navigationItem.icon className="size-5 transition-all group-hover:scale-110" />
            {navigationItem.label}
          </Link>
        );
      })}
    </nav>
  );
}
