import { Game } from '@generated/prisma/game/models/game.model';
import { User } from '@generated/prisma/user/models/user.model';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'auth/current-user.decorator';
import { LoggedGuard } from 'auth/logged.guard';
import { CreateGameDto } from './dtos/create-game.dto';
import { GamesService } from './games.service';

@Resolver(() => Game)
export class GamesResolver {
  constructor(private readonly gamesService: GamesService) {}

  @Mutation(() => Game, {
    description:
      "Creates a new game if the user doesn't have one in progress or waiting",
  })
  @UseGuards(LoggedGuard)
  createGame(
    @Args() createGameData: CreateGameDto,
    @CurrentUser() user: User,
  ): Promise<Game> {
    return this.gamesService.createGame(createGameData, user.id);
  }

  @Mutation(() => Game, {
    description: 'Cancels the current created or joined waiting game',
  })
  @UseGuards(LoggedGuard)
  cancelGame(@CurrentUser() user: User): Promise<Game> {
    return this.gamesService.cancelGame(user.id);
  }

  @Query(() => Game, {
    description: "Returns the user's current game",
    nullable: true,
  })
  @UseGuards(LoggedGuard)
  currentGame(@CurrentUser() user: User): Promise<Game | null> {
    return this.gamesService.getCurrentGame(user.id);
  }
}
