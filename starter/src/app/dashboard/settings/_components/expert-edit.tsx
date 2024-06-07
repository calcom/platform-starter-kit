"use client";

import { expertEdit } from "@/app/_actions";
import { Button } from "@/components/ui/button";
import { Input, type InputProps } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useFormState } from "react-dom";

export default function ExpertEditForm(props: InputProps) {
  const [result, dispatch] = useFormState<
    { error: string; data: null } | { data: string; error: null } | { error: null; data: null }
    // @ts-expect-error - unsure why the types are wrong here?
  >(expertEdit, {
    error: null,
    data: null,
  });
  return (
    <form action={dispatch}>
      <div className="mb-2 flex w-full max-w-sm items-center space-x-2">
        <div className="relative rounded-md shadow-sm">
          <Input
            // id="name"
            // name="name"
            // placeholder={props.expertName}
            {...props}
            className="text-2xl font-semibold capitalize leading-none tracking-tight"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <Pencil className="size-4 text-muted-foreground" />
          </div>
        </div>
        <Button type="submit">Save</Button>
      </div>
      {result?.error && <div className="text-sm text-destructive">{result.error}</div>}
      {result?.data && <div className="text-sm text-success">Saved!</div>}
    </form>
  );
}
