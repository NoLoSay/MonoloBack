/*
  Warnings:

  - You are about to drop the column `givenByProfileId` on the `UserSanctions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserSanctions" DROP CONSTRAINT "UserSanctions_givenByProfileId_fkey";

-- AlterTable
ALTER TABLE "UserSanctions" DROP COLUMN "givenByProfileId",
ADD COLUMN     "issuerId" INTEGER;

-- AddForeignKey
ALTER TABLE "UserSanctions" ADD CONSTRAINT "UserSanctions_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
