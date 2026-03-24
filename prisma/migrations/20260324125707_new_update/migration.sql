/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MEMBER', 'VIP');

-- CreateEnum
CREATE TYPE "StatusTransaction" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MEMBER',
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ListGames" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListGames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL DEFAULT '',
    "targetId" TEXT NOT NULL,
    "serverId" TEXT NOT NULL DEFAULT '',
    "listGamesId" INTEGER NOT NULL,
    "status" "StatusTransaction" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ListGames_name_key" ON "ListGames"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ListGames_prefix_key" ON "ListGames"("prefix");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_listGamesId_fkey" FOREIGN KEY ("listGamesId") REFERENCES "ListGames"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
