/*
  Warnings:

  - Made the column `longitude` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `latitude` on table `Address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SiteType" ADD VALUE 'CASTLE';
ALTER TYPE "SiteType" ADD VALUE 'MONUMENT';
ALTER TYPE "SiteType" ADD VALUE 'GARDEN';

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "longitude" SET NOT NULL,
ALTER COLUMN "latitude" SET NOT NULL;
