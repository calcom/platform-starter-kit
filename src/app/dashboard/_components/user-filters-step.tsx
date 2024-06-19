import { addUserFilters } from "@/app/_actions";
import { FancyMultiSelect, type Option } from "@/app/_components/multi-select";
import { ButtonSubmit } from "@/app/_components/submit-button";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useStepper } from "@/components/ui/stepper";
import { type FilterOption } from "@prisma/client";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { uniqueBy, prop } from "remeda";

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
  const { isDisabledStep, prevStep, nextStep } = useStepper();

  const filtersByCategory = uniqueBy(filterOptions, prop("filterCategoryFieldId"));

  useEffect(() => {
    if ("success" in formState && !!formState?.success) {
      nextStep();
    }
  }, [formState]);

  return (
    <form action={dispatch} className="mt-10">
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

      <div className="mt-4 flex justify-end gap-2">
        <Button disabled={isDisabledStep} onClick={prevStep} size="sm" variant="secondary">
          Prev
        </Button>
        <ButtonSubmit variant="default" size="sm">
          Next
        </ButtonSubmit>
      </div>
    </form>
  );
};

export default UserFilters;
