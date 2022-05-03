import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Game } from './game.model';

@ObjectType({ description: 'The relation between players and games' })
export class PlayerInGame {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  playerId: string;

  @Field()
  player: string;

  @Field(() => ID)
  gameId: string;

  @Field(() => Game)
  game: Game;
}
