import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Results({ items }: { items: any }) {
  return (
    <>
      {items.map((item: { slug: string; image: string; title: string; description: string }) => (
        <ResultsCard
          key={item.slug}
          slug={item.slug}
          image={item.image}
          title={item.title}
          description={item.description}
        />
      ))}
    </>
  );
}

function ResultsCard({
  slug,
  image,
  title,
  description,
}: {
  slug: string;
  image: string;
  title: string;
  description: string;
}) {
  return (
    <>
      <Link href={"/" + slug}>
        <Card className="mx-auto max-w-sm overflow-hidden transition-all ease-in-out hover:rotate-1 hover:scale-105 hover:shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={title} />
          <CardHeader>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
        </Card>
      </Link>
    </>
  );
}
