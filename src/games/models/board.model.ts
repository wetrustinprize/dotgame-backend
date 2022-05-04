import { Field, ObjectType } from '@nestjs/graphql';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CreateBoardDTO } from 'games/dtos/create-board.dto';
import { LinePosition, Square } from './square.model';
@ObjectType({ description: 'The game board' })
export class Board {
  // Public access variables
  @Field(() => Number, { nullable: false })
  get height(): number {
    return this._height;
  }

  @Field(() => Number, { nullable: false })
  get width(): number {
    return this._width;
  }

  @Field(() => [[Square]], {
    nullable: false,
    description: 'All the squares in the board',
  })
  get squares(): Square[][] {
    return this._squares;
  }

  // Private variables
  private _height: number;
  private _width: number;
  private _squares: Square[][];

  // Constructor
  constructor({ height, width }: CreateBoardDTO) {
    // Checks
    if (height <= 0 || width <= 0) throw new Error('invalid_size');

    // Set the board size
    this._height = height;
    this._width = width;

    // Create the lines
    this._squares = [...Array(height).keys()].map(() =>
      [...Array(width).keys()].map(() => new Square()),
    );
  }

  // Static methods
  static fromJSON(json: any): Board {
    const jsonParsed = JSON.parse(json);

    const board: Board = Object.setPrototypeOf(jsonParsed, Board.prototype);
    const squares: Square[][] = jsonParsed._squares.map((line: Square[]) =>
      line.map((square) => Object.setPrototypeOf(square, Square.prototype)),
    );

    board._squares = squares;

    return board;
  }

  // Methods
  public toJSON(): any {
    return JSON.stringify(instanceToPlain(this));
  }

  public drawLine(
    x: number,
    y: number,
    direction: LinePosition,
    playerId: string,
  ): void {
    // Checks
    if (x < 0 || x >= this._width || y < 0 || y >= this._height)
      throw new Error('invalid_position');

    // Draw line
    this._squares[y][x].drawLine(direction, playerId);
  }

  public getSquare(x: number, y: number): Square {
    return this._squares[y][x];
  }
}
