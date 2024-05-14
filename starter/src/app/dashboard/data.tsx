import { Home, Settings } from "lucide-react";

export const dashboardNavigationData = [
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
