import { Ship } from "./ship.js";

export class GameBoard {
  constructor() {
    this.board = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => new BoardSquare())
    );
  }

  placeShip(length, x, y) {
    const newShip = new Ship(length);
    this.board[x][y].ship = newShip;

    return true;
  }
}

class BoardSquare {
  constructor() {
    this.ship = null;
    this.isHit = false;
  }
}
