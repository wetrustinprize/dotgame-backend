import { Game } from '@generated/prisma/game/models/game.model';
import { PlayerInGame } from '@prisma/client';
import {
  AlreadyInGameError,
  AlreadyOwnsGameError,
  NoGameInWaitingError,
} from 'games/games.errors';
import { GamesService } from 'games/games.service';
import { PrismaService } from 'prisma.service';

describe('Games Service', () => {
  let service: GamesService;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService({});

    service = new GamesService(prismaService);
  });

  describe('Creating', () => {
    it('Should not be able to create a game if user already has one in progress', () => {
      // Mock prisma
      prismaService.game.findFirst = jest.fn().mockReturnValueOnce({
        state: 'Waiting',
      } as Partial<Game>);

      // Call service and expect
      expect(service.createGame({ height: 6, width: 6 }, '1')).rejects.toThrow(
        AlreadyOwnsGameError,
      );
    });

    it('Should not be able to create a game if user already playing another game', () => {
      // Mock prisma
      prismaService.playerInGame.findFirst = jest.fn().mockReturnValueOnce({
        game: {
          state: 'Playing',
        },
      } as Partial<PlayerInGame & { game: Partial<Game> }>);

      // Call service and expect
      expect(service.createGame({ height: 6, width: 6 }, '1')).rejects.toThrow(
        AlreadyInGameError,
      );
    });
  });

  describe('Canceling', () => {
    it('Should not be able to cancel a game not in waiting state', () => {
      // Mock prisma
      prismaService.game.findFirst = jest.fn().mockReturnValueOnce({
        state: 'Playing',
      } as Partial<Game>);

      // Call service and expect
      expect(service.cancelGame('1')).rejects.toThrow(NoGameInWaitingError);
    });
  });
});
