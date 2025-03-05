import { Calendar, Clock, Home, User } from "lucide-react";

export const dashboardNavigationData = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (props: { className?: string }) => <Home className={props.className} />,
  },
  {
    label: "Booking Events",
    href: "/dashboard/settings/booking-events",
    icon: (props: { className?: string }) => <Calendar className={props.className} />,
  },
  {
    label: "Profile",
    href: "/dashboard/settings/profile",
    icon: (props: { className?: string }) => <User className={props.className} />,
  },
  {
    label: "Availability",
    href: "/dashboard/settings/availability",
    icon: (props: { className?: string }) => <Clock className={props.className} />,
  },
];
