-- CreateEnum
CREATE TYPE "LogCriticity" AS ENUM ('Info', 'Low', 'Medium', 'High', 'Critical');

-- CreateTable
CREATE TABLE "Logs" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "criticity" "LogCriticity" NOT NULL DEFAULT 'Info',
    "context" TEXT,
    "exception" TEXT,
    "content" TEXT,
    "stack" TEXT,
    "message" TEXT,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Logs_uuid_key" ON "Logs"("uuid");
