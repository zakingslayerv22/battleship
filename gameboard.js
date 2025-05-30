import { Ship } from "./ship.js";

export class GameBoard {
  constructor() {
    this.board = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => new BoardSquare())
    );

    this.placementDirection = "vertical";

    this.missedAttacks = [];

    this.shipDataList = [];
  }

  togglePlacementDirection() {
    return (this.placementDirection =
      this.placementDirection === "vertical" ? "horizontal" : "vertical");
  }

  #storeShipData(shipData) {
    this.shipDataList.push(shipData);
  }

  #withinBoard(length, x, y) {
    if (!this.placementDirection) return false;

    if (this.placementDirection === "vertical") 
      return (x < 10 && y < 10 && (x + (length - 1) < 10));

    if (this.placementDirection === "horizontal") 
      return (x < 10 && y < 10 && (y + (length - 1) < 10));
  }

  #placeVertically(shipToPlace, x, y) {
    for (let i = x; i < x + shipToPlace.length; i++) {
      if (this.board[i][y].ship) return false;
    }

    const coordinates = [];
    for (let i = x; i < x + shipToPlace.length; i++) {
      this.board[i][y].ship = shipToPlace;
      this.board[i][y].squareCoordinates = [i, y];
      coordinates.push([i, y]);
    }

    this.#storeShipData({ shipToPlace, coordinates });

    return true;
  }

  #placeHorizontally(shipToPlace, x, y) {
    for (let i = y; i < y + shipToPlace.length; i++) {
      if (this.board[x][i].ship) return false;
    }

    const coordinates = [];
    for (let i = y; i < y + shipToPlace.length; i++) {
      this.board[x][i].ship = shipToPlace;
      this.board[x][i].squareCoordinates = [x, i];
      coordinates.push([x, i]);
    }

    this.#storeShipData({ shipToPlace, coordinates });

    return true;
  }

  placeShip(length, x, y) {
    if (!this.#withinBoard(length, x, y)) return false;

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

  #generateRandomCoordinates() {
    return [
      Math.floor(Math.random() * 9) + 1,
      Math.floor(Math.random() * 9) + 1,
    ];
  }

  #generateRandomAttacksArray() {
    const randomAttacksArray = [];

    for (let i = 0; i <= 105; i++) {
      randomAttacksArray.push(this.#generateRandomCoordinates());
    }

    return randomAttacksArray;
  }

  #hasBeenAttacked(cellCoordinates, attackedCoordinatesArray) {
    //Should consider performing the check
    //only when the attackedCoordinatesArray
    //is empty but that would be redundant
    //because array.some() always
    //returns false for an empty array.
    return attackedCoordinatesArray.some(
      (attackedCoordinate) =>
        cellCoordinates[0] === attackedCoordinate[0] &&
        cellCoordinates[1] === attackedCoordinate[1]
    );
  }

  #getNextComputerAttack() {
    const randomAttacks = this.#generateRandomAttacksArray();

    let currentElement = randomAttacks.shift();
    let previouslyAttacked = this.#hasBeenAttacked(
      currentElement,
      this.missedAttacks
    );

    while (previouslyAttacked && randomAttacks.length) {
      currentElement = randomAttacks.shift();
      previouslyAttacked = this.hasBeenAttacked(
        currentElement,
        this.missedAttacks
      );
    }

    return currentElement;
  }

  launchComputerAttack(playerObject) {
    const coordinates = this.#getNextComputerAttack();
    console.log(coordinates);
    return playerObject.gameboard.receiveAttack(coordinates[0], coordinates[1]);
  }

  launchHumanAttack(playerObject, coordinates) {
    return playerObject.gameboard.receiveAttack(coordinates[0], coordinates[1]);
  }

  allShipsSunk() {
    return this.shipDataList.every((shipData) => shipData.shipToPlace.isSunk);
  }
}

class BoardSquare {
  constructor() {
    this.ship = null;
    this.isHit = false;
    this.squareCoordinates;
  }
}

let board = new GameBoard();
