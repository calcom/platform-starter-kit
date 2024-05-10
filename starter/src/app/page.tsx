import Results from "./_components/results";
import SidebarItem from "./_components/sidebarItem";
import SignupCard from "@/app/_components/signup-card";
import WelcomeCard from "@/app/_components/welcome-card";
import { SignedIn, SignedOut } from "@/auth";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import React, { Suspense } from "react";
import { Balancer } from "react-wrap-balancer";

export default async function Home() {
  return (
    <main>
      <div
        className="flex min-h-96 flex-col justify-center bg-cover bg-center bg-no-repeat py-20"
        style={{ backgroundImage: "url('/hero.jpg')" }}>
        <div className="container mt-16 flex flex-col items-center justify-center gap-12 px-4 py-6">
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-white">
            <Balancer>Find your Cal.com Expert</Balancer>
          </h1>
          <div className="w-full max-w-2xl">
            <Input placeholder="Search for your expert, topic or more" className="h-14 w-full shadow-md" />
            {/*  <AutocompleteSearch options={professions} /> */}
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="sm:my-10">
          <Suspense
            fallback={
              <div className="relative h-max w-full max-w-sm place-self-center">
                <div className=" absolute inset-0 z-40  grid rounded-2xl bg-slate-900 text-white">
                  <Loader className="z-50 animate-spin place-self-center" />
                </div>
              </div>
            }>
            <SignedIn>{({ user }) => <WelcomeCard username={user.name} />}</SignedIn>
            <SignedOut>
              <div className="block sm:flex">
                <aside className="border- max-h-[300px] w-full overflow-scroll border-gray-300 p-4 sm:max-h-full sm:w-72 sm:border-0">
                  <SidebarItem
                    title="Category"
                    items={[
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
                    ]}
                  />
                  <SidebarItem
                    title="Capabilities"
                    items={[
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
                    ]}
                  />
                  <SidebarItem
                    title="Framework"
                    items={[
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
                    ]}
                  />
                  <SidebarItem
                    title="Budget"
                    items={[
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
                    ]}
                  />
                  <SidebarItem
                    title="Languages Spoken"
                    items={[
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
                    ]}
                  />
                  <SidebarItem
                    title="Region"
                    items={[
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
                    ]}
                  />
                </aside>
                <main className="w-full p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <SignupCard />
                    <Results
                      items={[
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
                      ]}
                    />
                  </div>
                </main>
              </div>
            </SignedOut>
          </Suspense>
        </div>
      </div>
    </main>
  );
}
