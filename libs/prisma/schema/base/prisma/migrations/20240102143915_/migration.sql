-- CreateTable
CREATE TABLE "TmpVideo" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "videoId" INTEGER NOT NULL,

    CONSTRAINT "TmpVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TmpVideo_uuid_key" ON "TmpVideo"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "TmpVideo_providerId_key" ON "TmpVideo"("providerId");

-- AddForeignKey
ALTER TABLE "TmpVideo" ADD CONSTRAINT "TmpVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TmpVideo" ADD CONSTRAINT "TmpVideo_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
