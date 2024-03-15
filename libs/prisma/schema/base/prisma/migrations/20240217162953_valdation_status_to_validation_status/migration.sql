/*
  Warnings:

  - The `validationStatus` column on the `Video` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ValidationStatus" AS ENUM ('VALIDATED', 'REFUSED', 'PENDING');

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "validationStatus",
ADD COLUMN     "validationStatus" "ValidationStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "ValdationStatus";
