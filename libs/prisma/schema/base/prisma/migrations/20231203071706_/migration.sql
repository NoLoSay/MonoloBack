/*
  Warnings:

  - You are about to drop the `UserLoginIpTimeCombo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserLoginIpTimeCombo" DROP CONSTRAINT "UserLoginIpTimeCombo_userId_fkey";

-- DropTable
DROP TABLE "UserLoginIpTimeCombo";

-- CreateTable
CREATE TABLE "UserLoginLog" (
    "id" SERIAL NOT NULL,
    "loginTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT NOT NULL,
    "userId" INTEGER,
    "oAuthProvidersProviderId" INTEGER,

    CONSTRAINT "UserLoginLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserLoginLog" ADD CONSTRAINT "UserLoginLog_oAuthProvidersProviderId_fkey" FOREIGN KEY ("oAuthProvidersProviderId") REFERENCES "OAuthProviders"("providerId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLoginLog" ADD CONSTRAINT "UserLoginLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
