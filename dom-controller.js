import { Game } from "./game.js";

export class DomController {
  constructor(humanPlayer, computerPlayer) {
    this.humanPlayer = humanPlayer;
    this.computerPlayer = computerPlayer;
    this.game = new Game(this.humanPlayer, this.computerPlayer);
  }

  renderBoard(playerObject, boardContainer) {
    playerObject.gameboard.board.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        const gridCell = document.createElement("div");
        gridCell.classList.add("grid-item");
        gridCell.dataset.x = rowIndex;
        gridCell.dataset.y = colIndex;
        boardContainer.append(gridCell);
      });
    });
  }

  #getBoardContainer(player) {
    return document.querySelector(`.${player}-board`);
  }

  #getBoardCells(player, keyword) {
    const boardContainer = this.#getBoardContainer(player);
    return boardContainer.querySelectorAll(keyword);
  }

  #getAllShipCoordinates(playerObject) {
    const coordinates = [];
    playerObject.gameboard.shipDataList.forEach((ship) => {
      coordinates.push(ship.coordinates);
    });

    return coordinates.flat();
  }

  #getCellCoordinates(cell) {
    return [+cell.dataset.x, +cell.dataset.y];
  }

  #applyClassToMatchingCells(
    cellsArray,
    coordinatesArray,
    className,
    text = ""
  ) {
    coordinatesArray.forEach((coordinate) => {
      cellsArray.forEach((cell) => {
        const cellCoordinates = this.#getCellCoordinates(cell);

        if (
          coordinate[0] === cellCoordinates[0] &&
          coordinate[1] === cellCoordinates[1]
        ) {
          cell.classList.add(className);
          cell.textContent = text;
        }
      });
    });
  }

  renderShips(player, playerObject, className) {
    const allBoardCells = this.#getBoardCells(player, ".grid-item");

    const allShipsCoordinatesArray = this.#getAllShipCoordinates(playerObject);

    this.#applyClassToMatchingCells(
      allBoardCells,
      allShipsCoordinatesArray,
      className
    );
  }

  renderMissedAttacks(player, playerObject) {
    const allBoardCells = this.#getBoardCells(player, ".grid-item");

    const allMissedAttacksCoordinates = playerObject.gameboard.missedAttacks;

    this.#applyClassToMatchingCells(
      allBoardCells,
      allMissedAttacksCoordinates,
      "missed-cell",
      "."
    );
  }

  getHitShipsCoordinates(playerObject) {
    const hitShipsCoodinates = [];

    playerObject.gameboard.board.forEach((row) => {
      row.forEach((cell) => {
        if (cell.ship && cell.isHit)
          hitShipsCoodinates.push(cell.squareCoordinates);
      });
    });

    return hitShipsCoodinates;
  }

  renderShipsHits(player, playerObject) {
    const allBoardCells = this.#getBoardCells(player, "[class$='ship']");

    const hitShipsCoordinatesArray = this.getHitShipsCoordinates(playerObject);

    this.#applyClassToMatchingCells(
      allBoardCells,
      hitShipsCoordinatesArray,
      "hit-ship"
    );
  }

  #updateBoardDisplay = (player) => {
    console.log(player);
  };

  handleBoardClicks = (event) => {
    const selectedRow = event.target.dataset.x;
    const selectedColumn = event.target.dataset.y;

    if (!selectedRow && !selectedColumn) return;

    this.game.playMove(
      [+selectedRow, +selectedColumn],
      this.#updateBoardDisplay
    );
    //then play game
  };
}
