"use client";

import { signInWithCredentials } from "@/app/_actions";
import { ButtonSubmit } from "@/app/_components/submit-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useFormState } from "react-dom";

export type LoginFormState =
  | {
      inputErrors: {
        email?: string[] | undefined;
        password?: string[] | undefined;
      };
      error?: undefined;
    }
  | {
      error: null;
      inputErrors?: undefined;
    }
  | {
      error: string;
      inputErrors?: undefined;
    };

export function LoginForm() {
  const [formState, dispatch] = useFormState<LoginFormState, FormData>(signInWithCredentials, {
    error: null,
  });

  return (
    <form action={dispatch}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login in to your account.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
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
            <Input id="password" name="password" type="password" required />
            {formState?.inputErrors?.password ? (
              <div className="text-sm font-medium text-red-700" aria-live="polite">
                {formState.inputErrors.password[0]}
              </div>
            ) : null}
          </div>
          <input hidden name="redirectTo" value="/dashboard/getting-started" readOnly />
          {!!formState?.error && <p className="text-sm font-medium text-red-900">{formState.error}</p>}
        </CardContent>
        <CardFooter>
          <div className="flex w-full flex-col">
            <ButtonSubmit variant="default" className="w-full">
              Log in
            </ButtonSubmit>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>{" "}
              instead.
            </div>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
