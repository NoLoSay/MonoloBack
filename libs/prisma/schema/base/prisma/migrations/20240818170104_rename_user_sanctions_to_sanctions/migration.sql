/*
  Warnings:

  - You are about to drop the `UserSanctions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserSanctions" DROP CONSTRAINT "UserSanctions_issuerId_fkey";

-- DropForeignKey
ALTER TABLE "UserSanctions" DROP CONSTRAINT "UserSanctions_userId_fkey";

-- DropTable
DROP TABLE "UserSanctions";

-- CreateTable
CREATE TABLE "Sanctions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "sanctionType" "SanctionType" NOT NULL,
    "reason" TEXT NOT NULL,
    "issuerId" INTEGER,
    "sanctionStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sanctionEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Sanctions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sanctions" ADD CONSTRAINT "Sanctions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sanctions" ADD CONSTRAINT "Sanctions_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
