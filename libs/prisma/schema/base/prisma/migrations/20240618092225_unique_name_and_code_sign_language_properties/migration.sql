/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `SignLanguage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `SignLanguage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SignLanguage_name_key" ON "SignLanguage"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SignLanguage_code_key" ON "SignLanguage"("code");
