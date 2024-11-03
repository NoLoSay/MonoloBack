/*
  Warnings:

  - The values [CELEBRITY] on the enum `PersonType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PersonType_new" AS ENUM ('ARTIST', 'WRITER', 'SCIENTIST', 'ROYALTY', 'PERFORMER', 'LEADER', 'INVENTOR', 'ARTISAN', 'ARCHITECT', 'OTHER');
ALTER TABLE "Person" ALTER COLUMN "type" TYPE "PersonType_new" USING ("type"::text::"PersonType_new");
ALTER TABLE "PersonTypeColor" ALTER COLUMN "personType" TYPE "PersonType_new" USING ("personType"::text::"PersonType_new");
ALTER TYPE "PersonType" RENAME TO "PersonType_old";
ALTER TYPE "PersonType_new" RENAME TO "PersonType";
DROP TYPE "PersonType_old";
COMMIT;
