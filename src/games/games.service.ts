import { Game } from '@generated/prisma/game/models/game.model';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import { CreateGameDto } from './dtos/create-game.dto';
import {
  AlreadyInGameError,
  AlreadyOwnsGameError,
  NoGameInWaitingError,
} from './games.errors';
import Board from './models/board';

@Injectable()
export class GamesService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Cancel the game if the owner has one in waiting state.
   * @param ownerId The game owner
   * @returns The canceled game
   */
  async cancelGame(ownerId: string): Promise<Game> {
    // Check if the user has a waiting game
    const userHasGame = await this.prismaService.game.findFirst({
      where: {
        ownerId,
        state: {
          equals: 'Waiting',
        },
      },
    });

    if (!userHasGame) throw NoGameInWaitingError;

    // Cancel the game
    await this.prismaService.game.delete({
      where: {
        id: userHasGame.id,
      },
    });

    return userHasGame;
  }

  /**
   * Create a new game if the owner does not have one in progress.
   * @param createGameData The game information
   * @param ownerId The game owner
   * @returns The created game
   */
  async createGame(
    createGameData: CreateGameDto,
    ownerId: string,
  ): Promise<Game> {
    // Check if the user owns a game not ended
    if (await this.checkPlayerOwnsGame(ownerId)) throw AlreadyOwnsGameError;

    // Check if the user is already in a game
    if (await this.checkPlayerInGame(ownerId)) throw AlreadyInGameError;

    // Create a new game
    const board = Board.fromSize(createGameData.height, createGameData.width);

    const game = await this.prismaService.game.create({
      data: {
        lines: board.lines,
        state: 'Waiting',
        owner: {
          connect: {
            id: ownerId,
          },
        },
      },
    });

    // Makes the owner a player of this game
    await this.prismaService.playerInGame.create({
      data: {
        playOrder: 0,
        game: {
          connect: {
            id: game.id,
          },
        },
        player: {
          connect: {
            id: ownerId,
          },
        },
      },
    });

    // Returns the created game
    return game;
  }

  /**
   * Gets the user's current game
   * @param userId The user id
   * @returns The current playing game
   */
  async getCurrentGame(userId: string): Promise<Game | null> {
    const playerInGame = await this.prismaService.playerInGame.findFirst({
      where: {
        playerId: userId,
        game: {
          state: {
            not: 'Ended',
          },
        },
      },
      include: {
        game: true,
      },
    });

    return playerInGame ? playerInGame.game : null;
  }

  /**
   * Check if the player owns a not ended game.
   * @param userId The user id
   * @returns Boolean indicating if the user owns a not ended game
   */
  async checkPlayerOwnsGame(userId: string): Promise<Game | null> {
    const game = await this.prismaService.game.findFirst({
      where: {
        ownerId: userId,
        state: {
          not: 'Ended',
        },
      },
    });

    return game;
  }

  /**
   * Check if the player is in a game.
   * @param userId The user id
   * @returns Boolean indicating if the user is in a game not ended
   */
  async checkPlayerInGame(userId: string): Promise<Game | null> {
    const playerInGame = await this.prismaService.playerInGame.findFirst({
      where: {
        playerId: userId,
        game: {
          state: {
            not: 'Ended',
          },
        },
      },
      include: {
        game: true,
      },
    });

    return playerInGame ? playerInGame.game : null;
  }
}
