import { BookingResult } from "@/app/_components/booking-result";
import { Suspense } from "react";

export default function Booking() {
  return (
    <div className="flex items-center justify-center py-20">
      <Suspense>
        <BookingResult />
      </Suspense>
    </div>
  );
}
