"use client";

import { AvailabilitySettings } from "@calcom/atoms";

/**
 * [@calcom] Make sure to wrap your app with our `CalProvider` to enable the use of our hooks.
 * @link https://cal.com/docs/platform/quick-start#5.3-setup-root-of-your-app
 */
export const SettingsContent = () => {
  return (
    <div className="grid gap-6 [&>div]:rounded-lg [&>div]:border [&>div]:bg-card [&>div]:text-card-foreground [&>div]:shadow-sm">
      <AvailabilitySettings
        customClassNames={{
          // this is to avoid layout shift when toggling days
          scheduleClassNames: {
            scheduleDay: "min-w-[480px]",
          },
          containerClassName: "!font-sans !p-6",
          editableHeadingClassName:
            "!text-2xl !font-semibold !leading-none !tracking-tight !pr-4  !text-foreground min-w-[20rem]",
          subtitlesClassName: "!text-sm !leading-relaxed !max-w-lg !text-balance !text-muted-foreground",
        }}
        onUpdateSuccess={() => {
          console.log("[@calcom/atoms]: Updated successfully");
        }}
        onUpdateError={() => {
          console.log("[@calcom/atoms]: Update error");
        }}
        onDeleteError={() => {
          console.log("[@calcom/atoms]: Deletion error");
        }}
        onDeleteSuccess={() => {
          console.log("[@calcom/atoms]: Deleted successfully");
        }}
      />
    </div>
  );
};
export default SettingsContent;
