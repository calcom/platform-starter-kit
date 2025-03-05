<!-- PROJECT LOGO -->
<p align="center">
  <a href="https://github.com/calcom/cal.com">
   <img src="https://github.com/calcom/platform-starter-kit/assets/8019099/6f0a8337-6d18-42de-aa00-44a57764e19b" alt="Logo">
  </a>

  <h3 align="center">Cal.com Platform Starter Kit</h3>

  <p align="center">
    Build your pixel-perfect booking experience
    <br />
    <br />
    <a href="https://experts.cal.com"><strong>Demo</strong></a>
    ·
    <a href="https://www.youtube.com/watch?v=wwo07ghiNn4"><strong>Video Tutorial</strong></a>
    ·
    <a href="https://cal.com/docs/platform"><strong>Docs</strong></a>
    ·
    <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcalcom%2Fplatform-starter-kit%2Ftree%2Fmain&env=NEXT_PUBLIC_REFRESH_URL,AUTH_SECRET,AUTH_TRUST_HOST,NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID,NEXT_PUBLIC_CAL_API_URL,CAL_SECRET&envDescription=You%20can%20see%20how%20to%20populate%20the%20environment%20variables%20in%20our%20starter%20example%20→&envLink=https%3A%2F%2Fgithub.com%2Fcalcom%2Fplatform-starter-kit%2Ftree%2Fmain%2F.env.example&project-name=cal-platform-starter&repository-name=cal-platform-starter&demo-title=Cal.com%20Experts&demo-description=A%20marketplace%20to%20book%20appointments%20with%20experts&demo-url=https%3A%2F%2Fexperts.cal.com&demo-image=https%3A%2F%2Fgithub.com%2Fcalcom%2Fplatform-starter-kit%2Fassets%2F8019099%2F2e58f8da-a110-4a45-b9a4-dcffb45f9baa&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6&external-id=https%3A%2F%2Fgithub.com%2Fcalcom%2Fplatform-starter-kit%2Ftree%2Fmain"><strong>Deploy on Vercel</strong></a>
    <br />
    <br />
    <a href="https://go.cal.com/discord">Discord</a>
    ·
    <a href="https://cal.com/platform">Website</a>
    ·
    <a href="https://github.com/calcom/cal.com/issues">Issues</a>

  </p>
</p>

# Platform Starter Kit Example

Cal.com Platform Starter Kit showcases the new Cal.com Platform API and Cal.com Atoms. It was built using the [T3 Stack](https://create.t3.gg/) with [Supabase](https://supabase.com/) as the Postgres Database and Image Storage host.

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcalcom%2Fplatform-starter-kit%2Ftree%2Fmain&env=NEXT_PUBLIC_REFRESH_URL,AUTH_SECRET,AUTH_TRUST_HOST,NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID,NEXT_PUBLIC_CAL_API_URL,CAL_SECRET&envDescription=You%20can%20see%20how%20to%20populate%20the%20environment%20variables%20in%20our%20starter%20example%20→&envLink=https%3A%2F%2Fgithub.com%2Fcalcom%2Fplatform-starter-kit%2Ftree%2Fmain%2F.env.example&project-name=cal-platform-starter&repository-name=cal-platform-starter&demo-title=Cal.com%20Experts&demo-description=A%20marketplace%20to%20book%20appointments%20with%20experts&demo-url=https%3A%2F%2Fexperts.cal.com&demo-image=https%3A%2F%2Fgithub.com%2Fcalcom%2Fplatform-starter-kit%2Fassets%2F8019099%2F2e58f8da-a110-4a45-b9a4-dcffb45f9baa&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6&external-id=https%3A%2F%2Fgithub.com%2Fcalcom%2Fplatform-starter-kit%2Ftree%2Fmain)

## How to use

```bash
npx @calcom/starter-kit my-platform
```

OR

**1. Clone the repository**

HTTPS:

```bash
git clone https://github.com/calcom/platform-starter-kit.git
```

GitHub CLI:

```bash
gh repo clone calcom/platform-starter-kit
```

**2. Move into the Starter**

```bash
cd platform-starter-kit/
```

**3. Install dependencies**

<!-- note(richard): We require pnpm since we have this version deployed; if we separate example source from our deployed version, we free up the package manager choice. -->

> [!IMPORTANT]  
> **Package Manager:** This repository is deployed as-is and therefore contains a `pnpm-lock.yaml` file. As a result, you currently have to use `pnpm` as your package manager to ensure that the dependencies are installed correctly.

```bash
pnpm install
```

**4. Set Environment Variables**

We provide most environment variables out of the box (including Cal-related variables).

So get started by copying the `.env.example`:

```bash
cp .env.example .env
```

_4.1 Database_

This project uses Postgres with Supabase. You can create a free project at [database.new](https://database.new/).

Then, get the Database URL from the [Supabase dashboard](https://supabase.com/dashboard/project/_/settings/database) and update the respective values in your `.env` file:

```.env
POSTGRES_PRISMA_URL="postgres://postgres.YOUR-PROJECT-REF:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1" # Transaction Mode
POSTGRES_URL_NON_POOLING="postgres://postgres.YOUR-PROJECT-REF:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"  # Session Mode
```

When working locally you can use the DB URL: `postgresql://postgres:postgres@127.0.0.1:54322/postgres` outputted by the `supabase start` command for both vairables.

[Only needed when deploying manually] Initialize the database:

Note that if you used the Vercel Deploy link from above, the Supabase Vercel integration sets this up automatically for you!

```bash
pnpm db:init
pnpm db:seed # Will throw an error if DB is already seeded, which you can ignore.
```

Prisma will create a `_prisma_migrations` table on the `public` database schema. In Supabase, the public schema is exposed via the API by default. To secure the table, navigate to the [Table Editor](https://supabase.com/dashboard/project/_/editor), click on "RLS diasbaled" > "Enable RLS for this table".

Alternatively, you can run the follow SQL statement on your database, e.g. via the [SQL Editor](https://supabase.com/dashboard/project/_/sql/new) in the Supabase Dashboard:

```sql
ALTER TABLE "public"."_prisma_migrations" ENABLE ROW LEVEL SECURITY;
```

Lastly, in your [Supabase Dashboard](https://supabase.com/dashboard/project/_/storage/buckets) create a public `avatars` bucket to store the profile pictures.

_4.2 Authentication_

Generate a NextAuth secret and add it to your `.env` file:

```bash
openssl rand -hex 32
```

```.env
# Next Auth
# You can generate a new secret on the command line with
# openssl rand -base64 32
# <https://next-auth.js.org/configuration/options#secret>

AUTH_SECRET="SQhGk****"
```

_4.3 Cal_

For **development**, you're all set! We've provided you with our sandbox keys that you can find the `.env.example` file.

For **production**, keep in mind that you'll have to update the `NEXT_PUBLIC_REFRESH_URL` variable to make it point to your deployment, e.g.:

```.env
# 3/ *REFRESH URL.* You have to expose an endpoint that will be used from calcom: https://cal.com/docs/platform/quick-start#4.-backend:-setting-up-refresh-token-endpoint

NEXT_PUBLIC_REFRESH_URL="https://<your-project>.vercel.app/api/cal/refresh"
```

**5. Development Server**
From here, you're all set. Just start the development server & get going.

```bash
pnpm dev
```

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with Cal.com Platform and the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs.

- [Cal.com Platform](https://cal.com/platform)
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More about Cal.com Platform

Visit our documentation at [cal.com/docs/platform](https://cal.com/docs/platform) or join our [Discord](https://go.cal.com/discord).

Contact sales to purchase a commercial API key here: [cal.com/sales](https://cal.com/sales).

## Learn More about T3

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## Learn More about Supabase

Supabase is the fastest way to get up and running with Next.js and Postgres. Check out [this video](https://youtu.be/WdA6b0jPNv4?si=eeWpu03PI3W-t5pC) to learn more!
