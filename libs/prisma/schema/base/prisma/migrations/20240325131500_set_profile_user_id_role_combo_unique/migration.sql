/*
  Warnings:

  - A unique constraint covering the columns `[userId,role]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_role_key" ON "Profile"("userId", "role");
