import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'A line in a square' })
export class Line {
  // Public access variables
  @Field(() => String, {
    nullable: false,
    description: 'The player who "owns" this line. (who drew over it)',
  })
  get playerId(): string {
    return this._playerId;
  }

  // Private access variables
  private _playerId: string;

  // Constructor
  constructor() {
    this._playerId = 'none';
  }

  // Methods
  setPlayerId(playerId: string): void {
    this._playerId = playerId;
  }
}
