import { dashboardNavigationData } from "../../data";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function DashboardNavigationDesktopSlot(props: {
  params: {
    dashboardSegments: string[];
  };
}) {
  const { dashboardSegments } = props.params;
  const pathname = `/${dashboardSegments.join("/")}`;
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
