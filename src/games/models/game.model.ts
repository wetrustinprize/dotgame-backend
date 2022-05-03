import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Board } from './board.model';

@ObjectType({ description: 'The game object' })
export class Game {
  @Field(() => ID)
  id: string;

  @Field(() => Board, { description: 'The game object' })
  board: Board;

  @Field({ description: 'When the game was created' })
  createdAt: Date;

  @Field({ description: 'Last time the game was updated' })
  updatedAt: Date;
}
