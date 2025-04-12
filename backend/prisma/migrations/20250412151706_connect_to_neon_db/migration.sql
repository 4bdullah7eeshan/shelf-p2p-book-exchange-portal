/*
  Warnings:

  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_seekerId_fkey";

-- DropTable
DROP TABLE "Book";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "cover_url" TEXT DEFAULT 'https://cdn.pixabay.com/photo/2018/01/03/09/09/book-3057902_1280.png',
    "status" "Status" NOT NULL DEFAULT 'AVAILABLE',
    "city" TEXT NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "seeker_id" INTEGER,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_seeker_id_fkey" FOREIGN KEY ("seeker_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
