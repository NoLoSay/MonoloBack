/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Exhibition` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exhibition" DROP CONSTRAINT "Exhibition_creatorId_fkey";

-- AlterTable
ALTER TABLE "Exhibition" DROP COLUMN "creatorId";
