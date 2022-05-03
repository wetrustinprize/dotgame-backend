import { Board } from 'games/models/board.model';
import { LinePosition } from 'games/models/square.model';

describe('Game Board', () => {
  describe('Creation', () => {
    it('Should be able to create a game board', () => {
      expect(() => new Board({ height: 12, width: 12 })).toBeDefined();
    });

    it('Should not be able to create a game board with invalid size', () => {
      expect(() => new Board({ height: 0, width: 0 })).toThrow('invalid_size');
      expect(() => new Board({ height: 4, width: 0 })).toThrow('invalid_size');
      expect(() => new Board({ height: -3, width: -3 })).toThrow(
        'invalid_size',
      );
    });

    it('Should have a total of cubes equal to the height times the width', () => {
      const board = new Board({ height: 12, width: 12 });

      const sum = board.squares.reduce((acc, curr) => acc + curr.length, 0);

      expect(sum).toBe(board.height * board.width);
    });
  });

  describe('Gameplay', () => {
    it('Should be able to draw a line', () => {
      const board = new Board({ height: 12, width: 12 });

      board.drawLine(0, 0, LinePosition.Top, 'player1');

      expect(board.squares[0][0].top.playerId).toBe('player1');
    });

    it('Should not be able to draw a line on a taken line', () => {
      const board = new Board({ height: 12, width: 12 });

      board.drawLine(0, 0, LinePosition.Top, 'player1');

      expect(() => board.drawLine(0, 0, LinePosition.Top, 'player2')).toThrow(
        'line_drawn',
      );
    });

    it('Should be able to score a square', () => {
      const board = new Board({ height: 12, width: 12 });

      board.drawLine(0, 0, LinePosition.Top, 'player1');
      board.drawLine(0, 0, LinePosition.Right, 'player1');
      board.drawLine(0, 0, LinePosition.Bottom, 'player1');
      board.drawLine(0, 0, LinePosition.Left, 'player1');

      expect(board.squares[0][0].playerId).toBe('player1');
    });

    it('Should not be able to draw a line outside the board', () => {
      const board = new Board({ height: 5, width: 5 });

      expect(() => board.drawLine(-1, 0, LinePosition.Top, 'player')).toThrow(
        'invalid_position',
      );
      expect(() => board.drawLine(0, 12, LinePosition.Top, 'player')).toThrow(
        'invalid_position',
      );
      expect(() => board.drawLine(12, 0, LinePosition.Top, 'player')).toThrow(
        'invalid_position',
      );
      expect(() => board.drawLine(0, 12, LinePosition.Top, 'player')).toThrow(
        'invalid_position',
      );
    });
  });
});
