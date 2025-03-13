"use client";

import { InfoContext } from "./InfoContext";

export function InfoProvider({ children, userDetails, setUserDetails }: { children: React.ReactNode; userDetails: { username: string; email: string }; setUserDetails: React.Dispatch<React.SetStateAction<{ username: string; email: string }>> }) {
  return (
    <InfoContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </InfoContext.Provider>
  )
}

