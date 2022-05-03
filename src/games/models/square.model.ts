import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Line } from './line.model';

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
  @Field(() => Line, { nullable: false })
  get top(): Line {
    return this._top;
  }

  @Field(() => Line, { nullable: false })
  get bottom(): Line {
    return this._bottom;
  }

  @Field(() => Line, { nullable: false })
  get left(): Line {
    return this._left;
  }

  @Field(() => Line, { nullable: false })
  get right(): Line {
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
  private _top: Line;
  private _bottom: Line;
  private _left: Line;
  private _right: Line;

  private _playerId: string;

  // Constructor
  constructor() {
    // Set the lines
    this._top = new Line();
    this._bottom = new Line();
    this._left = new Line();
    this._right = new Line();

    // Set no player
    this._playerId = 'none';
  }

  // Methods
  public drawLine(direction: LinePosition, playerId: string): void {
    // Check if line is drawn
    if (this['_' + direction].playerId !== 'none')
      throw new Error('line_drawn');

    // Set the new owner of the line
    this['_' + direction].setPlayerId(playerId);

    // Check if the square is complete
    const complete: boolean = ['top', 'bottom', 'left', 'right'].every(
      (position) => this['_' + position].playerId !== 'none',
    );

    if (complete) this._playerId = playerId;
  }
}
