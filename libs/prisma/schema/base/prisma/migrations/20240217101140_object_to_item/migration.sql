/*
  Warnings:

  - You are about to drop the column `itemId` on the `ExhibitedItem` table. All the data in the column will be lost.
  - You are about to drop the column `itemTypeId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `itemCategoryId` on the `ItemType` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[itemId,exhibitionId]` on the table `ExhibitedItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemId` to the `ExhibitedItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemCategoryId` to the `ItemType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExhibitedItem" DROP CONSTRAINT "ExhibitedItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_itemTypeId_fkey";

-- DropForeignKey
ALTER TABLE "ItemType" DROP CONSTRAINT "ItemType_itemCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_itemId_fkey";

-- DropIndex
DROP INDEX "ExhibitedItem_itemId_exhibitionId_key";

-- AlterTable
ALTER TABLE "ExhibitedItem" DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "itemTypeId",
ADD COLUMN     "itemTypeId" INTEGER;

-- AlterTable
ALTER TABLE "ItemType" DROP COLUMN "itemCategoryId",
ADD COLUMN     "itemCategoryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ExhibitedItem_itemId_exhibitionId_key" ON "ExhibitedItem"("itemId", "exhibitionId");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemType" ADD CONSTRAINT "ItemType_itemCategoryId_fkey" FOREIGN KEY ("itemCategoryId") REFERENCES "ItemCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_itemTypeId_fkey" FOREIGN KEY ("itemTypeId") REFERENCES "ItemType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitedItem" ADD CONSTRAINT "ExhibitedItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
