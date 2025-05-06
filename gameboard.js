import { Ship } from "./ship.js";

export class GameBoard {
  constructor() {
    this.board = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => new BoardSquare())
    );

    this.placementDirection = "vertical";

    this.missedAttacks = [];

    this.ships = [];
  }

  togglePlacementDirection() {
    return (this.placementDirection =
      this.placementDirection === "vertical" ? "horizontal" : "vertical");
  }

  #addShip(ship) {
    this.ships.push(ship);
  }

  #withinBoard(length, x, y) {
    return x + length < 10 && y + length < 10;
  }

  #placeVertically(shipToPlace, x, y) {
    for (let i = x; i < x + shipToPlace.length; i++) {
      if (this.board[i][y].ship) return false;
    }

    for (let i = x; i < x + shipToPlace.length; i++) {
      this.board[i][y].ship = shipToPlace;
    }

    this.#addShip(shipToPlace);

    return true;
  }

  #placeHorizontally(shipToPlace, x, y) {
    for (let i = y; i < y + shipToPlace.length; i++) {
      if (this.board[x][i].ship) return false;
    }

    for (let i = y; i < y + shipToPlace.length; i++) {
      this.board[x][i].ship = shipToPlace;
    }

    this.#addShip(shipToPlace);

    return true;
  }

  placeShip(length, x, y) {
    if (!this.#withinBoard) return false;

    const newShip = new Ship(length);

    if (this.placementDirection === "vertical") {
      return this.#placeVertically(newShip, x, y);
    } else if (this.placementDirection === "horizontal") {
      return this.#placeHorizontally(newShip, x, y);
    }

    return false; //invalid direction
  }

  populateWithDefaultShips() {
    this.placeShip(2, 3, 0);
    this.placeShip(3, 3, 7);
    this.togglePlacementDirection();
    this.placeShip(2, 1, 0);
    this.placeShip(3, 9, 0);
    this.placeShip(4, 9, 4);
    this.placeShip(2, 0, 5);
    this.togglePlacementDirection();
    this.placeShip(1, 7, 0);
    this.placeShip(1, 3, 2);
    this.placeShip(1, 7, 4);
    this.placeShip(1, 5, 5);
  }

  #handleShipHit(boardSquare) {
    return boardSquare.ship.hit();
  }

  #handleMiss(squareCoordinates) {
    this.missedAttacks.push(squareCoordinates);
    return "Missed";
  }

  receiveAttack(x, y) {
    const boardSquare = this.board[x][y];

    if (boardSquare.isHit) return false;

    boardSquare.isHit = true;

    if (!boardSquare.ship) return this.#handleMiss([x, y]);

    return this.#handleShipHit(boardSquare);
  }

  allShipsSunk() {
    return this.ships.every((shipData) => shipData.isSunk);
  }
}

class BoardSquare {
  constructor() {
    this.ship = null;
    this.isHit = false;
  }
}
