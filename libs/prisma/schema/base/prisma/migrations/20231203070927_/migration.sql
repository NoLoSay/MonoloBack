/*
  Warnings:

  - A unique constraint covering the columns `[providerUserId,providerId]` on the table `OAuthProviderUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerUserId` to the `OAuthProviderUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OAuthProviderUser" ADD COLUMN     "providerUserId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UserLoginIpTimeCombo" (
    "id" SERIAL NOT NULL,
    "loginTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "UserLoginIpTimeCombo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OAuthProviderUser_providerUserId_providerId_key" ON "OAuthProviderUser"("providerUserId", "providerId");

-- AddForeignKey
ALTER TABLE "UserLoginIpTimeCombo" ADD CONSTRAINT "UserLoginIpTimeCombo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
