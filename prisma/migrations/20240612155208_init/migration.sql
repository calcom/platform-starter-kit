-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "bio" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "hashedPassword" TEXT,
    "image" TEXT,
    "calAccountId" INTEGER,
    "calAccessToken" TEXT,
    "calRefreshToken" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalAccount" (
    "id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "weekStart" TEXT NOT NULL,
    "createdDate" TEXT NOT NULL,
    "timeFormat" INTEGER NOT NULL,
    "defaultScheduleId" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FilterOption" (
    "fieldId" TEXT NOT NULL,
    "fieldValue" TEXT NOT NULL,
    "fieldLabel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "filterCategoryFieldId" TEXT NOT NULL,
    "filterCategoryValue" TEXT NOT NULL,
    "filterCategoryLabel" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FilterOptionsOnUser" (
    "userId" TEXT NOT NULL,
    "filterOptionFieldId" TEXT NOT NULL,
    "filterCategoryFieldId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
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
CREATE INDEX "FilterOptionsOnUser_userId_filterOptionFieldId_filterCatego_idx" ON "FilterOptionsOnUser"("userId", "filterOptionFieldId", "filterCategoryFieldId");

-- CreateIndex
CREATE UNIQUE INDEX "FilterOptionsOnUser_userId_filterOptionFieldId_filterCatego_key" ON "FilterOptionsOnUser"("userId", "filterOptionFieldId", "filterCategoryFieldId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_calAccountId_fkey" FOREIGN KEY ("calAccountId") REFERENCES "CalAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilterOptionsOnUser" ADD CONSTRAINT "FilterOptionsOnUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilterOptionsOnUser" ADD CONSTRAINT "FilterOptionsOnUser_filterOptionFieldId_filterCategoryFiel_fkey" FOREIGN KEY ("filterOptionFieldId", "filterCategoryFieldId") REFERENCES "FilterOption"("fieldId", "filterCategoryFieldId") ON DELETE RESTRICT ON UPDATE CASCADE;
