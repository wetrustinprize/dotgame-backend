import { Game } from '@generated/prisma/game/models/game.model';
import { User } from '@generated/prisma/user/models/user.model';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'auth/current-user.decorator';
import { LoggedGuard } from 'auth/logged.guard';
import { CreateBoardDTO } from './dtos/create-board.dto';
import { DrawLineDTO } from './dtos/draw-line.dto';
import { GamesService } from './games.service';
@Resolver(() => Game)
export class GamesResolver {
  constructor(private readonly gamesService: GamesService) {}

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
    return this.gamesService.drawLine(user, gameId, drawLineDTO);
  }
}
