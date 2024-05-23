import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type User } from "next-auth";
import Link from "next/link";

interface WelcomeCardProps {
  username: User["name"];
}

export const WelcomeCard = ({ username }: WelcomeCardProps) => {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Welcome back!</CardTitle>
        <CardDescription>
          You&apos;re logged in
          {!!username && (
            <>
              {" "}
              as <b>{username}</b>
            </>
          )}
          .
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Link href="/dashboard">
            <Button className="w-full">Go to dashboard</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
export default WelcomeCard;
