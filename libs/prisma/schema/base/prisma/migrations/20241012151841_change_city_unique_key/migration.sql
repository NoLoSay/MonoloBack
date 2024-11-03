/*
  Warnings:

  - A unique constraint covering the columns `[name,zip,departmentId]` on the table `City` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "City_name_departmentId_key";

-- DropIndex
DROP INDEX "City_zip_departmentId_key";

-- CreateIndex
CREATE UNIQUE INDEX "City_name_zip_departmentId_key" ON "City"("name", "zip", "departmentId");
