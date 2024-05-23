import { cn } from "@/lib/utils";
import React from "react";

type BaseProps = {
  children: React.ReactNode;
  className?: string;
};

type LayoutProps = BaseProps & {
  flex?: boolean;
  fullWidth?: boolean;
};

export const LayoutAside = ({ children, className }: BaseProps) => {
  return <aside className={`layout-aside min-w-[260px] p-4 ${className}`}>{children}</aside>;
};

export const LayoutMain = ({ children, className }: BaseProps) => {
  return <main className={`layout-main p-4  ${className}`}>{children}</main>;
};

export const Layout = ({ children, className, flex = false, fullWidth = true }: BaseProps & LayoutProps) => {
  return (
    <div
      className={cn(
        "layout mx-auto my-0",
        flex && "flex flex-1 justify-center",
        !fullWidth && `max-w-screen-2xl`,
        className
      )}>
      {children}
    </div>
  );
};

Layout.Aside = LayoutAside;
Layout.Main = LayoutMain;
