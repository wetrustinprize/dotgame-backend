import { Game } from '@generated/prisma/game/models/game.model';
import { User } from '@generated/prisma/user/models/user.model';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import { CreateBoardDTO } from './dtos/create-board.dto';
import { DrawLineDTO } from './dtos/draw-line.dto';
import { Board } from './models/board.model';

@Injectable()
export class GamesService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new game.
   * @param user The user who created the game
   * @param createBoardDTO The information about the board
   * @returns The game entity
   */
  async createGame(user: User, createBoardDTO: CreateBoardDTO): Promise<Game> {
    // Creates the board
    const board = new Board(createBoardDTO);

    // Creates the entity
    const game = await this.prismaService.game.create({
      data: {
        board: board.toJSON(),
        ownerId: user.id,
        PlayerInGame: {
          create: {
            playerId: user.id,
          },
        },
      },
    });

    // Returns the entity
    return { ...game, board };
  }

  /**
   * Gets the game by ID
   * @param gameId The game ID
   * @returns The game
   */
  async getGame(gameId: string): Promise<Game> {
    // Gets the game
    const game = await this.prismaService.game.findUnique({
      where: {
        id: gameId,
      },
      include: {
        PlayerInGame: true,
      },
    });

    // Check if game exists
    if (!game) throw new NotFoundException('game_not_found');

    // Return the game
    return {
      ...game,
      board: Board.fromJSON(game.board),
    };
  }

  /**
   * Draws a line in the game
   * @param user The user who is drawing the line
   * @param gameId The game ID
   * @param drawLineDTO The draw line information
   * @returns The updated game
   */
  async drawLine(
    user: User,
    gameId: string,
    drawLineDTO: DrawLineDTO,
  ): Promise<Game> {
    // Gets the game
    const game = await this.prismaService.game.findUnique({
      where: {
        id: gameId,
      },
      include: {
        PlayerInGame: true,
      },
    });

    // Check if game exists
    if (!game) throw new NotFoundException('game_not_found');

    // Check if player is related to game
    const playerInGame = game.PlayerInGame.find(
      (player) => player.playerId === user.id,
    );

    if (!playerInGame) throw new UnauthorizedException('player_not_in_game');

    // Get the board
    const board = Board.fromJSON(game.board);
    console.log({ squares: board.squares });

    // Draw the line
    board.drawLine(
      drawLineDTO.x,
      drawLineDTO.y,
      drawLineDTO.linePosition,
      user.id,
    );

    // Return the game
    return {
      ...(await this.prismaService.game.update({
        data: {
          board: board.toJSON(),
        },
        where: {
          id: game.id,
        },
        include: {
          PlayerInGame: true,
        },
      })),
      board,
    };
  }
}
