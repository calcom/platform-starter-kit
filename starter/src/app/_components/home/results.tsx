import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ResultsCard({
  slug,
  image,
  title,
  description,
  query,
}: {
  slug: string;
  image: string;
  title: string;
  description: string;
  query: string;
}) {
  const queryIndexTitle = title.toLowerCase().indexOf(query.toLowerCase());
  const queryIndexDescription = description.toLowerCase().indexOf(query.toLowerCase());

  console.log({
    query,
    before: title.substring(0, queryIndexTitle),
    match: title.substring(queryIndexTitle, queryIndexTitle + query.length),
    after: title.substring(queryIndexTitle + query.length),
  });
  return (
    <Link href={"/" + slug}>
      <Card className="mx-auto overflow-hidden transition-all ease-in-out hover:rotate-1 hover:scale-105 hover:shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={title} />
        <CardHeader>
          <CardTitle className="text-xl">
            {/* this highlights the search query for the title */}
            {queryIndexTitle != undefined && query ? (
              <>
                {title.substring(0, queryIndexTitle)}
                <span className="bg-yellow-300">
                  {title.substring(queryIndexTitle, queryIndexTitle + query.length)}
                </span>
                {title.substring(queryIndexTitle + query.length)}
              </>
            ) : (
              title
            )}
          </CardTitle>
          <CardDescription>
            {/* this highlights the search query for the title */}
            {queryIndexDescription != undefined && query ? (
              <>
                {description.substring(0, queryIndexDescription)}
                <span className="bg-yellow-300">
                  {description.substring(queryIndexDescription, queryIndexDescription + query.length)}
                </span>
                {description.substring(queryIndexDescription + query.length)}
              </>
            ) : (
              description
            )}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
