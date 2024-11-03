/*
  Warnings:

  - Made the column `longitude` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `latitude` on table `Address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "longitude" SET NOT NULL,
ALTER COLUMN "latitude" SET NOT NULL;
