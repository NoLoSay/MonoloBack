/*
  Warnings:

  - You are about to drop the column `userId` on the `SiteHasManager` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profileId,siteId]` on the table `SiteHasManager` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profileId` to the `SiteHasManager` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SiteHasManager" DROP CONSTRAINT "SiteHasManager_userId_fkey";

-- DropIndex
DROP INDEX "SiteHasManager_userId_siteId_key";

-- AlterTable
ALTER TABLE "SiteHasManager" DROP COLUMN "userId",
ADD COLUMN     "profileId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SiteHasManager_profileId_siteId_key" ON "SiteHasManager"("profileId", "siteId");

-- AddForeignKey
ALTER TABLE "SiteHasManager" ADD CONSTRAINT "SiteHasManager_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
