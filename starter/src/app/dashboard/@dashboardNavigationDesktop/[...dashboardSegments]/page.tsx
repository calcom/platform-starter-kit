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
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
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
