import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

// Note: The root breadcrum is required since optional catch-all routes aren't supported yet by Nextjs parallel routes
export default function DashboardNavigationMobileDefault() {
  return (
    <nav className="grid gap-6 text-lg font-medium">
      <Link
        href="#"
        className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary font-display text-lg font-semibold text-primary-foreground md:text-base">
        <Skeleton className="size-5" />
        <Skeleton className="h-5 w-10" />
      </Link>
    </nav>
  );
}
