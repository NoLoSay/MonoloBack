/*
  Warnings:

  - You are about to drop the column `ip` on the `UserLoginLog` table. All the data in the column will be lost.
  - You are about to drop the column `oAuthProvidersProviderId` on the `UserLoginLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserLoginLog" DROP CONSTRAINT "UserLoginLog_oAuthProvidersProviderId_fkey";

-- AlterTable
ALTER TABLE "UserLoginLog" DROP COLUMN "ip",
DROP COLUMN "oAuthProvidersProviderId",
ADD COLUMN     "providerId" INTEGER;

-- AddForeignKey
ALTER TABLE "UserLoginLog" ADD CONSTRAINT "UserLoginLog_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "OAuthProviders"("providerId") ON DELETE SET NULL ON UPDATE CASCADE;
