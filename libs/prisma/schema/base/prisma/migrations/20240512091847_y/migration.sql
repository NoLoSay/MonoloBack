/*
  Warnings:

  - Added the required column `price` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Site" DROP COLUMN "price",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
