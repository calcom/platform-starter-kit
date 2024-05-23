import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Item {
  slug: string;
  image: string;
  title: string;
  description: string;
}

interface ResultsProps {
  items: Item[];
}

export default function Results({ items }: ResultsProps) {
  return items.map(({ slug, image, title, description }) => (
    <ResultsCard key={slug} slug={slug} image={image} title={title} description={description} />
  ));
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
  );
}
