import { createContext, Dispatch, SetStateAction } from "react";

const defaultUserDetails = { username: "", email: "" };
const defaultSetUserDetails: Dispatch<SetStateAction<{ username: string; email: string; }>> = () => { };

export const InfoContext = createContext<{ userDetails: { username: string; email: string; }; setUserDetails: Dispatch<SetStateAction<{ username: string; email: string; }>>; }>({
  userDetails: defaultUserDetails,
  setUserDetails: defaultSetUserDetails,
});