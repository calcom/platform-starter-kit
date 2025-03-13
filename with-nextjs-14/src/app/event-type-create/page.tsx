"use client";

import { InfoContext } from "@/context/InfoContext";
import { CreateEventType, useEventTypes } from "@calcom/atoms";
import { useContext } from "react";

export default function CreateEventTypePage() {
  const { userDetails } = useContext(InfoContext);
  const { data, refetch, isLoading, isRefetching } = useEventTypes(userDetails.username);
  return (
    <div className="flex flex-col justify-center items-center mt-8">
      <div className="">
        <div className="font-semibold text-xl mb-4">
          {isLoading && "Loading Event Types..."}
          {isRefetching && "Refetching Event Types..."}
          {!isLoading && !isRefetching && data && data.length === 0 && "You don't have any event type created"}
        </div>
        {!isRefetching && data && data.length > 0 && (
          <div>
            <div className="font-semibold text-xl">Your Event Types</div>
            <ol className="list-disc">
              {data.map((eventType) => (
                <li key={eventType.id}>{eventType.title}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
      <CreateEventType
        customClassNames={{
          atomsWrapper: "max-w-3xl"
        }}
        onSuccess={(eventType) => {
          alert(`Event type created: ${eventType.title} 🚀🚀`);
          refetch();
        }}
        onError={(err) => {
          alert(`Error creating Event Type 😲`);
        }}
      />
    </div>
  )
}
