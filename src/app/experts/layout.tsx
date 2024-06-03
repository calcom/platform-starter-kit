import { AutocompleteSearch } from "@/app/_components/autocomplete";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { professions } from "@/lib/constants";
import { Home, Package2, PanelLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";

export default function ExpertLayout({
  children,
  breadcrumbs,
}: {
  children?: ReactNode;
  breadcrumbs: ReactNode;
}) {
  return (
    <div>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex  h-14 max-w-screen-2xl items-center px-4 sm:container">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
                  <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Home</span>
                </Link>
                <Link
                  href="/experts"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                  <Home className="h-5 w-5" />
                  Search
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                  <ShoppingCart className="h-5 w-5" />
                  Expert
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          {breadcrumbs}
          <div className="flex flex-1 items-center justify-end sm:space-x-4">
            <AutocompleteSearch options={professions} className="" placement="header" />
            <span className="hidden sm:inline">OR</span>
            <Link href="/signup">
              <Button className="hidden sm:flex">Sign up as Expert</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
