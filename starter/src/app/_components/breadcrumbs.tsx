import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { type ReactElement } from "react";

/**
 *
 * This Breadcrumbs component renders a list of BreadcrumbItems & a BreadcrumPage.
 * The initial BreadcrumItem is called an "Outlet" and defaults to path = "/",
 * @param param0
 * @returns
 */
export function Breadcrumbs({
  segments = [],
  outlet = { path: "/", title: "Home" },
}: {
  segments: string[];
  outlet?: { path: string; title: string };
}) {
  // the last section is always our "BreadcrumbPage":
  const breadcrumPage = segments.pop();

  // for the remaining segments, let's build out our BreadcrumItems tree with a for...of loop:
  let href = `/${outlet.path}`;
  const breadcrumbItems: ReactElement[] = [];
  for (const segment of segments) {
    href = `${href}/${segment}`;

    breadcrumbItems.push(
      <React.Fragment key={href}>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
        </BreadcrumbItem>
      </React.Fragment>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={outlet.path}>{outlet.title}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {/* Then we have our dynamically built segments */}
        {breadcrumbItems}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{breadcrumPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
