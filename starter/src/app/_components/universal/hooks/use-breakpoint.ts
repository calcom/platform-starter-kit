import tailwindConfig from "../../../../../tailwind.config";
import { create } from "@kodingdotninja/use-tailwind-breakpoint";
import resolveConfig from "tailwindcss/resolveConfig";

const config = resolveConfig(tailwindConfig);

export const { useBreakpoint } = create(config.theme.screens);
