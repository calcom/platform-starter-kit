import { Results } from "./_components/home/results";
import SignupCard from "./_components/home/signup-card";
import { Navigation } from "./_components/navigation";
import { budgetOptions, categoryOptions, frameworkOptions, languageOptions } from "./_hardcoded";
import { SignedIn, SignedOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { type FilterOption, type User } from "@prisma/client";
import { LogIn } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function Home() {
  // TODO: Add profile pic upload
  const images = [
    "https://vercel.com/_next/image?url=https://images.ctfassets.net/e5382hct74si/2cKHP3FPydq6qS76yUDt0r/802ababba7f7b15fcbff2907cd730547/thumb.png&w=2048&q=75&dpl=dpl_EfzrzLzob7m1yj8Yjz3EuANQAvmc",
    "https://images.ctfassets.net/e5382hct74si/6DWvvYVIAezwlxv402Cjgg/f8c7a170db1e31fc80082f12fbb1c796/Cover_Image__DISCOVERY_.svg",
  ];
  // TODO: replace the array of experts with data from our db
  const experts = [
    {
      username: "basement",
      name: "basement.studio",
      bio: "Basement is a multidisciplinary studio based in Mar Del Plata, Buenos Aires, and Los Angeles California.",
      filterOptions: [...categoryOptions, ...budgetOptions, ...languageOptions],
    },
    {
      username: "rubric",
      name: "Rubric",
      bio: "Rubric is a digital agency building AI-first software.",
      filterOptions: [...frameworkOptions],
    },
  ] as const satisfies Array<Partial<User> & { filterOptions: Array<FilterOption> }>;

  return (
    <React.Fragment>
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border/40 bg-muted/40 px-4 py-2 backdrop-blur lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex font-display text-2xl">
          Cal.com <span className="font-display text-sm">®</span>
        </Link>
        <Navigation />
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
      <main className="flex-1">
        <Results
          experts={experts}
          images={images}
          signedOut={
            <SignedOut>
              <SignupCard />
            </SignedOut>
          }
        />
      </main>
    </React.Fragment>
  );
}
