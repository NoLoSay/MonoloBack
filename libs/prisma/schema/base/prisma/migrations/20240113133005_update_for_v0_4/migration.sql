/*
  Warnings:

  - You are about to drop the column `countryId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `departmentId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `placeId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `countryId` on the `City` table. All the data in the column will be lost.
  - You are about to drop the column `cityId` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `countryId` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `mainUserId` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the `PlacehasVideos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserhasVideos` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressId` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Video` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `Video` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "PersonType" AS ENUM ('ARTIST', 'WRITER', 'SCIENTIST', 'CELEBRITY', 'OTHER');

-- CreateEnum
CREATE TYPE "PlaceType" AS ENUM ('MUSEUM', 'LIBRARY', 'ARCHIVE', 'RESTAURANT', 'ATTRACTION', 'PUBLIC_PLACE', 'OTHER');

-- CreateEnum
CREATE TYPE "PlaceTag" AS ENUM ('NOLOSAY', 'DISABILITY_FRIENDLY', 'DEAF_FRIENDLY', 'BLIND_FRIENDLY', 'OTHER');

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_placeId_fkey";

-- DropForeignKey
ALTER TABLE "City" DROP CONSTRAINT "City_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_cityId_fkey";

-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_mainUserId_fkey";

-- DropForeignKey
ALTER TABLE "PlacehasVideos" DROP CONSTRAINT "PlacehasVideos_placeId_fkey";

-- DropForeignKey
ALTER TABLE "PlacehasVideos" DROP CONSTRAINT "PlacehasVideos_videoId_fkey";

-- DropForeignKey
ALTER TABLE "UserhasVideos" DROP CONSTRAINT "UserhasVideos_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserhasVideos" DROP CONSTRAINT "UserhasVideos_videoId_fkey";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "countryId",
DROP COLUMN "departmentId",
DROP COLUMN "placeId";

-- AlterTable
ALTER TABLE "City" DROP COLUMN "countryId";

-- AlterTable
ALTER TABLE "Place" DROP COLUMN "cityId",
DROP COLUMN "countryId",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "mainUserId",
ADD COLUMN     "addressId" INTEGER NOT NULL,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "longDescription" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "tags" "PlaceTag"[],
ADD COLUMN     "telNumber" TEXT,
ADD COLUMN     "type" "PlaceType" NOT NULL,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "userId" INTEGER NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL;

-- DropTable
DROP TABLE "PlacehasVideos";

-- DropTable
DROP TABLE "UserhasVideos";

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "type" "PersonType" NOT NULL,
    "birthDate" TIMESTAMP(3),
    "deathDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjectCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ObjectCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjectType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "objectCategoryId" INTEGER NOT NULL,

    CONSTRAINT "ObjectType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Object" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "objectTypeId" INTEGER,
    "relatedPersonId" INTEGER,

    CONSTRAINT "Object_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exhibition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT,
    "longDescription" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "placeId" INTEGER NOT NULL,
    "creatorId" INTEGER NOT NULL,

    CONSTRAINT "Exhibition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaceHasReferent" (
    "id" SERIAL NOT NULL,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "placeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PlaceHasReferent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExhibitedObjects" (
    "exhibitionId" INTEGER NOT NULL,
    "objectId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ExhibitedObjects_exhibitionId_objectId_unique" ON "ExhibitedObjects"("exhibitionId", "objectId");

-- CreateIndex
CREATE INDEX "ExhibitedObjects_objectId_index" ON "ExhibitedObjects"("objectId");

-- CreateIndex
CREATE UNIQUE INDEX "Video_uuid_key" ON "Video"("uuid");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectType" ADD CONSTRAINT "ObjectType_objectCategoryId_fkey" FOREIGN KEY ("objectCategoryId") REFERENCES "ObjectCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Object" ADD CONSTRAINT "Object_objectTypeId_fkey" FOREIGN KEY ("objectTypeId") REFERENCES "ObjectType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Object" ADD CONSTRAINT "Object_relatedPersonId_fkey" FOREIGN KEY ("relatedPersonId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exhibition" ADD CONSTRAINT "Exhibition_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exhibition" ADD CONSTRAINT "Exhibition_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceHasReferent" ADD CONSTRAINT "PlaceHasReferent_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceHasReferent" ADD CONSTRAINT "PlaceHasReferent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitedObjects" ADD CONSTRAINT "ExhibitedObjects_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "Exhibition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitedObjects" ADD CONSTRAINT "ExhibitedObjects_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "Object"("id") ON DELETE CASCADE ON UPDATE CASCADE;
