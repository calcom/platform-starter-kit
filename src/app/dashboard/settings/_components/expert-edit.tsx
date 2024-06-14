"use client";

import { expertEdit } from "@/app/_actions";
import { ButtonSubmit } from "@/app/_components/submit-button";
import { CardDescription } from "@/components/ui/card";
import { Input, type InputProps } from "@/components/ui/input";
import { Textarea, type TextareaProps } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { useActionState } from "react";

export default function ExpertEditForm(props: InputProps | TextareaProps) {
  const [state, submitAction, isPendingAction] = useActionState<
    { error: null | string } | { success: null | string },
    FormData
  >(expertEdit, { error: null }, "/dashboard/settings/profile");

  return (
    <form action={submitAction}>
      <div className="mb-2 flex w-full max-w-sm items-center space-x-2">
        <div className="relative rounded-md shadow-sm">
          {props.name === "bio" ? (
            <Textarea
              {...(props as TextareaProps)}
              className="min-w-72 max-w-2xl text-balance text-sm leading-relaxed text-muted-foreground"
              disabled={isPendingAction}
            />
          ) : (
            <Input
              {...(props as InputProps)}
              className="text-2xl font-semibold leading-none tracking-tight"
              disabled={isPendingAction}
            />
          )}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pl-2 pr-3">
            <Pencil className="size-4 text-muted-foreground" />
          </div>
        </div>
        <ButtonSubmit variant="default" size="lg" className="max-w-max">
          Save
        </ButtonSubmit>
      </div>
      {/* display action states (pending, idle, success & error) */}
      {isPendingAction ? (
        <CardDescription>Saving...</CardDescription>
      ) : "success" in state && state.success ? (
        <CardDescription>{state.success}</CardDescription>
      ) : "error" in state && state.error ? (
        <CardDescription>{state.error}</CardDescription>
      ) : (
        <CardDescription>Please provide a new {props.name}.</CardDescription>
      )}
    </form>
  );
}
