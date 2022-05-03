import { Query, Resolver } from '@nestjs/graphql';
import { Game } from './models/game.model';

@Resolver(() => Game)
export class GamesResolver {
  @Query(() => String)
  sayHello(): string {
    return 'Hello world!';
  }
}
