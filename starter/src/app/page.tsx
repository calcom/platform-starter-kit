import Results from "./_components/home/results";
import SidebarItem from "./_components/home/sidebar-item";
import SignupCard from "./_components/home/signup-card";
import { Navigation } from "./_components/navigation";
import { SearchBar } from "./_components/search-bar";
import { SignedOut, cachedCurrentUser, currentUser } from "@/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ListFilter, Loader, LogIn } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import { Balancer } from "react-wrap-balancer";

export default async function Home(props: {
  searchParams: {
    q: string | undefined;
    f: Array<{ label: "category" | "freelancer"; selected: Array<string> }> | undefined;
  };
}) {
  const { q: query, f: filters } = props.searchParams;
  const experts = [
    {
      slug: "basement",
      image:
        "https://vercel.com/_next/image?url=https://images.ctfassets.net/e5382hct74si/2cKHP3FPydq6qS76yUDt0r/802ababba7f7b15fcbff2907cd730547/thumb.png&w=2048&q=75&dpl=dpl_EfzrzLzob7m1yj8Yjz3EuANQAvmc",
      title: "basement.studio",
      description:
        "Basement is a multidisciplinary studio based in Mar Del Plata, Buenos Aires, and Los Angeles California.",
    },
    {
      slug: "rubric",
      image:
        "https://images.ctfassets.net/e5382hct74si/6DWvvYVIAezwlxv402Cjgg/f8c7a170db1e31fc80082f12fbb1c796/Cover_Image__DISCOVERY_.svg",
      title: "Rubric",
      description: "Rubric is a digital agency building AI-first software.",
    },
  ]
    // this is the query string search:
    .filter((expert) => {
      if (!query) return true;
      return (
        expert.title.toLowerCase().includes(query?.toLowerCase()) ||
        expert.description.toLowerCase().includes(query?.toLowerCase())
      );
    });

  const sidebarSections = [
    {
      title: "Category",
      items: [
        {
          id: "freelancer",
          label: "Freelancer",
        },
        {
          id: "agency",
          label: "Agency",
        },
        {
          id: "product_studio",
          label: "Product",
        },
      ],
    },
    {
      title: "Capabilities",
      items: [
        {
          id: "ecommerce",
          label: "Ecommerce",
        },
        {
          id: "product_management",
          label: "Product Management",
        },
        {
          id: "app_development",
          label: "App Development",
        },
        {
          id: "design",
          label: "Design",
        },
        {
          id: "ui_ux",
          label: "UI/UX Development",
        },
        {
          id: "integration_services",
          label: "Integration Services",
        },
        {
          id: "branding",
          label: "Branding",
        },
        {
          id: "digital_marketing",
          label: "Digital Marketing",
        },
        {
          id: "mobile_development",
          label: "Mobile Development",
        },
        {
          id: "ai",
          label: "AI",
        },
        {
          id: "",
          label: "Web3 / Crypto",
        },
      ],
    },
    {
      title: "Framework",
      items: [
        {
          id: "nextjs",
          label: "Next.js",
        },
        {
          id: "svelte",
          label: "Svelte",
        },
        {
          id: "nuxtjs",
          label: "Nuxt.js",
        },
        {
          id: "gatsby",
          label: "Gatsby",
        },
        {
          id: "angular",
          label: "Angular",
        },
        {
          id: "ember",
          label: "Ember",
        },
        {
          id: "vue",
          label: "Vue",
        },
      ],
    },
    {
      title: "Budget",
      items: [
        {
          id: "1000",
          label: "$1,000 - $4,999",
        },
        {
          id: "5000",
          label: "$5,000 - $9,999",
        },
        {
          id: "10000",
          label: "$10,000 - $49,999",
        },
        {
          id: "50000",
          label: "$50,000 - $99,999",
        },
        {
          id: "100000",
          label: "$100,000+",
        },
      ],
    },
    {
      title: "Languages Spoken",
      items: [
        {
          id: "english",
          label: "English",
        },
        {
          id: "portugese",
          label: "Portuguese",
        },
        {
          id: "spanish",
          label: "Spanish",
        },
        {
          id: "chinese",
          label: "Chinese",
        },
        {
          id: "french",
          label: "French",
        },
        {
          id: "japanese",
          label: "Japanese",
        },
        {
          id: "german",
          label: "German",
        },
      ],
    },
    {
      title: "Region",
      items: [
        {
          id: "asia",
          label: "Asia",
        },
        {
          id: "australia",
          label: "Australia and New Zealand",
        },
        {
          id: "europe",
          label: "Europe",
        },
        {
          id: "latin_america",
          label: "Latin America",
        },
        {
          id: "middle_east",
          label: "Middle East",
        },
        {
          id: "north_america",
          label: "North America",
        },
      ],
    },
  ];
  // for every filter,
  console.log("filter: (console.dir)");
  console.dir(filters, { depth: 2 });

  // using the cached version here so that we don't re-fetch the user on every search param change with router.replace()
  const user = await cachedCurrentUser();

  return (
    <React.Fragment>
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border/40 bg-muted/40 px-4 py-2 backdrop-blur lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex font-display text-2xl">
          Cal.com <span className="font-display text-sm">®</span>
        </Link>
        <Navigation />
        <div>
          {user ? (
            <Link href="/dashboard">
              <Button className="w-full">
                Dashboard
                <LogIn className="ml-1 size-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/signup">
              <Button className="w-full">Sign Up</Button>
            </Link>
          )}
        </div>
      </header>
      <main className="flex-1">
        <div
          className="flex min-h-96 flex-col justify-center bg-cover bg-center bg-no-repeat py-20"
          style={{ backgroundImage: "url('/hero.jpg')" }}>
          <div className="container mt-16 flex flex-col items-center justify-center gap-12 px-4 py-6">
            <h1 className="font-display text-5xl font-extrabold tracking-tight text-white">
              <Balancer>Find your Cal.com Expert</Balancer>
            </h1>
            <SearchBar />
          </div>
        </div>
        <div className="flex-1">
          <div className="sm:my-10">
            <Suspense
              fallback={
                <div className="relative h-max w-full max-w-sm place-self-center">
                  <div className=" absolute inset-0 z-40 grid rounded-2xl bg-slate-900 text-white">
                    <Loader className="z-50 animate-spin place-self-center" />
                  </div>
                </div>
              }>
              <div className="block max-h-[80vh] sm:flex">
                <div className="flex items-center gap-2 p-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1 sm:hidden">
                        <span>Filter</span>
                        <ListFilter className="size-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="sm:max-w-xs">
                      {sidebarSections.map((section) => (
                        <div key={section.title} className="mb-8 space-y-4 border-b border-gray-200 pb-8">
                          <p className="text-base font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {section.title}
                          </p>
                          {section.items.map((subItem) => (
                            <SidebarItem
                              category={section.title}
                              key={subItem.id}
                              id={subItem.id}
                              label={subItem.label}
                            />
                          ))}
                        </div>
                      ))}
                    </SheetContent>
                  </Sheet>
                </div>
                <aside className="hidden w-full overflow-scroll border-r border-gray-300 p-4 sm:max-h-full sm:w-72 sm:border-0 md:block">
                  {sidebarSections.map((section) => (
                    <div key={section.title} className="mb-8 space-y-4 border-b border-gray-200 pb-8">
                      <p className="text-base font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {section.title}
                      </p>
                      {section.items.map((subItem) => (
                        <SidebarItem
                          category={section.title}
                          key={subItem.id}
                          id={subItem.id}
                          label={subItem.label}
                        />
                      ))}
                    </div>
                  ))}
                </aside>
                <main className="w-full p-4 pt-0">
                  <div className="block grid-cols-3 gap-4 space-x-2 md:grid">
                    <SignedOut>
                      <SignupCard />
                    </SignedOut>
                    <Results items={experts} />
                  </div>
                </main>
              </div>
            </Suspense>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}
