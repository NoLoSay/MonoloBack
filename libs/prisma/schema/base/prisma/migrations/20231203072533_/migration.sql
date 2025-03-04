/*
  Warnings:

  - Made the column `userId` on table `UserLoginLog` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "UserLoginLog" DROP CONSTRAINT "UserLoginLog_userId_fkey";

-- AlterTable
ALTER TABLE "UserLoginLog" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "UserLoginLog" ADD CONSTRAINT "UserLoginLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
