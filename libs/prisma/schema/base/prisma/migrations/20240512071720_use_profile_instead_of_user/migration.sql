/*
  Warnings:

  - You are about to drop the column `userId` on the `SensitiveActionLog` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserActionLog` table. All the data in the column will be lost.
  - Added the required column `profileId` to the `SensitiveActionLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `UserActionLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SensitiveActionLog" DROP CONSTRAINT "SensitiveActionLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserActionLog" DROP CONSTRAINT "UserActionLog_userId_fkey";

-- AlterTable
ALTER TABLE "SensitiveActionLog" DROP COLUMN "userId",
ADD COLUMN     "profileId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserActionLog" DROP COLUMN "userId",
ADD COLUMN     "profileId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserActionLog" ADD CONSTRAINT "UserActionLog_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensitiveActionLog" ADD CONSTRAINT "SensitiveActionLog_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
