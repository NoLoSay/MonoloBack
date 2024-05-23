/*
  Warnings:

  - You are about to drop the column `externalProviderId` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hostingProviderId,hostingProviderVideoId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hostingProviderId` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostingProviderVideoId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Video_externalProviderId_key";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "externalProviderId",
ADD COLUMN     "hostingProviderId" INTEGER NOT NULL,
ADD COLUMN     "hostingProviderVideoId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "HostingProvider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "HostingProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_hostingProviderId_hostingProviderVideoId_key" ON "Video"("hostingProviderId", "hostingProviderVideoId");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_hostingProviderId_fkey" FOREIGN KEY ("hostingProviderId") REFERENCES "HostingProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
