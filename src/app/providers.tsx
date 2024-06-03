"use client";

/**
 * [@calcom] Make sure to wrap your app with our `CalProvider` to enable the use of our hooks.
 * @link https://cal.com/docs/platform/quick-start#5.3-setup-root-of-your-app
 */
import { env } from "@/env";
import { CalProvider } from "@calcom/atoms";
import { type User } from "@prisma/client";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import * as React from "react";

export function Providers({
  children,
  ...props
}: ThemeProviderProps & { calUserToken?: User["calAccessToken"] }) {
  const accessToken = props?.calUserToken;
  return (
    <CalProvider
      clientId={env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}
      options={{
        apiUrl: env.NEXT_PUBLIC_CAL_API_URL,
        refreshUrl: env.NEXT_PUBLIC_REFRESH_URL,
      }}
      {...(accessToken && { accessToken })}>
      <NextThemesProvider {...props}>
        <TooltipProvider>{children}</TooltipProvider>
      </NextThemesProvider>
    </CalProvider>
  );
}
