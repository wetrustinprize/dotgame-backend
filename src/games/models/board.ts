export default class Board {
  lines: number[][];

  height: number;
  width: number;

  /**
   * Creates a board by its lines
   * @param lines The lines of the board
   * @returns The loaded board
   */
  static fromLines(lines: number[][]): Board {
    const board = new Board();

    board.lines = lines;
    board.height = lines.length;
    board.width = lines[0].length;

    return board;
  }

  /**
   * Creates a board with the given size
   * @param height The board height
   * @param width The board width
   * @returns The created board
   */
  static fromSize(height: number, width: number): Board {
    const board = new Board();

    board.height = height;
    board.width = width;
    board.lines = [];

    // Height
    for (let y = 0; y < height; y++) {
      // Top/bottom lines
      const topBottom = [];

      for (let x = 0; x < width; x++) {
        topBottom.push(0);
      }

      // Left/right lines
      const leftRight = [];

      for (let x = 0; x < width + 1; x++) {
        leftRight.push(0);
      }

      board.lines.push(topBottom, leftRight);
    }

    // Return the empty board
    return board;
  }
}
