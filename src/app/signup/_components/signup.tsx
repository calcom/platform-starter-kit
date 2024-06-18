"use client";

import { signUpWithCredentials } from "@/app/_actions";
import { AddonFieldInput, AddonFieldPrefix } from "@/app/signup/_components/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useFormState } from "react-dom";

type TSignUpFormState = {
  error?: string | null;
  inputErrors?: {
    name?: string[];
    username?: string[];
    email?: string[];
    password?: string[];
    bio?: string[];
    categories?: string[];
    capabilities?: string[];
    frameworks?: string[];
    budgets?: string[];
    languages?: string[];
    regions?: string[];
  };
};

export const SignupForm = () => {
  const [formState, dispatch] = useFormState<TSignUpFormState, FormData>(signUpWithCredentials, {
    error: null,
  });

  return (
    <form action={dispatch}>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
              {formState?.inputErrors?.name ? (
                <div className="text-sm font-medium text-red-700" aria-live="polite">
                  {formState.inputErrors.name[0]}
                </div>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <AddonFieldPrefix prefix="experts.cal.com/">
                <AddonFieldInput id="username" name="username" placeholder="john-doe" required />
              </AddonFieldPrefix>
              {formState?.inputErrors?.username ? (
                <div className="text-sm font-medium text-red-700" aria-live="polite">
                  {formState.inputErrors.username[0]}
                </div>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              {formState?.inputErrors?.email ? (
                <div className="text-sm font-medium text-red-700" aria-live="polite">
                  {formState.inputErrors.email[0]}
                </div>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" />
              {formState?.inputErrors?.password ? (
                <div className="text-sm font-medium text-red-700" aria-live="polite">
                  {formState.inputErrors.password[0]}
                </div>
              ) : null}
            </div>

            {formState?.error ? (
              <div className="text-sm font-medium text-red-700" aria-live="polite">
                {formState.error}
              </div>
            ) : null}
            <input hidden name="redirectTo" value="/dashboard/getting-started" readOnly />
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
export default SignupForm;
