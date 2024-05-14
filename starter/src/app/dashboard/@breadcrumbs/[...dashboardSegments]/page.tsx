import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { capitalizeWordsFromSlug } from "@/lib/utils";
import Link from "next/link";
import { Fragment } from "react";

export default function BreadcrumbsSlot(props: {
  params: {
    dashboardSegments: string[];
  };
}) {
  const { dashboardSegments } = props.params;
  // the last section is always our "BreadcrumbPage", the remaining segments are our "BreadcrumbItems":
  const breadcrumbPage = dashboardSegments.pop();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {dashboardSegments.map((segment, idx) => {
          const parentSegments = dashboardSegments.slice(0, idx);
          const parentPath = parentSegments.length > 0 ? `/${parentSegments.join("/")}` : "";
          const href = `${parentPath}/${segment}`;

          return (
            <Fragment key={href}>
              {idx > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link className="transition-colors hover:text-foreground" href={href}>
                    {capitalizeWordsFromSlug(segment)}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Fragment>
          );
        })}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{capitalizeWordsFromSlug(breadcrumbPage)}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
