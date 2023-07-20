import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("floatingButton", {
        calLink: "rick/get-rick-rolled",
        config: {
          name: "John",
          email: "john@example.com",
          "metadata[employeeId]": "101",
          layout: "week_view",
        },
      });
      cal("ui", {
        styles: { branding: { brandColor: "#000000" } },
        hideEventTypeDetails: false,
        layout: "column_view"
      });
    })();
  }, []);

  return (
    <main>
      <h1>This page has a floating button popup</h1>
      <h2>Other Examples</h2>
     <ul>
      <li>
      <a href="./event-listeners">Embed Event Listeners</a>
      </li>
      <li>
      <a href="./inline">Inline Embed</a>
      </li>
     </ul>

    </main>
  )
}
