/*
  Warnings:

  - You are about to drop the `ExhibitedObject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Object` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ObjectCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ObjectType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExhibitedObject" DROP CONSTRAINT "ExhibitedObject_exhibitionId_fkey";

-- DropForeignKey
ALTER TABLE "ExhibitedObject" DROP CONSTRAINT "ExhibitedObject_objectId_fkey";

-- DropForeignKey
ALTER TABLE "Object" DROP CONSTRAINT "Object_objectTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Object" DROP CONSTRAINT "Object_relatedPersonId_fkey";

-- DropForeignKey
ALTER TABLE "ObjectType" DROP CONSTRAINT "ObjectType_objectCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_objectId_fkey";

-- DropTable
DROP TABLE "ExhibitedObject";

-- DropTable
DROP TABLE "Object";

-- DropTable
DROP TABLE "ObjectCategory";

-- DropTable
DROP TABLE "ObjectType";

-- CreateTable
CREATE TABLE "ItemCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ItemCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "objectCategoryId" INTEGER NOT NULL,

    CONSTRAINT "ItemType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "picture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "objectTypeId" INTEGER,
    "relatedPersonId" INTEGER,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExhibitedItem" (
    "id" SERIAL NOT NULL,
    "objectId" INTEGER NOT NULL,
    "exhibitionId" INTEGER NOT NULL,

    CONSTRAINT "ExhibitedItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExhibitedItem_objectId_exhibitionId_key" ON "ExhibitedItem"("objectId", "exhibitionId");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemType" ADD CONSTRAINT "ItemType_objectCategoryId_fkey" FOREIGN KEY ("objectCategoryId") REFERENCES "ItemCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_objectTypeId_fkey" FOREIGN KEY ("objectTypeId") REFERENCES "ItemType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_relatedPersonId_fkey" FOREIGN KEY ("relatedPersonId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitedItem" ADD CONSTRAINT "ExhibitedItem_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitedItem" ADD CONSTRAINT "ExhibitedItem_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "Exhibition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
