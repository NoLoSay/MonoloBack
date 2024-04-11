/*
  Warnings:

  - A unique constraint covering the columns `[name,departmentId]` on the table `City` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[zip,departmentId]` on the table `City` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "City_name_departmentId_key" ON "City"("name", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "City_zip_departmentId_key" ON "City"("zip", "departmentId");
