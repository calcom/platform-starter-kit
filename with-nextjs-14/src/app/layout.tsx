"use client";

import localFont from "next/font/local";
import "./globals.css";

import { CalWrapper } from "../providers/CalProvider";

import "@calcom/atoms/globals.min.css";
import Navbar, { NavLinkProps } from "./ui/navbar/Navbar";
import { InfoProvider } from "@/context/InfoProvider";
import { useState } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const links: NavLinkProps[] = [
    {
      href: "/",
      text: "Home",
    },
    {
      href: "/availability",
      text: "Availability"
    },
    {
      href: "/event-type-create",
      text: "Create Event Type"
    },
    {
      href: "/event-type-settings",
      text: "Event Type Settings"
    },
    {
      href: "/booker",
      text: "Booker",
    },
    {
      href: "/connect",
      text: "Connect",
    },
    {
      href: "/conferencing-apps",
      text: "Conferencing Apps"
    }
  ];

  const [userDetails, setUserDetails] = useState({ username: "", email: "" });
  return (
    <html dir="ltr" lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <InfoProvider setUserDetails={setUserDetails} userDetails={userDetails} >
          <CalWrapper>
            <Navbar links={links} />
            {children}
          </CalWrapper>
        </InfoProvider>
      </body>
    </html>
  );
}
