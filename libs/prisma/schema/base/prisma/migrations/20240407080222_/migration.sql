/*
  Warnings:

  - A unique constraint covering the columns `[name,countryId]` on the table `Department` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Department_name_countryId_key" ON "Department"("name", "countryId");
