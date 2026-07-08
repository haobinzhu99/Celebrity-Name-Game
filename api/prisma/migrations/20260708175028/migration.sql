/*
  Warnings:

  - A unique constraint covering the columns `[normalizedAnswer]` on the table `Answer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gameId]` on the table `Answer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Answer_gameId_normalizedAnswer_key";

-- CreateIndex
CREATE UNIQUE INDEX "Answer_normalizedAnswer_key" ON "Answer"("normalizedAnswer");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_gameId_key" ON "Answer"("gameId");
