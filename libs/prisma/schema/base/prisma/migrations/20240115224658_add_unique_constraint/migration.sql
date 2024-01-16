/*
  Warnings:

  - A unique constraint covering the columns `[userId,locationId]` on the table `LocationHasReferent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[isMain,locationId]` on the table `LocationHasReferent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LocationHasReferent_userId_locationId_key" ON "LocationHasReferent"("userId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "LocationHasReferent_isMain_locationId_key" ON "LocationHasReferent"("isMain", "locationId");
