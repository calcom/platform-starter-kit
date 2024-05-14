import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { capitalizeWordsFromSlug } from "@/lib/utils";
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

          const segmentAsWords = segment
            .split("-")
            .map((word) => {
              // Capitalize the first letter of each word
              return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
          return (
            <Fragment key={href}>
              {idx > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <BreadcrumbLink href={href}>{capitalizeWordsFromSlug(segment)}</BreadcrumbLink>
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
