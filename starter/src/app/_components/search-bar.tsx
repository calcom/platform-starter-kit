"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  return (
    <div className="w-full max-w-2xl">
      <Input
        placeholder="Search for your expert, topic or more"
        className="h-14 w-full shadow-md"
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => {
          console.log(e.target.value);
          // append the query to the URL
          const params = new URLSearchParams(searchParams);
          params.set("q", e.target.value);

          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }}
      />
      {/*  <AutocompleteSearch options={professions} /> */}
    </div>
  );
};
