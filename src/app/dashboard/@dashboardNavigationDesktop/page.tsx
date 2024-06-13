import { dashboardNavigationData } from "../data";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Note: The root breadcrum is required since optional catch-all routes aren't supported yet by Nextjs parallel routes
export default function DashboardNavigationDesktopDefault() {
  const pathname = "/dashboard";
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {dashboardNavigationData.map((navigationItem) => {
        return (
          <Link
            key={navigationItem.href}
            href={navigationItem.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted/50 hover:text-primary",
              pathname === navigationItem.href && "bg-muted text-primary"
            )}
            prefetch={false}>
            <navigationItem.icon className="size-4" />
            {navigationItem.label}
          </Link>
        );
      })}
    </nav>
  );
}
