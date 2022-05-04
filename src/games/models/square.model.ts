import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

// Line position enum
export enum LinePosition {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
}

registerEnumType(LinePosition, {
  name: 'LinePosition',
  description: 'The line position inside a square',
});

@ObjectType({ description: 'A cube in the game board' })
export class Square {
  // Public access variables
  @Field(() => String, { nullable: false })
  get top(): string {
    return this._top;
  }

  @Field(() => String, { nullable: false })
  get bottom(): string {
    return this._bottom;
  }

  @Field(() => String, { nullable: false })
  get left(): string {
    return this._left;
  }

  @Field(() => String, { nullable: false })
  get right(): string {
    return this._right;
  }

  @Field(() => String, {
    nullable: false,
    description: 'The player who "owns" this cube. (who scored the point)',
  })
  get playerId(): string {
    return this._playerId;
  }

  // Private access variables
  private _top: string;
  private _bottom: string;
  private _left: string;
  private _right: string;

  private _playerId: string;

  // Constructor
  constructor() {
    // Set the lines
    this._top = 'none';
    this._bottom = 'none';
    this._left = 'none';
    this._right = 'none';

    // Set no player
    this._playerId = 'none';
  }

  // Methods
  public drawLine(direction: LinePosition, playerId: string): void {
    // Check if line is drawn
    if (this['_' + direction] !== 'none') throw new Error('line_drawn');

    // Set the new owner of the line
    this['_' + direction] = playerId;

    // Check if the square is complete
    const complete: boolean = ['top', 'bottom', 'left', 'right'].every(
      (position) => this['_' + position] !== 'none',
    );

    if (complete) this._playerId = playerId;
  }
}
