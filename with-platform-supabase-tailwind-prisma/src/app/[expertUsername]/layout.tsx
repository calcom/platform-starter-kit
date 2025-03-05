import { Logo } from "../_components/universal/logo";
import { SignedIn, SignedOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";

export default function ExpertLayout({ children }: { children?: ReactNode }) {
  return (
    <div>
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border/40 bg-muted/90 px-4 py-2 backdrop-blur lg:h-[60px] lg:px-6">
        <Logo />
        {/* 
        Tip: Use this for your own navigation
        <Navigation /> */}
        <div>
          <SignedIn>
            {(_user) => (
              <Link href="/dashboard">
                <Button className="w-full">
                  Dashboard
                  <LogIn className="ml-1 size-4" />
                </Button>
              </Link>
            )}
          </SignedIn>
          <SignedOut>
            <Link href="/signup">
              <Button className="w-full">Sign Up</Button>
            </Link>
          </SignedOut>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
