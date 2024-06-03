/*
  Warnings:

  - You are about to drop the column `accessToken` on the `CalAccount` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `CalAccount` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `CalAccount` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CalAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "weekStart" TEXT NOT NULL,
    "createdDate" TEXT NOT NULL,
    "timeFormat" INTEGER NOT NULL,
    "defaultScheduleId" INTEGER
);
INSERT INTO "new_CalAccount" ("createdDate", "defaultScheduleId", "email", "id", "timeFormat", "timeZone", "username", "weekStart") SELECT "createdDate", "defaultScheduleId", "email", "id", "timeFormat", "timeZone", "username", "weekStart" FROM "CalAccount";
DROP TABLE "CalAccount";
ALTER TABLE "new_CalAccount" RENAME TO "CalAccount";
CREATE UNIQUE INDEX "CalAccount_username_key" ON "CalAccount"("username");
CREATE UNIQUE INDEX "CalAccount_email_key" ON "CalAccount"("email");
CREATE TABLE "new_User" (
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
    CONSTRAINT "User_calAccountId_fkey" FOREIGN KEY ("calAccountId") REFERENCES "CalAccount" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("email", "emailVerified", "hashedPassword", "id", "image", "name", "username") SELECT "email", "emailVerified", "hashedPassword", "id", "image", "name", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_calAccountId_key" ON "User"("calAccountId");
CREATE UNIQUE INDEX "User_calAccessToken_key" ON "User"("calAccessToken");
CREATE UNIQUE INDEX "User_calRefreshToken_key" ON "User"("calRefreshToken");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
