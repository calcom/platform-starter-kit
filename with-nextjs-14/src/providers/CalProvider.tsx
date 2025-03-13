"use client";

import { InfoContext } from "@/context/InfoContext";
import { CalProvider } from "@calcom/atoms";
import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";

function generateRandomEmail() {
  const localPartLength = 10;
  const domain = ["example.com", "example.net", "example.org"];

  const randomLocalPart = Array.from({ length: localPartLength }, () =>
    String.fromCharCode(Math.floor(Math.random() * 26) + 97)
  ).join("");

  const randomDomain = domain[Math.floor(Math.random() * domain.length)];

  return `${randomLocalPart}@${randomDomain}`;
}

async function randomSignIn() {
  const randomEmail = generateRandomEmail();
  const response = await fetch("/api/managed-user", {
    method: "POST",

    body: JSON.stringify({ email: randomEmail }),
  });

  return response.json();
}

export function CalWrapper({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState("");
  const { setUserDetails, userDetails } = useContext(InfoContext);

  const handleRandomSignin = async () => {
    const response = await randomSignIn();
    setAccessToken(response.accessToken);
    setUserDetails({ email: response.email, username: response.username });
  };

  return (
    <CalProvider
      clientId={process.env.NEXT_PUBLIC_X_CAL_ID ?? ""}
      accessToken={accessToken}
      options={{
        apiUrl: process.env.NEXT_PUBLIC_CALCOM_API_URL ?? "https://api.cal.com",
        refreshUrl: "/api/refresh",
      }}
    >
      <div>
        {userDetails.email ? (
          <>
            {children}
          </>
        ) : (
          <div className="min-w-screen min-h-screen flex flex-col items-center justify-center">
            <div className="text-3xl">Welcome to Cal.com Atoms!!</div>
            <Button variant="destructive" onClick={handleRandomSignin}>Click to sign in!</Button>
          </div>
        )}
      </div>
    </CalProvider>
  );
}
