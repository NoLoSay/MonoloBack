/*
  Warnings:

  - Added the required column `object` to the `SensitiveActionLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objectId` to the `SensitiveActionLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `object` to the `UserActionLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objectId` to the `UserActionLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SensitiveActionLog" ADD COLUMN     "object" TEXT NOT NULL,
ADD COLUMN     "objectId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserActionLog" ADD COLUMN     "object" TEXT NOT NULL,
ADD COLUMN     "objectId" INTEGER NOT NULL;
