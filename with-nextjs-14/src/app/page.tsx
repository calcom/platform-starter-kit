"use client";

import { useConnectedCalendars } from "@calcom/atoms";
import "./globals.css";
import { useContext } from "react";
import { InfoContext } from "@/context/InfoContext";

export default function Home() {
  const { userDetails } = useContext(InfoContext);
  const { email, username } = userDetails;
  return (
    <div className="min-w-screen justify-center flex items-center h-full">
      <div>
        <h2>You have now signed in as: </h2>
        <p>Email: {email}</p>
        <p>Username: {username}</p>
      </div>
    </div>
  );
}
