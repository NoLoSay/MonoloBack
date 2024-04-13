/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `HostingProvider` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `urlRegex` to the `HostingProvider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HostingProvider" ADD COLUMN     "urlRegex" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "HostingProvider_name_key" ON "HostingProvider"("name");
