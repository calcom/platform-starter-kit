"use client";

import { type filterOptions } from "@/app/_hardcoded";
import { filterSearchParamSchema } from "@/app/_searchParams";
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
}: {
  className?: string;
  id: (typeof filterOptions)[number]["fieldId"];
  label: (typeof filterOptions)[number]["fieldLabel"];
  category: (typeof filterOptions)[number]["filterCategoryFieldId"];
} & React.ComponentPropsWithoutRef<typeof Checkbox>) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const [filters, setFilters] = useQueryState("f", parseAsJson(filterSearchParamSchema.parse));
  const selectedIds = filters?.[category];

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        className={cn(className)}
        // @ts-expect-error id could be anything
        defaultChecked={selectedIds?.includes(id)}
        onCheckedChange={async (checked) => {
          const newSelectedIds = [
            ...(selectedIds?.filter((selectedId) => selectedId !== id) || []),
            ...(checked ? [id] : []),
          ];
          const newCategoryFilter = { [category]: newSelectedIds };

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
