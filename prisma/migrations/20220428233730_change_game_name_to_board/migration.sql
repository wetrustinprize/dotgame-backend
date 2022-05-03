/*
  Warnings:

  - You are about to drop the column `game` on the `games` table. All the data in the column will be lost.
  - Added the required column `board` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "games" DROP COLUMN "game",
ADD COLUMN     "board" JSONB NOT NULL;
