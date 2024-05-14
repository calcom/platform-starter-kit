import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

// Note: The root breadcrum is required since optional catch-all routes aren't supported yet by Nextjs parallel routes
export default function DashboardNavigationDesktopDefault() {
  console.log("do i log here??");
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      <Link
        href="#"
        className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary">
        <Skeleton className="size-4" />
        <Skeleton className="h-4 w-10" />
      </Link>
    </nav>
  );
}
