import { Ship } from "./ship.js";

export class GameBoard {
  constructor() {
    this.board = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => new BoardSquare())
    );

    this.direction = "vertical";
  }

  #placeVertically(shipToPlace, x, y) {
    for (let i = x; i < x + shipToPlace.length; i++) {
      if (this.board[i][y].ship) return false;
    }

    for (let i = x; i < x + shipToPlace.length; i++) {
      this.board[i][y].ship = shipToPlace;
    }

    return true;
  }

  #placeHorizontally(shipToPlace, x, y) {
    for (let i = y; i < y + shipToPlace.length; i++) {
      if (this.board[x][i].ship) return false;
    }

    for (let i = y; i < y + shipToPlace.length; i++) {
      this.board[x][i].ship = shipToPlace;
    }

    return true;
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
