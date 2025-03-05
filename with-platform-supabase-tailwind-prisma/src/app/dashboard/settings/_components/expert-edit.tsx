"use client";

import { expertEdit } from "@/app/_actions";
import { ButtonSubmit } from "@/app/_components/submit-button";
import { CardDescription } from "@/components/ui/card";
import { Input, type InputProps } from "@/components/ui/input";
import { Textarea, type TextareaProps } from "@/components/ui/textarea";
import { useActionState } from "react";

export default function ExpertEditForm(props: InputProps | TextareaProps) {
  const [state, submitAction, isPendingAction] = useActionState<
    { error: null | string } | { success: null | string },
    FormData
  >(expertEdit, { error: null }, "/dashboard/settings/profile");

  return (
    <form action={submitAction} className="flex flex-col gap-4">
      {props.name === "bio" ? (
        <Textarea
          {...(props as TextareaProps)}
          className="min-w-72 text-balance text-sm leading-relaxed text-muted-foreground"
          disabled={isPendingAction}
        />
      ) : (
        <Input {...(props as InputProps)} disabled={isPendingAction} />
      )}
      {/* display action states (pending, idle, success & error) */}
      {isPendingAction ? (
        <CardDescription>Saving...</CardDescription>
      ) : "success" in state && state.success ? (
        <CardDescription>{state.success}</CardDescription>
      ) : "error" in state && state.error ? (
        <CardDescription className="text-red-900">{state.error}</CardDescription>
      ) : (
        <CardDescription>
          Provide a new {props.name} and hit save to reflect the changes on your public page.
        </CardDescription>
      )}
      <ButtonSubmit size="sm" variant="default">
        Save
      </ButtonSubmit>
    </form>
  );
}
