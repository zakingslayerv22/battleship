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

  #handleHumanBoardUpdate() {
    const humanBoardContainer = this.#getBoardContainer("human");
    humanBoardContainer.textContent = "";
    this.renderBoard(this.humanPlayer, humanBoardContainer);
    this.renderShips("human", this.humanPlayer, "human-ship");
    this.renderMissedAttacks("human", this.humanPlayer);
    this.renderShipsHits("human", this.humanPlayer);
  }

  #handleComputerBoardUpdate() {
    const computerBoardContainer = this.#getBoardContainer("computer");
    computerBoardContainer.textContent = "";
    this.renderBoard(this.computerPlayer, computerBoardContainer);
    this.renderShips("computer", this.computerPlayer, "computer-ship");
    this.renderMissedAttacks("computer", this.computerPlayer);
    this.renderShipsHits("computer", this.computerPlayer);
  }

  #updateBoardDisplay = (player) => {
    if (player === "human") this.#handleHumanBoardUpdate();
    if (player === "computer") this.#handleComputerBoardUpdate();

    // this.renderBoard(playerObject, playerBoardContainer);
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
