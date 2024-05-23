export type SidebarCategory = {
  title: string;
  items: Array<{
    id: string;
    label: string;
  }>;
};

export const sidebarCategories: SidebarCategory = [
  {
    title: "Category",
    items: [
      { id: "freelancer", label: "Freelancer" },
      { id: "agency", label: "Agency" },
      { id: "product_studio", label: "Product" },
    ],
  },
  {
    title: "Capabilities",
    items: [
      { id: "ecommerce", label: "Ecommerce" },
      { id: "product_management", label: "Product Management" },
      { id: "app_development", label: "App Development" },
      { id: "design", label: "Design" },
      { id: "ui_ux", label: "UI/UX Development" },
      { id: "integration_services", label: "Integration Services" },
      { id: "branding", label: "Branding" },
      { id: "digital_marketing", label: "Digital Marketing" },
      { id: "mobile_development", label: "Mobile Development" },
      { id: "ai", label: "AI" },
      { id: "", label: "Web3 / Crypto" },
    ],
  },
  {
    title: "Framework",
    items: [
      { id: "nextjs", label: "Next.js" },
      { id: "svelte", label: "Svelte" },
      { id: "nuxtjs", label: "Nuxt.js" },
      { id: "gatsby", label: "Gatsby" },
      { id: "angular", label: "Angular" },
      { id: "ember", label: "Ember" },
      { id: "vue", label: "Vue" },
    ],
  },
  {
    title: "Budget",
    items: [
      { id: "1000", label: "$1,000 - $4,999" },
      { id: "5000", label: "$5,000 - $9,999" },
      { id: "10000", label: "$10,000 - $49,999" },
      { id: "50000", label: "$50,000 - $99,999" },
      { id: "100000", label: "$100,000+" },
    ],
  },
  {
    title: "Languages Spoken",
    items: [
      { id: "english", label: "English" },
      { id: "portugese", label: "Portuguese" },
      { id: "spanish", label: "Spanish" },
      { id: "chinese", label: "Chinese" },
      { id: "french", label: "French" },
      { id: "japanese", label: "Japanese" },
      { id: "german", label: "German" },
    ],
  },
  {
    title: "Region",
    items: [
      { id: "asia", label: "Asia" },
      { id: "australia", label: "Australia and New Zealand" },
      { id: "europe", label: "Europe" },
      { id: "latin_america", label: "Latin America" },
      { id: "middle_east", label: "Middle East" },
      { id: "north_america", label: "North America" },
    ],
  },
];

interface ResultItem {
  slug: string;
  image: string;
  title: string;
  description: string;
}

export const resultItems: ResultItem[] = [
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
];
