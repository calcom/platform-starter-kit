import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const SignupCard = () => {
  return (
    <Card className="mx-auto flex items-center">
      <div>
        <CardHeader>
          <CardTitle className="text-xl">
            Are you an expert of <span className="font-display">Cal.com</span>?
          </CardTitle>
          <CardDescription>
            Sign up, connect your calendar and fill your schedule with exciting customers who need help with
            anything Cal.com-related!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Link href="/signup">
              <Button className="w-full">Sign Up</Button>
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
export default SignupCard;
