import { Ship } from "./ship.js";

export class GameBoard {
  constructor() {
    this.board = this.#generateNewBoard();

    this.placementDirection = "vertical";

    this.missedAttacks = [];

    this.shipDataList = [];
  }

  #generateNewBoard() {
    return Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => new BoardSquare())
    );
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
      return x < 10 && y < 10 && x + (length - 1) < 10;

    if (this.placementDirection === "horizontal")
      return x < 10 && y < 10 && y + (length - 1) < 10;
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

  #generateRandomPlacements(length) {
    const directionsArray = ["vertical", "horizontal"];

    const coordinates = this.#generateRandomCoordinatesArray();

    let validPlacementsArray = [];

    while (validPlacementsArray.length < 11 && coordinates.length) {
      this.placementDirection = directionsArray[Math.floor(Math.random() * 2)];

      const currentElement = coordinates.shift();

      if (this.#withinBoard(length, currentElement[0], currentElement[1])) {
        validPlacementsArray.push({
          currentElement,
          direction: this.placementDirection,
        });
      }
    }

    return validPlacementsArray;
  }

  #placeShipRandomly(length) {
    let validPlacementsArray = this.#generateRandomPlacements(length);
    let placementSuccess = false;

    while (!placementSuccess) {
      if (!validPlacementsArray.length)
        validPlacementsArray = this.#generateRandomPlacements(length);

      const { direction, currentElement: coordinates } =
        validPlacementsArray.shift();
      this.placementDirection = direction;

      placementSuccess = this.placeShip(length, coordinates[0], coordinates[1]);
    }

    return placementSuccess;
  }

  populateWithRandomShips() {
    this.#placeShipRandomly(4);
    this.#placeShipRandomly(3);
    this.#placeShipRandomly(2);
    this.#placeShipRandomly(2);
    this.#placeShipRandomly(1);
    this.#placeShipRandomly(1);
    this.#placeShipRandomly(1);
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

  #generateRandomCoordinatesArray() {
    const randomCoordinatesArray = [];

    for (let i = 0; i <= 10; i++) {
      randomCoordinatesArray.push(this.#generateRandomCoordinates());
    }

    return randomCoordinatesArray;
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
    const randomAttacks = this.#generateRandomCoordinatesArray();

    let currentElement = randomAttacks.shift();
    let previouslyAttacked = true;

    while (previouslyAttacked) {
      if (!randomAttacks.length)
        randomAttacks = this.#generateRandomCoordinatesArray();

      let currentElement = randomAttacks.shift();

      previouslyAttacked = this.#hasBeenAttacked(
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

  resetBoard() {
    this.board = this.#generateNewBoard();

    this.placementDirection = "vertical";

    this.missedAttacks = [];

    this.shipDataList = [];

    this.populateWithRandomShips();
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
board.resetBoard();
