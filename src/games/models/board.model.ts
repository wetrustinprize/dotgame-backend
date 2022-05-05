import { Field, ObjectType } from '@nestjs/graphql';
import { instanceToPlain } from 'class-transformer';
import { CreateBoardDTO } from 'games/dtos/create-board.dto';
import { LinePosition, Square } from './square.model';
import { Memoize } from 'typescript-memoize';
import { ScoreboardEntry } from './scoreboard.model';
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

  @Field(() => [ScoreboardEntry], {
    nullable: false,
    description: 'The scoreboard, ordered by points scored',
  })
  @Memoize()
  get scoreBoard(): ScoreboardEntry[] {
    const scoreboard: ScoreboardEntry[] = [];

    // Loop through all the squares
    this.squares.forEach((squareRow) =>
      squareRow.forEach((square) => {
        // Get the player who own the square
        const { playerId: squareOwner } = square;

        // Get the players who own lines
        const linesOwners = [
          square.top,
          square.bottom,
          square.left,
          square.right,
        ];

        // Check if scoreboard entry already exists
        const exists = scoreboard.find(
          (entry) => entry.playerId === squareOwner,
        );

        if (exists) exists.score += 1;
        else scoreboard.push(new ScoreboardEntry(squareOwner, 1, 0));

        // Loop through all the lines owners
        linesOwners.forEach((lineOwner) => {
          // Check if scoreboard entry already exists (for lines)
          const exists = scoreboard.find(
            (entry) => entry.playerId === lineOwner,
          );

          if (exists) exists.totalLines += 1;
          else scoreboard.push(new ScoreboardEntry(lineOwner, 0, 1));
        });
      }),
    );

    // Returns the scoreboard
    return (
      scoreboard
        // Remove non player ids
        .filter((scoreboard) => scoreboard.playerId !== 'none')
        // Order by score or total lines
        .sort((a, b) => {
          // Order by score
          if (a.score > b.score) return -1;
          if (a.score < b.score) return 1;

          //Otherwise order by total lines
          if (a.totalLines > b.totalLines) return -1;
          if (a.totalLines < b.totalLines) return 1;
        })
    );
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

  /**
   * Draws a line in a specific square.
   * @param x The x position of the square
   * @param y The y position of the square
   * @param direction The direction of the line
   * @param playerId The player id
   * @returns True if the square was fully drawn, false otherwise
   */
  public drawLine(
    x: number,
    y: number,
    direction: LinePosition,
    playerId: string,
  ): boolean {
    // Checks
    if (x < 0 || x >= this._width || y < 0 || y >= this._height)
      throw new Error('invalid_position');

    // Draw line
    return this._squares[y][x].drawLine(direction, playerId);
  }

  /**
   * Gets a specific square in the board
   * @param x The x position of the square
   * @param y The y position of the square
   * @returns The square
   */
  public getSquare(x: number, y: number): Square {
    // Checks
    if (x < 0 || x >= this._width || y < 0 || y >= this._height)
      throw new Error('invalid_position');

    // Returns the square
    return this._squares[y][x];
  }
}
