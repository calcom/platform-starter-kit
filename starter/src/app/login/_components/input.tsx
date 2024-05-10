import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export const AddonFieldPrefix = (props: { children?: ReactNode; prefix: string }) => {
  return (
    <div className="flex rounded-md bg-muted shadow-sm ring-1 ring-inset ring-input ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-ring focus-within:ring-offset-2 sm:max-w-md">
      <span className="flex h-10 select-none items-center border-none pl-3 text-muted-foreground sm:text-sm">
        {props.prefix}
      </span>
      {props.children}
    </div>
  );
};
export const AddonFieldInput = (props: { className?: string } & InputProps) => {
  const { className } = props;
  return (
    <Input
      {...props}
      className={cn(
        "ml-1 rounded-l-none border-0 ring-0 ring-input focus:ring-0 focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-inset",
        className
      )}
    />
  );
};
