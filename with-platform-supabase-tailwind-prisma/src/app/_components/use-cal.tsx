"use client";

import { env } from "@/env";
import { CalProvider } from "@calcom/atoms";
import { use } from "react";

/**
 * [@calcom] This is necessary since the CalProvider currently doesn't have the "use client" directive set (it's written for pre-server-components react)
 * 
 * *Important*: You have to provide this component with a promise passed from the server compoent
 * @Usage
    ```tsx
    import { currentUser} from "@/auth";
    export default async function RootLayout(props: { children: ReactNode }) {
      return (
        <Suspense>
        {* note how we're passing the unresolved promise as props*}
          <UseCalAtoms calAccessToken={currentUser().then((dbUser) => dbUser?.calAccessToken ?? undefined)}>
            {props.children}
          </UseCalAtoms>
        </Suspense>
      )
    }
    ```
*/
export default function UseCalAtoms(props: {
  children: React.ReactNode;
  calAccessToken: Promise<string | null>;
}) {
  const accessToken = use(props.calAccessToken);
  return (
    <CalProvider
      clientId={env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID}
      options={{
        apiUrl: env.NEXT_PUBLIC_CAL_API_URL,
        refreshUrl: env.NEXT_PUBLIC_REFRESH_URL,
      }}
      {...(accessToken && { accessToken: accessToken })}>
      {props.children}
    </CalProvider>
  );
}
