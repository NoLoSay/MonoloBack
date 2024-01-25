/*
  Warnings:

  - Added the required column `objectId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "objectId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "Object"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
