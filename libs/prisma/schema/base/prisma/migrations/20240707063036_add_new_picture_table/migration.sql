-- CreateTable
CREATE TABLE "Picture" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "hostingUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedReason" TEXT,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "Picture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Picture_uuid_key" ON "Picture"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Picture_hostingUrl_key" ON "Picture"("hostingUrl");

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
