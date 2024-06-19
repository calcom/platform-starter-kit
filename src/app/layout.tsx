import Banner from "./_components/banner";
import UseCalAtoms from "./_components/use-cal";
import { Providers } from "./providers";
import { TailwindIndicator } from "./tailwind-indicator";
import { currentUser } from "@/auth";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import "@/styles/globals.css";

/**
 * [@calcom] In your root layout, make sure you import the atoms' global styles so that you get our shiny styles
 * @link https://cal.com/docs/platform/quick-start#5.3-setup-root-of-your-app
 */
import "@calcom/atoms/globals.min.css";
import { Analytics } from "@vercel/analytics/react";
import { type Metadata } from "next";
import { AxiomWebVitals } from "next-axiom";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";

const interFont = Inter({ subsets: ["latin"], variable: "--font-inter", preload: true, display: "swap" });
const calFont = localFont({
  src: "../fonts/CalSans-SemiBold.woff2",
  variable: "--font-cal",
  preload: true,
  display: "block",
  weight: "600",
});

export const metadata: Metadata = {
  title: {
    default: "Cal.com Platform: Showcase App",
    template: `Cal.com Platform | %s`,
  },
  description: "Cal.com Platform example app: Showcase usage of the 'Cal Atoms' React Components",
  keywords: [
    "cal.com",
    "platform",
    "example",
    "app",
    "scheduling software",
    "scheduling components",
    "scheduling react",
  ],
  authors: [
    {
      name: "Richard Poelderl",
      url: "https://x.com/richardpoelderl",
    },
    { name: "Peer Richelsen", url: "https://x.com/peerrich" },
  ],
  creator: "Cal.com",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /** [@calcom] Ensure to set the diretion (either 'ltr' or 'rtl') since the calcom/atoms use their styles */
    <html lang="en" dir="ltr">
      <head />
      <AxiomWebVitals />
      <body className={cn("antialiased", calFont.variable, interFont.variable)}>
        <Providers defaultTheme="system" enableSystem attribute="class">
          <div className="flex min-h-screen flex-col">
            <Banner
              title="Build your own marketplace"
              description="Use our Platform Starter Kit to go live in 15 minutes."
              ctaLink="https://go.cal.com/starter-kit"
            />
            <UseCalAtoms
              calAccessToken={currentUser().then((dbUser) => dbUser?.calAccessToken ?? null) ?? null}>
              {children}
            </UseCalAtoms>
          </div>
          <TailwindIndicator />
        </Providers>
        <Toaster />
      </body>
      <Analytics />
    </html>
  );
}
