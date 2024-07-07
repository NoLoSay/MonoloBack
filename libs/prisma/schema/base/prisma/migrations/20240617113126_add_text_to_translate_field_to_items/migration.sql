/*
  Warnings:

  - Added the required column `textToTranslate` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "textToTranslate" TEXT NOT NULL;
