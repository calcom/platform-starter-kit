"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { type ReactNode } from "react";
import { useFormStatus } from "react-dom";

export const ButtonSubmit = ({
  className,
  children,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & ButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <>
      <Button
        type="submit"
        variant="secondary"
        disabled={pending}
        className={cn("w-48 font-normal", className)}
        {...props}>
        {pending ? (
          <div className="flex w-full flex-row justify-evenly">
            <Loader
              className="stroke-offset-foreground/25 h-5 w-5 animate-spin"
              // 1s feels a bit fast
              style={{ animationDuration: "2s" }}
            />
          </div>
        ) : (
          children
        )}
      </Button>
    </>
  );
};
