"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function Embed() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        styles: { branding: { brandColor: "#502D3C" } },
        hideEventTypeDetails: false,
        layout: "week_view",
      });
    })();
  }, []);
  return (
    <Cal
      calLink="team/cal/sales"
      config={{
        name: "John Doe",
        email: "johndoe@gmail.com",
        notes: "Test Meeting",
        theme: "light",
      }}
    />
  );
}
