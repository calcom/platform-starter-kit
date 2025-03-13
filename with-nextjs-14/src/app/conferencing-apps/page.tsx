"use client";

import { ConferencingAppsSettings } from "@calcom/atoms";
import { usePathname } from "next/navigation";

export default function ConferencingApps() {
  const pathname = usePathname();
  const callbackUri = `${window.location.origin}${pathname}`;

  return (
    <div className="w-full flex justify-center items-center mt-4">
      <div className="max-w-3xl">
        <ConferencingAppsSettings returnTo={callbackUri} onErrorReturnTo={callbackUri} />
      </div>
    </div>
  )
}