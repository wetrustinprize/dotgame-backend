import { Game } from '@generated/prisma/game/models/game.model';
import { PlayerInGame, User } from '@prisma/client';
import { GamesService } from 'games/games.service';
import { Board } from 'games/models/board.model';
import { LinePosition } from 'games/models/square.model';
import { PrismaService } from 'prisma.service';

describe('Games Service', () => {
  let service: GamesService;
  let prismaService: PrismaService;

  const mockUser: Partial<User> = {
    id: 'user',
  };

  const mockGame: Partial<Game> = {
    id: '1',
    board: new Board({ height: 2, width: 2 }).toJSON(),
    PlayerInGame: [
      {
        playerId: mockUser.id,
      },
    ] as PlayerInGame[],
  };

  beforeAll(() => {
    prismaService = new PrismaService({});

    service = new GamesService(prismaService);
  });

  describe('Get a game', () => {
    it('Should be able to get a game related to the user', async () => {
      // Mock prisma
      prismaService.game.findUnique = jest.fn().mockReturnValueOnce(mockGame);

      // Call service
      const result = await service.getGame(mockUser as User, mockGame.id);

      // Expect
      expect(result.id).toEqual(mockGame.id);
    });

    it('Should not be able to get a game not related to a user', async () => {
      // Mock prisma
      prismaService.game.findUnique = jest.fn().mockReturnValueOnce(mockGame);

      // Call service and expect error
      await expect(
        service.getGame({ id: '2' } as User, mockGame.id),
      ).rejects.toThrow('player_not_in_game');
    });
  });

  describe('Draw a line', () => {
    it('Should be able to draw a line', async () => {
      // Mock prisma
      prismaService.game.findUnique = jest.fn().mockReturnValueOnce(mockGame);
      prismaService.game.update = jest.fn().mockReturnValueOnce(mockGame);

      // Call service
      const result = await service.drawLine(mockUser as User, mockGame.id, {
        x: 0,
        y: 0,
        linePosition: LinePosition.Top,
      });

      const square = (result.board as Board).getSquare(0, 0);

      // Expect
      expect(square.top).toBe(mockUser.id);
    });

    it('Should not be able to draw a line if the game is not related to the user', async () => {
      // Mock prisma
      prismaService.game.findUnique = jest.fn().mockReturnValueOnce(mockGame);

      // Call service and expect error
      await expect(
        service.drawLine({ id: '2' } as User, mockGame.id, {
          x: 0,
          y: 0,
          linePosition: LinePosition.Top,
        }),
      ).rejects.toThrow('player_not_in_game');
    });

    it("Should not be able to draw a line if the game doesn't exist", () => {
      // Mock prisma
      prismaService.game.findUnique = jest.fn().mockReturnValueOnce(undefined);

      // Call service and expect error
      expect(
        service.drawLine(mockUser as User, '2', {
          x: 0,
          y: 0,
          linePosition: LinePosition.Top,
        }),
      ).rejects.toThrow('game_not_found');
    });
  });
});
