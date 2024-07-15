/*
  Warnings:

  - You are about to drop the column `picture` on the `Site` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Picture" ADD COLUMN     "siteId" INTEGER;

-- AlterTable
ALTER TABLE "Site" DROP COLUMN "picture";

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE SET NULL ON UPDATE CASCADE;
