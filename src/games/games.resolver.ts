import { Game } from '@generated/prisma/game/models/game.model';
import { User } from '@generated/prisma/user/models/user.model';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { CurrentUser } from 'auth/current-user.decorator';
import { LoggedGuard } from 'auth/logged.guard';
import { PubSub } from 'graphql-subscriptions';
import { CreateBoardDTO } from './dtos/create-board.dto';
import { DrawLineDTO } from './dtos/draw-line.dto';
import { GamesService } from './games.service';

const pubSub = new PubSub();

@Resolver(() => Game)
export class GamesResolver {
  constructor(private readonly gamesService: GamesService) {}

  @Query(() => Game)
  async getGame(@Args('id') gameId: string): Promise<Game> {
    return this.gamesService.getGame(gameId);
  }

  @Mutation(() => Game)
  @UseGuards(LoggedGuard)
  async createGame(
    @CurrentUser() user: User,
    @Args() createBoardDTO: CreateBoardDTO,
  ): Promise<Game> {
    return this.gamesService.createGame(user, createBoardDTO);
  }

  @Mutation(() => Game)
  @UseGuards(LoggedGuard)
  async drawLine(
    @CurrentUser() user: User,
    @Args('id') gameId: string,
    @Args() drawLineDTO: DrawLineDTO,
  ): Promise<Game> {
    const game = this.gamesService.drawLine(user, gameId, drawLineDTO);

    pubSub.publish('lineDrawn', { lineDraw: game });

    return game;
  }

  @Subscription(() => Game, {
    name: 'lineDrawn',
    filter: (payload, variables) => payload.gameId === variables.gameId,
  })
  async lineDrawn(@Args('gameId') gameId: string) {
    // Check if user is related to the game
    await this.gamesService.getGame(gameId);

    // Returns the pubSub
    return pubSub.asyncIterator('lineDrawn');
  }
}
