/*
  Warnings:

  - You are about to drop the column `name` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the `TmpVideo` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[externalProviderId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalProviderId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ValdationStatus" AS ENUM ('VALIDATED', 'REFUSED', 'PENDING');

-- DropForeignKey
ALTER TABLE "TmpVideo" DROP CONSTRAINT "TmpVideo_userId_fkey";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "name",
DROP COLUMN "url",
ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "externalProviderId" TEXT NOT NULL,
ADD COLUMN     "validationStatus" "ValdationStatus" NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "TmpVideo";

-- CreateIndex
CREATE UNIQUE INDEX "Video_externalProviderId_key" ON "Video"("externalProviderId");
