/*
  Warnings:

  - You are about to drop the column `board` on the `games` table. All the data in the column will be lost.
  - Added the required column `playOrder` to the `PlayerInGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentPlayerOrder` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lines` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winnerPlayerId` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GameState" AS ENUM ('Waiting', 'Playing', 'Ended');

-- AlterTable
ALTER TABLE "PlayerInGame" ADD COLUMN     "playOrder" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "games" DROP COLUMN "board",
ADD COLUMN     "currentPlayerOrder" INTEGER NOT NULL,
ADD COLUMN     "lines" JSONB NOT NULL,
ADD COLUMN     "state" "GameState" NOT NULL,
ADD COLUMN     "winnerPlayerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_winnerPlayerId_fkey" FOREIGN KEY ("winnerPlayerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
