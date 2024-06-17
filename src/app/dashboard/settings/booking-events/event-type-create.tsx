"use client";

import createEventType from "./_actions";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useActionState } from "react";

export default function EventTypeCreateForm({
  children,
  className,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
} & { permalink?: NonNullable<Parameters<typeof useActionState>["2"]> }) {
  const [state, submitAction, isPendingAction] = useActionState<
    { error: string | null } | { success: string | null },
    FormData
  >(createEventType, { error: null }, props.permalink);
  return (
    <form action={submitAction} className={cn(className)}>
      {isPendingAction ? (
        <DialogDescription>Saving...</DialogDescription>
      ) : "success" in state && state.success ? (
        <DialogDescription>{state.success} You can close the dialog now.</DialogDescription>
      ) : "error" in state && state.error ? (
        <DialogDescription>{state.error.replace("'", "&rsquo;")}</DialogDescription>
      ) : (
        <DialogDescription>
          Create your new booking event here. Click save when you&rsquo;re done.
        </DialogDescription>
      )}
      {children}
    </form>
  );
}
