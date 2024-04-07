/*
  Warnings:

  - You are about to drop the column `userId` on the `Video` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_userId_fkey";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "userId";
