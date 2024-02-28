/*
  Warnings:

  - You are about to drop the column `userId` on the `LocationHasReferent` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserlikesVideos` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profileId,locationId]` on the table `LocationHasReferent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profileId` to the `LocationHasReferent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `UserlikesVideos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'CREATOR';
ALTER TYPE "Role" ADD VALUE 'MODERATOR';

-- DropForeignKey
ALTER TABLE "LocationHasReferent" DROP CONSTRAINT "LocationHasReferent_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserlikesVideos" DROP CONSTRAINT "UserlikesVideos_userId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_userId_fkey";

-- DropIndex
DROP INDEX "LocationHasReferent_userId_locationId_key";

-- AlterTable
ALTER TABLE "LocationHasReferent" DROP COLUMN "userId",
ADD COLUMN     "profileId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserlikesVideos" DROP COLUMN "userId",
ADD COLUMN     "profileId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "userId",
ADD COLUMN     "profileId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LocationHasReferent_profileId_locationId_key" ON "LocationHasReferent"("profileId", "locationId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserlikesVideos" ADD CONSTRAINT "UserlikesVideos_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationHasReferent" ADD CONSTRAINT "LocationHasReferent_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
