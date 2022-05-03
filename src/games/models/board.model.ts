import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'The game board' })
export class Board {
  @Field()
  height: number;

  @Field()
  width: number;

  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;
  }
}
