import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    TURSO_DATABASE_URL: z
      .string()
      .refine(
        (str) => !str.includes("libsql://your-database.turso.io"),
        "You forgot to change the default TURSO URL"
      ),
    TURSO_AUTH_TOKEN: z
      .string()
      .refine((str) => !str.includes("your-access-token"), "You forgot to change the default TURSO token"),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    AUTH_SECRET: process.env.NODE_ENV === "production" ? z.string() : z.string().optional(),

    /**
     * [@calcom] These are the server environment variables to make our atoms work:
     * - CAL_SECRET: The secret key to authenticate our SDK requests. Follow this guide to get it 👇
     * @link: https://cal.com/docs/platform/quick-start#2.-setting-up-an-oauth-client
     */
    CAL_SECRET: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
    /** [@calcom] These are the server environment variables to make our atoms work:
     * - *NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID*: The OAuth client ID to authenticate our SDK requests. Follow this guide to get it 👇
     * @link: https://cal.com/docs/platform/quick-start#2.-setting-up-an-oauth-client
     * - *NEXT_PUBLIC_CAL_API_URL*: Use our sandbox 'https://api.cal.dev/api/v2' for development & for production use: 'https://api.cal.com/v2'
     * @link: https://cal.com/docs/platform/quick-start#5.2-setup-environment-variables
     * - *NEXT_PUBLIC_REFRESH_URL*:You have to expose this URL webhook for cal to update
     * @link: https://cal.com/docs/platform/quick-start#4.-backend:-setting-up-refresh-token-endpoint
     */
    NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID: z.string(),
    NEXT_PUBLIC_CAL_API_URL: z.string(),
    NEXT_PUBLIC_REFRESH_URL: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    /** [@calcom] Make sure to add the calcom variables to your runtime environment variables, so that you can use them */
    CAL_SECRET: process.env.CAL_SECRET,
    NEXT_PUBLIC_CAL_API_URL: process.env.NEXT_PUBLIC_CAL_API_URL,
    NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID: process.env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID,
    NEXT_PUBLIC_REFRESH_URL: process.env.NEXT_PUBLIC_REFRESH_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
  extends: [vercel()],
});
