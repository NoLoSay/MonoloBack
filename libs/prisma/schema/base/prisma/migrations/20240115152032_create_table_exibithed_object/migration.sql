/*
  Warnings:

  - You are about to drop the `_ExhibitionToItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ExhibitionToItem" DROP CONSTRAINT "_ExhibitionToItem_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExhibitionToItem" DROP CONSTRAINT "_ExhibitionToItem_B_fkey";

-- DropTable
DROP TABLE "_ExhibitionToItem";

-- CreateTable
CREATE TABLE "ExhibitedItem" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "exhibitionId" INTEGER NOT NULL,

    CONSTRAINT "ExhibitedItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExhibitedItem_itemId_exhibitionId_key" ON "ExhibitedItem"("itemId", "exhibitionId");

-- AddForeignKey
ALTER TABLE "ExhibitedItem" ADD CONSTRAINT "ExhibitedItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitedItem" ADD CONSTRAINT "ExhibitedItem_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "Exhibition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
