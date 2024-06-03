PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"                    TEXT PRIMARY KEY NOT NULL,
    "checksum"              TEXT NOT NULL,
    "finished_at"           DATETIME,
    "migration_name"        TEXT NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        DATETIME,
    "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
    "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
);
INSERT INTO _prisma_migrations VALUES('10be4cf9-3f69-42a1-bb5d-f4dfc5a07672','b31f0f63aeeb377218c63c0cc23cf8e61584e76a7e3f7fdb1b6959da06df8110',1717448959772,'20240603210919_init',NULL,NULL,1717448959764,1);
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "username" TEXT,
    "bio" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "hashedPassword" TEXT,
    "image" TEXT,
    "calAccountId" INTEGER,
    "calAccessToken" TEXT,
    "calRefreshToken" TEXT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_calAccountId_fkey" FOREIGN KEY ("calAccountId") REFERENCES "CalAccount" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "CalAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "weekStart" TEXT NOT NULL,
    "createdDate" TEXT NOT NULL,
    "timeFormat" INTEGER NOT NULL,
    "defaultScheduleId" INTEGER,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "FilterOption" (
    "fieldId" TEXT NOT NULL,
    "fieldValue" TEXT NOT NULL,
    "fieldLabel" TEXT NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "filterCategoryFieldId" TEXT NOT NULL,
    "filterCategoryValue" TEXT NOT NULL,
    "filterCategoryLabel" TEXT NOT NULL
);
INSERT INTO FilterOption VALUES('freelancer','freelancer','Freelancer',1717448960467,'categories','categories','Category');
INSERT INTO FilterOption VALUES('agency','agency','Agency',1717448960467,'categories','categories','Category');
INSERT INTO FilterOption VALUES('product_studio','product_studio','Product Studio',1717448960467,'categories','categories','Category');
INSERT INTO FilterOption VALUES('ecommerce','ecommerce','Ecommerce',1717448960467,'capabilities','capabilities','Capabilities');
INSERT INTO FilterOption VALUES('product_management','product_management','Product Management',1717448960467,'capabilities','capabilities','Capabilities');
INSERT INTO FilterOption VALUES('app_development','app_development','App Development',1717448960467,'capabilities','capabilities','Capabilities');
INSERT INTO FilterOption VALUES('design','design','Design',1717448960467,'capabilities','capabilities','Capabilities');
INSERT INTO FilterOption VALUES('ui_ux','ui_ux','UI/UX Development',1717448960467,'capabilities','capabilities','Capabilities');
INSERT INTO FilterOption VALUES('integration_services','integration_services','Integration Services',1717448960467,'capabilities','capabilities','Capabilities');
INSERT INTO FilterOption VALUES('branding','branding','Branding',1717448960467,'capabilities','capabilities','Capabilities');
INSERT INTO FilterOption VALUES('digital_marketing','digital_marketing','Digital Marketing',1717448960467,'capabilities','capabilities','Capabilities');
INSERT INTO FilterOption VALUES('mobile_development','mobile_development','Mobile Development',1717448960467,'capabilities','capabilities','Capabilities');
INSERT INTO FilterOption VALUES('ai','ai','AI',1717448960467,'capabilities','capabilities','Capabilities');
INSERT INTO FilterOption VALUES('web3-crypto','web3-crypto','Web3 / Crypto',1717448960467,'capabilities','capabilities','Capabilities');
INSERT INTO FilterOption VALUES('nextjs','nextjs','Next.js',1717448960467,'frameworks','frameworks','Frameworks');
INSERT INTO FilterOption VALUES('nuxtjs','nuxtjs','Nuxt.js',1717448960467,'frameworks','frameworks','Frameworks');
INSERT INTO FilterOption VALUES('svelte','svelte','Svelte',1717448960467,'frameworks','frameworks','Frameworks');
INSERT INTO FilterOption VALUES('gatsby','gatsby','Gatsby',1717448960467,'frameworks','frameworks','Frameworks');
INSERT INTO FilterOption VALUES('angular','angular','Angular',1717448960467,'frameworks','frameworks','Frameworks');
INSERT INTO FilterOption VALUES('ember','ember','Ember',1717448960467,'frameworks','frameworks','Frameworks');
INSERT INTO FilterOption VALUES('vue','vue','Vue',1717448960467,'frameworks','frameworks','Frameworks');
INSERT INTO FilterOption VALUES('1000','1000','$1,000 - $4,999',1717448960467,'budgets','budgets','Budgets');
INSERT INTO FilterOption VALUES('5000','5000','$5,000 - $9,999',1717448960467,'budgets','budgets','Budgets');
INSERT INTO FilterOption VALUES('10000','10000','$10,000 - $49,999',1717448960467,'budgets','budgets','Budgets');
INSERT INTO FilterOption VALUES('50000','50000','$50,000 - $99,999',1717448960467,'budgets','budgets','Budgets');
INSERT INTO FilterOption VALUES('100000','100000','$100,000+',1717448960467,'budgets','budgets','Budgets');
INSERT INTO FilterOption VALUES('english','english','English',1717448960467,'languages','languages','Languages Spoken');
INSERT INTO FilterOption VALUES('portugese','portugese','Portuguese',1717448960467,'languages','languages','Languages Spoken');
INSERT INTO FilterOption VALUES('spanish','spanish','Spanish',1717448960467,'languages','languages','Languages Spoken');
INSERT INTO FilterOption VALUES('chinese','chinese','Chinese',1717448960467,'languages','languages','Languages Spoken');
INSERT INTO FilterOption VALUES('french','french','French',1717448960467,'languages','languages','Languages Spoken');
INSERT INTO FilterOption VALUES('japanese','japanese','Japanese',1717448960467,'languages','languages','Languages Spoken');
INSERT INTO FilterOption VALUES('german','german','German',1717448960467,'languages','languages','Languages Spoken');
INSERT INTO FilterOption VALUES('asia','asia','Asia',1717448960467,'regions','regions','Region');
INSERT INTO FilterOption VALUES('australia','australia','Australia and New Zealand',1717448960467,'regions','regions','Region');
INSERT INTO FilterOption VALUES('europe','europe','Europe',1717448960467,'regions','regions','Region');
INSERT INTO FilterOption VALUES('latin_america','latin_america','Latin America',1717448960467,'regions','regions','Region');
INSERT INTO FilterOption VALUES('middle_east','middle_east','Middle East',1717448960467,'regions','regions','Region');
INSERT INTO FilterOption VALUES('north_america','north_america','North America',1717448960467,'regions','regions','Region');
INSERT INTO FilterOption VALUES('remote','remote','Remote',1717448960467,'regions','regions','Region');
CREATE TABLE IF NOT EXISTS "FilterOptionsOnUser" (
    "userId" TEXT NOT NULL,
    "filterOptionFieldId" TEXT NOT NULL,
    "filterCategoryFieldId" TEXT NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FilterOptionsOnUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FilterOptionsOnUser_filterOptionFieldId_filterCategoryFieldId_fkey" FOREIGN KEY ("filterOptionFieldId", "filterCategoryFieldId") REFERENCES "FilterOption" ("fieldId", "filterCategoryFieldId") ON DELETE RESTRICT ON UPDATE CASCADE
);
DELETE FROM sqlite_sequence;
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_calAccountId_key" ON "User"("calAccountId");
CREATE UNIQUE INDEX "User_calAccessToken_key" ON "User"("calAccessToken");
CREATE UNIQUE INDEX "User_calRefreshToken_key" ON "User"("calRefreshToken");
CREATE UNIQUE INDEX "CalAccount_username_key" ON "CalAccount"("username");
CREATE UNIQUE INDEX "CalAccount_email_key" ON "CalAccount"("email");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE UNIQUE INDEX "FilterOption_fieldId_key" ON "FilterOption"("fieldId");
CREATE INDEX "FilterOption_fieldId_filterCategoryFieldId_idx" ON "FilterOption"("fieldId", "filterCategoryFieldId");
CREATE UNIQUE INDEX "FilterOption_fieldId_filterCategoryFieldId_key" ON "FilterOption"("fieldId", "filterCategoryFieldId");
CREATE INDEX "FilterOptionsOnUser_userId_filterOptionFieldId_filterCategoryFieldId_idx" ON "FilterOptionsOnUser"("userId", "filterOptionFieldId", "filterCategoryFieldId");
CREATE UNIQUE INDEX "FilterOptionsOnUser_userId_filterOptionFieldId_filterCategoryFieldId_key" ON "FilterOptionsOnUser"("userId", "filterOptionFieldId", "filterCategoryFieldId");
COMMIT;
