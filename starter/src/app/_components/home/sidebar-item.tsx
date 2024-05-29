"use client";

import type { SidebarCategory, SidebarCategoryItem } from "@/app/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filterParams = JSON.parse(searchParams.get("f") || "{}") as Record<
    string,
    string[] | Record<string, never>
  >;
  const selectedIds = filterParams[category];

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        className={cn(className)}
        defaultChecked={selectedIds?.includes(id)}
        onCheckedChange={(checked) => {
          const newSelectedIds = [
            ...(selectedIds?.filter((selectedId) => selectedId !== id) || []),
            ...(checked ? [id] : []),
          ];
          const newCategoryFilter = { [category]: newSelectedIds };

          const { [category]: _, ...withoutCurrentCategory } = filterParams; // remove current category from filters

          // include new category filter if there are selected ids
          const newFilters = {
            ...withoutCurrentCategory,
            ...(newSelectedIds.length > 0 ? newCategoryFilter : {}),
          };
          const params = new URLSearchParams({ f: JSON.stringify(newFilters) });
          router.replace(
            `${pathname}${Object.keys(newFilters).length ? `?${params.toString()}` : ""}${searchParams.get("q") ? `&q=${searchParams.get("q")}` : ""}`,
            { scroll: false }
          );
        }}
        {...props}
      />
      <label
        htmlFor={id}
        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
    </div>
  );
}
