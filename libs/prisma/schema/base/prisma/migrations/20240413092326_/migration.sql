/*
  Warnings:

  - You are about to drop the column `urlRegex` on the `HostingProvider` table. All the data in the column will be lost.
  - Added the required column `url` to the `HostingProvider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HostingProvider" DROP COLUMN "urlRegex",
ADD COLUMN     "url" TEXT NOT NULL;
