import { cn } from "@/lib/utils";
import { Settings, Home } from "lucide-react";
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
// Note: The root breadcrum is required since optional catch-all routes aren't supported yet by Nextjs parallel routes
export default function DashboardNavigationDesktopDefault() {
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {dashboardNavigationData.map((navigationItem) => {
        return (
          <Link
            key={navigationItem.href}
            href={navigationItem.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              navigationItem.href === "/dashboard" && "bg-muted text-primary"
            )}>
            <navigationItem.icon className="size-4" />
            {navigationItem.label}
          </Link>
        );
      })}
    </nav>
  );
}
