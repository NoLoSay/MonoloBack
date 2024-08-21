/*
  Warnings:

  - You are about to drop the `BannedUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SanctionType" AS ENUM ('BAN', 'BLOCK_UPLOAD');

-- DropForeignKey
ALTER TABLE "BannedUser" DROP CONSTRAINT "BannedUser_userId_fkey";

-- DropTable
DROP TABLE "BannedUser";

-- CreateTable
CREATE TABLE "UserSanctions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "sanctionType" "SanctionType" NOT NULL,
    "reason" TEXT NOT NULL,
    "sanctionStart" TIMESTAMP(3) NOT NULL,
    "sanctionEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UserSanctions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SanctionTypeColor" (
    "id" SERIAL NOT NULL,
    "sanctionType" "SanctionType" NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#ffffff',

    CONSTRAINT "SanctionTypeColor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SanctionTypeColor_sanctionType_key" ON "SanctionTypeColor"("sanctionType");

-- AddForeignKey
ALTER TABLE "UserSanctions" ADD CONSTRAINT "UserSanctions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
