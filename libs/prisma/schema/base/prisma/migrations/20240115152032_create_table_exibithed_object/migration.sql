/*
  Warnings:

  - You are about to drop the `_ExhibitionToObject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ExhibitionToObject" DROP CONSTRAINT "_ExhibitionToObject_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExhibitionToObject" DROP CONSTRAINT "_ExhibitionToObject_B_fkey";

-- DropTable
DROP TABLE "_ExhibitionToObject";

-- CreateTable
CREATE TABLE "ExhibitedObject" (
    "id" SERIAL NOT NULL,
    "objectId" INTEGER NOT NULL,
    "exhibitionId" INTEGER NOT NULL,

    CONSTRAINT "ExhibitedObject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExhibitedObject_objectId_exhibitionId_key" ON "ExhibitedObject"("objectId", "exhibitionId");

-- AddForeignKey
ALTER TABLE "ExhibitedObject" ADD CONSTRAINT "ExhibitedObject_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "Object"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitedObject" ADD CONSTRAINT "ExhibitedObject_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "Exhibition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
