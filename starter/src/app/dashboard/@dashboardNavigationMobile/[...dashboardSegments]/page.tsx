import { dashboardNavigationData } from "../../data";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function DashboardNavigationMobileSlot(props: {
  params: {
    dashboardSegments: string[];
  };
}) {
  const { dashboardSegments } = props.params;
  const pathname = `/${dashboardSegments.join("/")}`;
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
              pathname !== navigationItem.href && "text-muted-foreground"
            )}>
            <navigationItem.icon className="size-5 transition-all group-hover:scale-110" />
            {navigationItem.label}
          </Link>
        );
      })}
    </nav>
  );
}
