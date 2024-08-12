"use client";

import { deleteEventType } from "./_actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

export function EventTypeDelete({ eventTypeId }: { eventTypeId: number }) {
  const router = useRouter();
  const [_, submitAction, isPendingAction] = useActionState<
    { error: string | null } | { success: string | null },
    number
  >(deleteEventType, { error: null });

  const handleDelete = async () => {
    submitAction(eventTypeId);
    router.refresh();
  };

  return (
    <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
      {isPendingAction ? "Deleting..." : "Delete"}
    </DropdownMenuItem>
  );
}
