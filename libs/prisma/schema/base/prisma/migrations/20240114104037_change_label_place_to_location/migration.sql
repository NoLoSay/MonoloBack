/*
 Warnings:
 - You are about to drop the column `placeId` on the `Exhibition` table. All the data in the column will be lost.
 - You are about to drop the `ExhibitedItems` table. If the table is not empty, all the data it contains will be lost.
 - You are about to drop the `Place` table. If the table is not empty, all the data it contains will be lost.
 - You are about to drop the `PlaceHasReferent` table. If the table is not empty, all the data it contains will be lost.
 - Added the required column `locationId` to the `Exhibition` table without a default value. This is not possible if the table is not empty.
 */
-- CreateEnum
CREATE TYPE
    "LocationType" AS ENUM (
        'MUSEUM',
        'LIBRARY',
        'ARCHIVE',
        'RESTAURANT',
        'ATTRACTION',
        'PUBLIC_PLACE',
        'OTHER'
    );

-- CreateEnum
CREATE TYPE
    "LocationTag" AS ENUM (
        'NOLOSAY',
        'DISABILITY_FRIENDLY',
        'DEAF_FRIENDLY',
        'BLIND_FRIENDLY',
        'OTHER'
    );

-- DropForeignKey
ALTER TABLE
    "ExhibitedItems" DROP CONSTRAINT "ExhibitedItems_exhibitionId_fkey";

-- DropForeignKey
ALTER TABLE
    "ExhibitedItems" DROP CONSTRAINT "ExhibitedItems_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Exhibition" DROP CONSTRAINT "Exhibition_placeId_fkey";

-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_addressId_fkey";

-- DropForeignKey
ALTER TABLE
    "PlaceHasReferent" DROP CONSTRAINT "PlaceHasReferent_placeId_fkey";

-- DropForeignKey
ALTER TABLE
    "PlaceHasReferent" DROP CONSTRAINT "PlaceHasReferent_userId_fkey";

-- AlterTable
ALTER TABLE
    "Exhibition" DROP COLUMN "placeId",
ADD
    COLUMN "locationId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ExhibitedItems";

-- DropTable
DROP TABLE "Place";

-- DropTable
DROP TABLE "PlaceHasReferent";

-- DropEnum
DROP TYPE "PlaceTag";

-- DropEnum
DROP TYPE "PlaceType";

-- CreateTable
CREATE TABLE
    "Location" (
        "id" SERIAL NOT NULL,
        "name" TEXT NOT NULL,
        "shortDescription" TEXT,
        "longDescription" TEXT,
        "telNumber" TEXT,
        "email" TEXT,
        "website" TEXT,
        "price" DOUBLE PRECISION NOT NULL,
        "type" "LocationType" NOT NULL,
        "tags" "LocationTag" [],
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "deletedAt" TIMESTAMP(3),
        "addressId" INTEGER NOT NULL,

CONSTRAINT "Location_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE
    "LocationHasReferent" (
        "id" SERIAL NOT NULL,
        "isMain" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "deletedAt" TIMESTAMP(3),
        "locationId" INTEGER NOT NULL,
        "userId" INTEGER NOT NULL,

CONSTRAINT "LocationHasReferent_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE
    "_ExhibitionToItem" (
        "A" INTEGER NOT NULL,
        "B" INTEGER NOT NULL
    );

-- CreateIndex
CREATE UNIQUE INDEX "_ExhibitionToItem_AB_unique" ON "_ExhibitionToItem"("A", "B");

-- CreateIndex
CREATE INDEX
    "_ExhibitionToItem_B_index" ON "_ExhibitionToItem"("B");

-- AddForeignKey
ALTER TABLE "Exhibition"
ADD
    CONSTRAINT "Exhibition_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location"
ADD
    CONSTRAINT "Location_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    "LocationHasReferent"
ADD
    CONSTRAINT "LocationHasReferent_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    "LocationHasReferent"
ADD
    CONSTRAINT "LocationHasReferent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    "_ExhibitionToItem"
ADD
    CONSTRAINT "_ExhibitionToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "Exhibition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    "_ExhibitionToItem"
ADD
    CONSTRAINT "_ExhibitionToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;