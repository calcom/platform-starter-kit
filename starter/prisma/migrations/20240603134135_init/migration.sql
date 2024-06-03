-- CreateTable
CREATE TABLE "Account" (
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

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "username" TEXT,
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

-- CreateTable
CREATE TABLE "CalAccount" (
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

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FilterOption" (
    "fieldId" TEXT NOT NULL,
    "fieldValue" TEXT NOT NULL,
    "fieldLabel" TEXT NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "filterCategoryFieldId" TEXT NOT NULL,
    "filterCategoryValue" TEXT NOT NULL,
    "filterCategoryLabel" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FilterOptionsOnUser" (
    "userId" TEXT NOT NULL,
    "filterOptionFieldId" TEXT NOT NULL,
    "filterCategoryFieldId" TEXT NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FilterOptionsOnUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FilterOptionsOnUser_filterOptionFieldId_filterCategoryFieldId_fkey" FOREIGN KEY ("filterOptionFieldId", "filterCategoryFieldId") REFERENCES "FilterOption" ("fieldId", "filterCategoryFieldId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_calAccountId_key" ON "User"("calAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "User_calAccessToken_key" ON "User"("calAccessToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_calRefreshToken_key" ON "User"("calRefreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "CalAccount_username_key" ON "CalAccount"("username");

-- CreateIndex
CREATE UNIQUE INDEX "CalAccount_email_key" ON "CalAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "FilterOption_fieldId_key" ON "FilterOption"("fieldId");

-- CreateIndex
CREATE INDEX "FilterOption_fieldId_filterCategoryFieldId_idx" ON "FilterOption"("fieldId", "filterCategoryFieldId");

-- CreateIndex
CREATE UNIQUE INDEX "FilterOption_fieldId_filterCategoryFieldId_key" ON "FilterOption"("fieldId", "filterCategoryFieldId");

-- CreateIndex
CREATE INDEX "FilterOptionsOnUser_userId_filterOptionFieldId_filterCategoryFieldId_idx" ON "FilterOptionsOnUser"("userId", "filterOptionFieldId", "filterCategoryFieldId");

-- CreateIndex
CREATE UNIQUE INDEX "FilterOptionsOnUser_userId_filterOptionFieldId_filterCategoryFieldId_key" ON "FilterOptionsOnUser"("userId", "filterOptionFieldId", "filterCategoryFieldId");
