import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import slugify, { cn } from "@/lib/utils";
import { Calendar, Clock, Home, Settings, User } from "lucide-react";
import Link from "next/link";

const dashboardNavigationData = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (props: { className?: string }) => <Home className={props.className} />,
  },
  {
    label: "Settings",
    icon: (props: { className?: string }) => <Settings className={props.className} />,
    subItems: [
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
      {
        label: "Booking Events",
        href: "/dashboard/settings/booking-events",
        icon: (props: { className?: string }) => <Calendar className={props.className} />,
      },
    ],
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
        const hasSubItems = navigationItem.subItems?.length;
        if (!hasSubItems) {
          return (
            <Link
              key={navigationItem.href}
              href={navigationItem.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary hover:underline",
                pathname === navigationItem.href && "bg-muted text-primary"
              )}
              prefetch={false}>
              <navigationItem.icon className="size-4" />
              {navigationItem.label}
            </Link>
          );
        }
        return (
          <Accordion
            type="single"
            collapsible
            className="w-full"
            key={slugify(navigationItem.label)}
            defaultValue={pathname}>
            <AccordionItem
              value={pathname}
              className="border-b-0"
              key={slugify(navigationItem.label)}
              defaultValue={navigationItem.subItems[0].href}>
              <AccordionTrigger
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  pathname === navigationItem.href && "bg-muted text-primary"
                )}>
                <div className="flex items-center gap-3">
                  <navigationItem.icon className="size-4" />
                  <span>{navigationItem.label}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {navigationItem.subItems.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                      pathname === subItem.href && "bg-muted text-primary",
                      "ml-6 hover:underline"
                    )}
                    prefetch={false}>
                    <subItem.icon className="size-4" />
                    {subItem.label}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </nav>
  );
}
