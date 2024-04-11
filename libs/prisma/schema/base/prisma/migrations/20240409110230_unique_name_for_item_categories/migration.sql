/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ItemCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ItemCategory_name_key" ON "ItemCategory"("name");
