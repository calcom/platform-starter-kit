"use client";

import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectGroup,
} from "@/components/ui/select";
import { InfoContext } from "@/context/InfoContext";
import { Booker, useEventTypes } from "@calcom/atoms";
import { useContext, useState } from "react";

type View = "MONTH_VIEW" | "WEEK_VIEW" | "COLUMN_VIEW" | undefined;

const viewOptions: View[] = ["MONTH_VIEW", "WEEK_VIEW", "COLUMN_VIEW"];

export default function BookerPage() {
  const { userDetails, setUserDetails } = useContext(InfoContext);
  const { data, isLoading, refetch } = useEventTypes(userDetails.username);
  const [eventSlug, setEventSlug] = useState<string | null>(null);
  const [view, setView] = useState<View>();

  return (
    <div className="flex flex-col items-center justify-center mt-8 gap-8">
      {data?.length === 0 && <div>No events found. Please create some first!</div>}
      {isLoading && <div>Loading...</div>}
      {!isLoading && data && data.length > 0 &&
        <div className="max-w-3xl flex gap-5">
          <Select onValueChange={(value) => setEventSlug(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Event Type" />
            </SelectTrigger>
            <SelectContent>
              {data.map((item) => (
                <SelectItem value={item.slug} key={item.id}>
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setView(value as View)}>
            <SelectTrigger>
              <SelectValue placeholder="Select View" />
            </SelectTrigger>
            <SelectContent>
              {viewOptions.map((viewOption) => (
                viewOption !== undefined && <SelectItem value={viewOption} key={viewOption}>
                  {viewOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
      <div className="max-w-9/10">
        {eventSlug && (
          <Booker
            eventSlug={eventSlug}
            isTeamEvent={false}
            username={userDetails.username}
            view={view}
            bannerUrl="https://i0.wp.com/mahala.co.uk/wp-content/uploads/2014/12/img_banner-thin_mountains.jpg?fit=800%2C258&ssl=1"
            onCreateBookingSuccess={() => {
              alert("Booking has been created");
            }}
          />
        )}
      </div>
    </div>
  );
}