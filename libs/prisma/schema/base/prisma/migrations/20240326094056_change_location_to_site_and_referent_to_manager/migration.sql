/*
  Warnings:

  - The values [REFERENT] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `locationId` on the `Exhibition` table. All the data in the column will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LocationHasReferent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `siteId` to the `Exhibition` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SiteType" AS ENUM ('MUSEUM', 'LIBRARY', 'ARCHIVE', 'RESTAURANT', 'ATTRACTION', 'PUBLIC_PLACE', 'OTHER');

-- CreateEnum
CREATE TYPE "SiteTag" AS ENUM ('NOLOSAY', 'DISABILITY_FRIENDLY', 'DEAF_FRIENDLY', 'BLIND_FRIENDLY', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('USER', 'CREATOR', 'MANAGER', 'MODERATOR', 'ADMIN');
ALTER TABLE "Profile" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Profile" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "Profile" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "Exhibition" DROP CONSTRAINT "Exhibition_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_addressId_fkey";

-- DropForeignKey
ALTER TABLE "LocationHasReferent" DROP CONSTRAINT "LocationHasReferent_locationId_fkey";

-- DropForeignKey
ALTER TABLE "LocationHasReferent" DROP CONSTRAINT "LocationHasReferent_userId_fkey";

-- AlterTable
ALTER TABLE "Exhibition" DROP COLUMN "locationId",
ADD COLUMN     "siteId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "LocationHasReferent";

-- DropEnum
DROP TYPE "LocationTag";

-- DropEnum
DROP TYPE "LocationType";

-- CreateTable
CREATE TABLE "Site" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT,
    "longDescription" TEXT,
    "telNumber" TEXT,
    "email" TEXT,
    "website" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "picture" TEXT,
    "type" "SiteType" NOT NULL,
    "tags" "SiteTag"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "addressId" INTEGER NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteHasManager" (
    "id" SERIAL NOT NULL,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "siteId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SiteHasManager_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SiteHasManager_userId_siteId_key" ON "SiteHasManager"("userId", "siteId");

-- CreateIndex
CREATE UNIQUE INDEX "SiteHasManager_isMain_siteId_key" ON "SiteHasManager"("isMain", "siteId");

-- AddForeignKey
ALTER TABLE "Exhibition" ADD CONSTRAINT "Exhibition_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteHasManager" ADD CONSTRAINT "SiteHasManager_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteHasManager" ADD CONSTRAINT "SiteHasManager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
