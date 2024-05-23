import Results from "@/app/_components/home/results";
import SidebarItem from "@/app/_components/home/sidebar-item";
import SignupCard from "@/app/_components/home/signup-card";
import { Layout } from "@/app/_components/universal/layout";
import { sidebarCategories, resultItems } from "@/app/constants";
import type { SidebarCategory } from "@/app/constants";

export const HomeFilters = () => {
  return (
    <Layout flex fullWidth={false}>
      <Layout.Aside>
        {sidebarCategories.map(({ title, items }: SidebarCategory) => (
          <SidebarItem key={title} title={title} items={items} />
        ))}
      </Layout.Aside>
      <Layout.Main>
        <div className="grid grid-cols-2 gap-4 space-x-2 xl:grid-cols-3">
          <SignupCard />
          <Results items={resultItems} />
        </div>
      </Layout.Main>
    </Layout>
  );
};
