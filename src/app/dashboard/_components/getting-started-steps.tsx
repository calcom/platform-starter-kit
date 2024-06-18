"use client";

import SupabaseReactDropzone from "../settings/_components/supabase-react-dropzone";
import { expertEdit } from "@/app/_actions";
import { addUserFilters } from "@/app/_actions";
import { FancyMultiSelect, type Option } from "@/app/_components/multi-select";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Step, Stepper, useStepper, type StepItem } from "@/components/ui/stepper";
import { Textarea } from "@/components/ui/textarea";
import { GcalConnect } from "@calcom/atoms";
import { type FilterOption } from "@prisma/client";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { uniqueBy, prop } from "remeda";

const steps = [
  { id: "connect-calendar", label: "Step 1" },
  { id: "filters", label: "Step 2" },
  { id: "avatar-and-bio", label: "Step 3" },
] satisfies StepItem[];

const ConnectCalendarStep = () => {
  const { isDisabledStep, prevStep, isLastStep, isOptionalStep, nextStep } = useStepper();

  const handleNextStep = () => {
    nextStep();
  };

  return (
    <>
      <Card className="mx-auto mt-5 w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Getting Started</CardTitle>
          <CardDescription>Connect your calendar to get started.</CardDescription>
        </CardHeader>
        <CardFooter className="[&>div]:w-full">
          <Suspense
            fallback={
              <div className="relative h-max w-full max-w-sm place-self-center">
                <div className=" absolute inset-0 z-40 grid rounded-2xl bg-slate-900 text-white">
                  <Loader className="z-50 animate-spin place-self-center" />
                </div>
              </div>
            }>
            <GcalConnect className="flex w-full items-center justify-center [&>svg]:mr-2" />
          </Suspense>
        </CardFooter>
      </Card>
      <div>
        <Button disabled={isDisabledStep} onClick={prevStep} size="sm" variant="secondary">
          Prev
        </Button>
        <Button size="sm" onClick={handleNextStep}>
          {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
        </Button>
      </div>
    </>
  );
};

type TUserFiltersFormState = {
  error?: string | null;
  inputErrors?: {
    categories?: string[];
    capabilities?: string[];
    frameworks?: string[];
    budgets?: string[];
    languages?: string[];
    regions?: string[];
  };
};

const UserFilters = ({ filterOptions }: { filterOptions: Array<FilterOption> }) => {
  const [formState, dispatch] = useFormState<TUserFiltersFormState, FormData>(addUserFilters, {
    error: null,
  });
  const { isDisabledStep, prevStep } = useStepper();
  const { pending } = useFormStatus();
  console.log("formState", formState);

  const filtersByCategory = uniqueBy(filterOptions, prop("filterCategoryFieldId"));

  return (
    <form action={dispatch} className="mt-5">
      {filtersByCategory.map(({ filterCategoryFieldId, filterCategoryLabel }) => (
        <div className="grid gap-2" key={filterCategoryFieldId}>
          <Label htmlFor="email">{filterCategoryLabel}</Label>
          <FancyMultiSelect
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            options={filterOptions
              .filter((filterOption) => filterOption.filterCategoryLabel === filterCategoryLabel)
              .map(
                (filterOption) =>
                  ({
                    label: filterOption.fieldLabel,
                    value: filterOption.fieldValue,
                  }) satisfies Option
              )}
            placeholder={`Select your ${filterCategoryLabel.toLowerCase()}`}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            name={filterCategoryFieldId.toLowerCase()}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id={filterCategoryFieldId.toLowerCase()}
          />
          {formState?.inputErrors?.[filterCategoryFieldId as keyof TUserFiltersFormState["inputErrors"]] ? (
            <div className="text-sm font-medium text-red-700" aria-live="polite">
              {
                formState.inputErrors?.[
                  filterCategoryFieldId as keyof TUserFiltersFormState["inputErrors"]
                ]?.[0]
              }
            </div>
          ) : null}
        </div>
      ))}

      <div className="mt-4">
        <Button disabled={isDisabledStep} onClick={prevStep} size="sm" variant="secondary">
          Prev
        </Button>
        <Button type="submit" size="sm">
          {pending ? (
            <div className="flex w-full flex-row justify-evenly">
              <Loader
                className="stroke-offset-foreground/25 h-5 w-5 animate-spin"
                style={{ animationDuration: "2s" }}
              />
            </div>
          ) : (
            <p>Finish </p>
          )}
        </Button>
      </div>
    </form>
  );
};

type UserDetailsFormState = { error: null | string } | { success: null | string };

const UserDetailsStep = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const { pending } = useFormStatus();

  const [userDetailsFormState, dispatch] = useFormState<UserDetailsFormState, FormData>(expertEdit, {
    error: null,
  });

  const { isDisabledStep, prevStep } = useStepper();

  useEffect(() => {
    if ("success" in userDetailsFormState && userDetailsFormState?.success) {
      router.push("/dashboard");
    }
  }, [userDetailsFormState]);

  return (
    <form action={dispatch}>
      <SupabaseReactDropzone userId={userId ?? "clxj4quka0000gebuthdxi1cp"} />
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          placeholder="Tell us a little bit about yourself"
          className="resize-none"
          id="bio"
          name="bio"
          maxLength={500}
        />
      </div>
      <div className="mt-4">
        <Button disabled={isDisabledStep} onClick={prevStep} size="sm" variant="secondary">
          Prev
        </Button>
        <Button type="submit" size="sm">
          {pending ? (
            <div className="flex w-full flex-row justify-evenly">
              <Loader
                className="stroke-offset-foreground/25 h-5 w-5 animate-spin"
                style={{ animationDuration: "2s" }}
              />
            </div>
          ) : (
            <p>Finish </p>
          )}
        </Button>
      </div>
    </form>
  );
};

const GettingStarted = ({
  userId,
  filterOptions,
}: {
  userId: string;
  filterOptions: Array<FilterOption>;
}) => {
  return (
    <main className="flex-1 bg-muted/40">
      <div className="flex items-center justify-center p-10">
        <div className="w-3/4">
          <Stepper initialStep={1} steps={steps}>
            {steps.map(({ id, label }, index) => {
              return (
                <Step key={id} label={label}>
                  {index === 0 && (
                    <div className="flex min-h-80 flex-col items-center justify-center gap-4">
                      <ConnectCalendarStep />
                    </div>
                  )}
                  {index === 1 && <UserFilters filterOptions={filterOptions} />}
                  {index === 2 && <UserDetailsStep userId={userId} />}
                </Step>
              );
            })}
          </Stepper>
        </div>
      </div>
    </main>
  );
};

export default GettingStarted;
