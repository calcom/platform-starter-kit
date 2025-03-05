import { ButtonSubmit } from "@/app/_components/submit-button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useStepper } from "@/components/ui/stepper";
import { GcalConnect } from "@calcom/atoms";
import { Loader } from "lucide-react";
import { Suspense } from "react";

const ConnectCalendarStep = () => {
  const { nextStep } = useStepper();

  return (
    <>
      <Card className="mx-auto mt-10 w-full max-w-sm">
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
      <div className="flex w-full justify-end">
        <ButtonSubmit variant="default" onClick={nextStep} size="sm">
          Next
        </ButtonSubmit>
      </div>
    </>
  );
};

export default ConnectCalendarStep;
