"use client";

import { CalendarSettings, Connect } from "@calcom/atoms";

export default function ConnectPage() {
  return (
    <div className="min-w-screen flex flex-col items-center justify-center gap-5 mt-5">
      <div className="flex flex-col gap-3 items-center">
        <Connect.GoogleCalendar isMultiCalendar redir="http://localhost:3000/connect" />
        <Connect.OutlookCalendar isMultiCalendar />
        <Connect.AppleCalendar alreadyConnectedLabel={"You have already one connected account!"} tooltip={"Single Calendar Example"} />
      </div>
      <div>
        <CalendarSettings />
      </div>
    </div>
  );
}