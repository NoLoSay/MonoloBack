-- DropForeignKey
ALTER TABLE "Picture" DROP CONSTRAINT "Picture_itemId_fkey";

-- AlterTable
ALTER TABLE "Picture" ALTER COLUMN "itemId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
