"use client";

import { Input } from "@/components/ui/input";
import { useQueryState, parseAsString } from "nuqs";

export const SearchBar = () => {
  const [query, setQuery] = useQueryState("q", parseAsString);

  return (
    <div className="w-full max-w-2xl">
      <Input
        placeholder="Search for your expert, topic or more"
        className="h-14 w-full shadow-md"
        defaultValue={query ?? ""}
        onChange={async (e) => {
          // append the query to the URL
          await setQuery(e.target.value);
        }}
      />
      {/*  <AutocompleteSearch options={professions} /> */}
    </div>
  );
};
