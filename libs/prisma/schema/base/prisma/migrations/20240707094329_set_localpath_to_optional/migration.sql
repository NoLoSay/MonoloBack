-- DropIndex
DROP INDEX "Picture_localPath_key";

-- AlterTable
ALTER TABLE "Picture" ALTER COLUMN "localPath" DROP NOT NULL;
