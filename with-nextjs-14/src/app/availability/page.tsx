"use client";

import { AvailabilitySettings } from "@calcom/atoms";

export default function AvailabilitySettingsPage() {
  return (
    <AvailabilitySettings
      onUpdateSuccess={() => alert("Updated Successfully!!")}
      enableOverrides
      onBeforeUpdate={() => confirm("Are you sure you want to update?")}
      onDeleteSuccess={() => alert("Deleted Successfully!!")}
    />
  )
}
