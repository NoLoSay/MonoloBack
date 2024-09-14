/*
  Warnings:

  - Added the required column `givenByProfileId` to the `UserSanctions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserSanctions" ADD COLUMN     "givenByProfileId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserSanctions" ADD CONSTRAINT "UserSanctions_givenByProfileId_fkey" FOREIGN KEY ("givenByProfileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
