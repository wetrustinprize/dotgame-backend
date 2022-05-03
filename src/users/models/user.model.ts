import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PlayerInGame } from 'src/games/models/player-in-game.model';

@ObjectType({ description: 'The user object' })
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field(() => PlayerInGame, {
    description: 'The games this player is related',
  })
  PlayerInGame: PlayerInGame[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
