
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."Account" (
    "id" "text" NOT NULL,
    "userId" "text" NOT NULL,
    "type" "text" NOT NULL,
    "provider" "text" NOT NULL,
    "providerAccountId" "text" NOT NULL,
    "refresh_token" "text",
    "access_token" "text",
    "expires_at" integer,
    "token_type" "text",
    "scope" "text",
    "id_token" "text",
    "session_state" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "public"."Account" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."CalAccount" (
    "id" integer NOT NULL,
    "username" "text" NOT NULL,
    "email" "text" NOT NULL,
    "timeZone" "text" NOT NULL,
    "weekStart" "text" NOT NULL,
    "createdDate" "text" NOT NULL,
    "timeFormat" integer NOT NULL,
    "defaultScheduleId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "public"."CalAccount" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."FilterOption" (
    "fieldId" "text" NOT NULL,
    "fieldValue" "text" NOT NULL,
    "fieldLabel" "text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "filterCategoryFieldId" "text" NOT NULL,
    "filterCategoryValue" "text" NOT NULL,
    "filterCategoryLabel" "text" NOT NULL
);

ALTER TABLE "public"."FilterOption" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."FilterOptionsOnUser" (
    "userId" "text" NOT NULL,
    "filterOptionFieldId" "text" NOT NULL,
    "filterCategoryFieldId" "text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "public"."FilterOptionsOnUser" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."Session" (
    "id" "text" NOT NULL,
    "sessionToken" "text" NOT NULL,
    "userId" "text" NOT NULL,
    "expires" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "public"."Session" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."User" (
    "id" "text" NOT NULL,
    "name" "text",
    "username" "text",
    "bio" "text",
    "email" "text",
    "emailVerified" timestamp(3) without time zone,
    "hashedPassword" "text",
    "image" "text",
    "calAccountId" integer,
    "calAccessToken" "text",
    "calRefreshToken" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "public"."User" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."VerificationToken" (
    "identifier" "text" NOT NULL,
    "token" "text" NOT NULL,
    "expires" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "public"."VerificationToken" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."_prisma_migrations" (
    "id" character varying(36) NOT NULL,
    "checksum" character varying(64) NOT NULL,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) NOT NULL,
    "logs" "text",
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "applied_steps_count" integer DEFAULT 0 NOT NULL
);

ALTER TABLE "public"."_prisma_migrations" OWNER TO "postgres";

ALTER TABLE ONLY "public"."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."CalAccount"
    ADD CONSTRAINT "CalAccount_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."_prisma_migrations"
    ADD CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account" USING "btree" ("provider", "providerAccountId");

CREATE UNIQUE INDEX "CalAccount_email_key" ON "public"."CalAccount" USING "btree" ("email");

CREATE UNIQUE INDEX "CalAccount_username_key" ON "public"."CalAccount" USING "btree" ("username");

CREATE INDEX "FilterOption_fieldId_filterCategoryFieldId_idx" ON "public"."FilterOption" USING "btree" ("fieldId", "filterCategoryFieldId");

CREATE UNIQUE INDEX "FilterOption_fieldId_filterCategoryFieldId_key" ON "public"."FilterOption" USING "btree" ("fieldId", "filterCategoryFieldId");

CREATE UNIQUE INDEX "FilterOption_fieldId_key" ON "public"."FilterOption" USING "btree" ("fieldId");

CREATE INDEX "FilterOptionsOnUser_userId_filterOptionFieldId_filterCatego_idx" ON "public"."FilterOptionsOnUser" USING "btree" ("userId", "filterOptionFieldId", "filterCategoryFieldId");

CREATE UNIQUE INDEX "FilterOptionsOnUser_userId_filterOptionFieldId_filterCatego_key" ON "public"."FilterOptionsOnUser" USING "btree" ("userId", "filterOptionFieldId", "filterCategoryFieldId");

CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session" USING "btree" ("sessionToken");

CREATE UNIQUE INDEX "User_calAccessToken_key" ON "public"."User" USING "btree" ("calAccessToken");

CREATE UNIQUE INDEX "User_calAccountId_key" ON "public"."User" USING "btree" ("calAccountId");

CREATE UNIQUE INDEX "User_calRefreshToken_key" ON "public"."User" USING "btree" ("calRefreshToken");

CREATE UNIQUE INDEX "User_email_key" ON "public"."User" USING "btree" ("email");

CREATE UNIQUE INDEX "User_username_key" ON "public"."User" USING "btree" ("username");

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken" USING "btree" ("identifier", "token");

CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken" USING "btree" ("token");

ALTER TABLE ONLY "public"."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."FilterOptionsOnUser"
    ADD CONSTRAINT "FilterOptionsOnUser_filterOptionFieldId_filterCategoryFiel_fkey" FOREIGN KEY ("filterOptionFieldId", "filterCategoryFieldId") REFERENCES "public"."FilterOption"("fieldId", "filterCategoryFieldId") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."FilterOptionsOnUser"
    ADD CONSTRAINT "FilterOptionsOnUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_calAccountId_fkey" FOREIGN KEY ("calAccountId") REFERENCES "public"."CalAccount"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."Account" TO "anon";
GRANT ALL ON TABLE "public"."Account" TO "authenticated";
GRANT ALL ON TABLE "public"."Account" TO "service_role";

GRANT ALL ON TABLE "public"."CalAccount" TO "anon";
GRANT ALL ON TABLE "public"."CalAccount" TO "authenticated";
GRANT ALL ON TABLE "public"."CalAccount" TO "service_role";

GRANT ALL ON TABLE "public"."FilterOption" TO "anon";
GRANT ALL ON TABLE "public"."FilterOption" TO "authenticated";
GRANT ALL ON TABLE "public"."FilterOption" TO "service_role";

GRANT ALL ON TABLE "public"."FilterOptionsOnUser" TO "anon";
GRANT ALL ON TABLE "public"."FilterOptionsOnUser" TO "authenticated";
GRANT ALL ON TABLE "public"."FilterOptionsOnUser" TO "service_role";

GRANT ALL ON TABLE "public"."Session" TO "anon";
GRANT ALL ON TABLE "public"."Session" TO "authenticated";
GRANT ALL ON TABLE "public"."Session" TO "service_role";

GRANT ALL ON TABLE "public"."User" TO "anon";
GRANT ALL ON TABLE "public"."User" TO "authenticated";
GRANT ALL ON TABLE "public"."User" TO "service_role";

GRANT ALL ON TABLE "public"."VerificationToken" TO "anon";
GRANT ALL ON TABLE "public"."VerificationToken" TO "authenticated";
GRANT ALL ON TABLE "public"."VerificationToken" TO "service_role";

GRANT ALL ON TABLE "public"."_prisma_migrations" TO "anon";
GRANT ALL ON TABLE "public"."_prisma_migrations" TO "authenticated";
GRANT ALL ON TABLE "public"."_prisma_migrations" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
