"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Step, Stepper, useStepper, type StepItem } from "@/components/ui/stepper";
import { GcalConnect } from "@calcom/atoms";
import { Loader } from "lucide-react";
import { Suspense } from "react";

const steps = [{ label: "Step 1" }, { label: "Step 2" }, { label: "Step 3" }] satisfies StepItem[];

export default function GettingStarted() {
  return (
    <main className="flex-1 bg-muted/40">
      <div className="flex items-center justify-center p-10">
        <div>
          <Stepper initialStep={0} steps={steps}>
            {steps.map(({ label }, index) => {
              return (
                <Step key={label} label={label}>
                  <Card className="w-full max-w-sm">
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
                </Step>
              );
            })}
            <Footer />
          </Stepper>
        </div>
        {/* <Card className="w-full max-w-sm">
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
        </Card> */}
      </div>
    </main>
  );
}

const Footer = () => {
  const { nextStep, prevStep, resetSteps, isDisabledStep, hasCompletedAllSteps, isLastStep, isOptionalStep } =
    useStepper();
  return (
    <>
      {hasCompletedAllSteps && (
        <div className="my-4 flex h-40 items-center justify-center rounded-md border bg-secondary text-primary">
          <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
        </div>
      )}
      <div className="flex w-full justify-end gap-2">
        {hasCompletedAllSteps ? (
          <Button size="sm" onClick={resetSteps}>
            Reset
          </Button>
        ) : (
          <>
            <Button disabled={isDisabledStep} onClick={prevStep} size="sm" variant="secondary">
              Prev
            </Button>
            <Button size="sm" onClick={nextStep}>
              {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
            </Button>
          </>
        )}
      </div>
    </>
  );
};
