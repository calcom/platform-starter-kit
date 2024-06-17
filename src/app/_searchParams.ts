import {
  capabilityOptions,
  categoryOptions,
  budgetOptions,
  frameworkOptions,
  languageOptions,
  regions,
} from "./_hardcoded";
import { z } from "zod";

export const renderingOptions = ["server", "client"] as const;
export type RenderingOptions = (typeof renderingOptions)[number];
function nonEmptyArray<ElementType>(arr: Array<ElementType>): [ElementType, ...ElementType[]] {
  return [arr[0]!, ...arr.slice(1)];
}

const categoriesEnum = z.enum(nonEmptyArray(categoryOptions.flatMap((option) => option.fieldValue)));
const capabilitiesEnum = z.enum(nonEmptyArray(capabilityOptions.flatMap((option) => option.fieldValue)));
const budgetsEnum = z.enum(nonEmptyArray(budgetOptions.flatMap((option) => option.fieldValue)));
const frameworksEnum = z.enum(nonEmptyArray(frameworkOptions.flatMap((option) => option.fieldValue)));
const languagesEnum = z.enum(nonEmptyArray(languageOptions.flatMap((option) => option.fieldValue)));
const regionsEnum = z.enum(nonEmptyArray(regions.flatMap((option) => option.fieldValue)));
export const querySearchParamSchema = z.string().optional();

export const filterSearchParamSchema = z
  .object({
    categories: z.array(categoriesEnum).optional(),
    capabilities: z.array(capabilitiesEnum).optional(),
    budgets: z.array(budgetsEnum).optional(),
    frameworks: z.array(frameworksEnum).optional(),
    languages: z.array(languagesEnum).optional(),
    regions: z.array(regionsEnum).optional(),
  })
  .optional();
export const searchParamsSchema = z
  .object({
    q: z.string().optional(),
    f: z
      .object({
        categories: z.array(categoriesEnum).optional(),
        capabilities: z.array(capabilitiesEnum).optional(),
        budgets: z.array(budgetsEnum).optional(),
        frameworks: z.array(frameworksEnum).optional(),
        languages: z.array(languagesEnum).optional(),
        regions: z.array(regionsEnum).optional(),
      })
      .optional(),
  })
  .optional();
