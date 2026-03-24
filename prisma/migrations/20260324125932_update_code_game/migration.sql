/*
  Warnings:

  - A unique constraint covering the columns `[codeGame]` on the table `ListGames` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codeGame` to the `ListGames` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ListGames" ADD COLUMN     "codeGame" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ListGames_codeGame_key" ON "ListGames"("codeGame");
