import { Game } from '@generated/prisma/game/models/game.model';
import { User } from '@generated/prisma/user/models/user.model';
import { PlayerInGame } from '@prisma/client';
import {
  AlreadyInGameError,
  AlreadyOwnsGameError,
  GameAlreadyStartedError,
  NoGameInWaitingError,
  NotInGameError,
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

  describe('Joining', () => {
    it('Should not be able to join a game if already in one', () => {
      // Mock prisma
      prismaService.playerInGame.findFirst = jest.fn().mockReturnValueOnce({
        game: {
          state: 'Playing',
        },
      } as Partial<PlayerInGame & { game: Partial<Game> }>);

      // Call service and expect
      expect(service.joinGame({ id: '1' }, '1')).rejects.toThrow(
        AlreadyInGameError,
      );
    });

    it('Should not be able to join a game that has started or ended', () => {
      // Mock prisma
      prismaService.game.findFirst = jest.fn().mockReturnValueOnce({
        state: 'Playing',
      } as Partial<Game>);

      // Call service and expect
      expect(service.joinGame({ id: '1' }, '1')).rejects.toThrow(
        GameAlreadyStartedError,
      );
    });
  });

  describe('Leaving', () => {
    it('Should not be able to leave a game if not in one', () => {
      // Mock prisma
      prismaService.playerInGame.findFirst = jest
        .fn()
        .mockReturnValueOnce(null);

      // Call service and expect
      expect(service.leaveGame('1')).rejects.toThrow(NotInGameError);
    });

    it('Should set the winner if all the other players left', async () => {
      // Mock prisma
      prismaService.playerInGame.updateMany = jest.fn();
      prismaService.game.update = jest.fn();
      prismaService.game.findUnique = jest.fn();

      prismaService.playerInGame.findMany = jest
        .fn()
        .mockReturnValueOnce([{ id: '0' } as Partial<User>]);
      prismaService.playerInGame.findFirst = jest.fn().mockReturnValueOnce({
        game: {
          state: 'Playing',
        },
      } as Partial<PlayerInGame & { game: Partial<Game> }>);

      // Call service and expect
      await service.leaveGame('1');

      expect(prismaService.game.update).toHaveBeenCalled();
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
