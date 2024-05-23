/*
  Warnings:

  - A unique constraint covering the columns `[houseNumber,street,zip,cityId]` on the table `Address` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Address_houseNumber_street_zip_cityId_key" ON "Address"("houseNumber", "street", "zip", "cityId");
