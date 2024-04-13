/*
  Warnings:

  - A unique constraint covering the columns `[name,siteId]` on the table `Exhibition` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Exhibition_name_siteId_key" ON "Exhibition"("name", "siteId");
