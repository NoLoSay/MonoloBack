/*
  Warnings:

  - A unique constraint covering the columns `[localPath]` on the table `Picture` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `localPath` to the `Picture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Picture" ADD COLUMN     "localPath" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Picture_localPath_key" ON "Picture"("localPath");
