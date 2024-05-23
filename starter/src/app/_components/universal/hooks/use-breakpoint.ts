import tailwindConfig from "../../../../../tailwind.config.ts";
import { create } from "@kodingdotninja/use-tailwind-breakpoint";
import resolveConfig from "tailwindcss/resolveConfig";

const config = resolveConfig(tailwindConfig);

export const { useBreakpoint } = create(config.theme.screens);
