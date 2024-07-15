-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "signLanguageId" INTEGER;

-- CreateTable
CREATE TABLE "SignLanguage" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SignLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SignLanguage_uuid_key" ON "SignLanguage"("uuid");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_signLanguageId_fkey" FOREIGN KEY ("signLanguageId") REFERENCES "SignLanguage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
