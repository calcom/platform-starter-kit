"use client";

import { filterSearchParamSchema } from "@/app/_searchParams";
import type { SidebarCategory, SidebarCategoryItem } from "@/app/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useQueryState, parseAsJson } from "nuqs";

export default function SidebarItem({
  id,
  label,
  className,
  category,
  ...props
}: SidebarCategoryItem & {
  className?: string;
  category: SidebarCategory["title"];
} & React.ComponentPropsWithoutRef<typeof Checkbox>) {
  const [filters, setFilters] = useQueryState("f", parseAsJson(filterSearchParamSchema.parse));
  const selectedIds = filters?.[category];

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        className={cn(className)}
        defaultChecked={selectedIds?.includes(id)}
        onCheckedChange={async (checked) => {
          const newSelectedIds = [
            ...(selectedIds?.filter((selectedId) => selectedId !== id) || []),
            ...(checked ? [id] : []),
          ];
          const newCategoryFilter = { [category]: newSelectedIds };

          console.log("newCategoryFilter", newCategoryFilter);

          const { [category]: _, ...withoutCurrentCategory } = newCategoryFilter; // remove current category from filters

          // include new category filter if there are selected ids
          const newFilters = {
            ...withoutCurrentCategory,
            ...(newSelectedIds.length > 0 ? newCategoryFilter : {}),
          };
          await setFilters(newFilters);
        }}
        {...props}
      />
      <Label
        htmlFor={id}
        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </Label>
    </div>
  );
}
