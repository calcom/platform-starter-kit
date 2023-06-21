"use client";

import Cal from "@calcom/embed-react";

export default function Embed() {
  return (
    <Cal
      calLink="team/cal/sales"
      config={{
        name: "John Doe",
        email: "johndoe@gmail.com",
        notes: "Test Meeting",
        theme: "dark",
      }}
    />
  );
}
