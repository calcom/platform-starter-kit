import { cn } from "@/lib/utils";
import { Home, Settings } from "lucide-react";
import Link from "next/link";

const dashboardNavigationData = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (props: { className?: string }) => <Home className={props.className} />,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: (props: { className?: string }) => <Settings className={props.className} />,
  },
];
export default function DashboardNavigationMobileSlot(props: {
  params: {
    dashboardSegments: string[];
  };
}) {
  const { dashboardSegments } = props.params;
  const pathname = `/${dashboardSegments.join("/")}`;
  return (
    <nav className="grid gap-6 text-lg font-medium">
      <Link
        href="/dashboard"
        className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary font-display text-lg font-semibold text-primary-foreground md:text-base">
        Cal.com <span className="font-display text-xs">®</span>
      </Link>
      {dashboardNavigationData.map((navigationItem) => {
        console.log("pathname: ", pathname);
        console.log("navigationItem.href: ", navigationItem.href);
        console.log("pathname === navigationItem.href: ", pathname === navigationItem.href);
        if (pathname === navigationItem.href) {
          console.log(
            "cn: ",
            cn(
              "group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base",
              pathname === navigationItem.href && "bg-muted text-primary"
            )
          );
        }
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
