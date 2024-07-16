/*
  Warnings:

  - You are about to drop the column `zip` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `City` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[houseNumber,street,postcode,cityId]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postcode,departmentId]` on the table `City` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `postcode` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postcode` to the `City` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Address_houseNumber_street_zip_cityId_key";

-- DropIndex
DROP INDEX "City_zip_departmentId_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "zip",
ADD COLUMN     "postcode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "City" DROP COLUMN "zip",
ADD COLUMN     "postcode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Address_houseNumber_street_postcode_cityId_key" ON "Address"("houseNumber", "street", "postcode", "cityId");

-- CreateIndex
CREATE UNIQUE INDEX "City_postcode_departmentId_key" ON "City"("postcode", "departmentId");
