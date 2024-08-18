-- DropForeignKey
ALTER TABLE "UserSanctions" DROP CONSTRAINT "UserSanctions_givenByProfileId_fkey";

-- AlterTable
ALTER TABLE "UserSanctions" ALTER COLUMN "givenByProfileId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserSanctions" ADD CONSTRAINT "UserSanctions_givenByProfileId_fkey" FOREIGN KEY ("givenByProfileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
