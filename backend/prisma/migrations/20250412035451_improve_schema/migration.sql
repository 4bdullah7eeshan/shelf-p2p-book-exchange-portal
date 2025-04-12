-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_seekerId_fkey";

-- DropIndex
DROP INDEX "Book_seekerId_key";

-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "seekerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_seekerId_fkey" FOREIGN KEY ("seekerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
