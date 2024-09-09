-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "siteId" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExhibitionHasRoom" (
    "id" SERIAL NOT NULL,
    "specName" TEXT,
    "specDesc" TEXT,
    "exhibitionId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "ExhibitionHasRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_siteId_key" ON "Room"("name", "siteId");

-- CreateIndex
CREATE INDEX "ExhibitionHasRoom_roomId_exhibitionId_idx" ON "ExhibitionHasRoom"("roomId", "exhibitionId");

-- CreateIndex
CREATE UNIQUE INDEX "ExhibitionHasRoom_exhibitionId_roomId_key" ON "ExhibitionHasRoom"("exhibitionId", "roomId");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitionHasRoom" ADD CONSTRAINT "ExhibitionHasRoom_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "Exhibition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitionHasRoom" ADD CONSTRAINT "ExhibitionHasRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
