import { Game } from "./game.js";

export class DomController {
  constructor(humanPlayer, computerPlayer) {
    this.humanPlayer = humanPlayer;
    this.humanBoardContainer = this.#getBoardContainer("human");

    this.boardContainer = document.querySelector(".board-container");

    this.computerPlayer = computerPlayer;
    this.computerBoardContainer = this.#getBoardContainer("computer");

    this.announcementText =
      "Randomize ships' placements and/or click  on the Start Game button to start a new game.";

    this.announcementBoard = document.querySelector(".announcement-board");
    this.announcementBoard.textContent = this.announcementText;

    this.randomizeButton = document.querySelector(".randomize-ships");
    this.randomizeButton.addEventListener(
      "click",
      this.#handleRandomizeButtonClicks
    );

    this.startGameButton = document.querySelector(".start-game");
    this.startGameButton.addEventListener(
      "click",
      this.#handleStartButtonClicks
    );

    this.resetGameButton = document.querySelector(".reset-game");

    this.game = new Game(this.humanPlayer, this.computerPlayer);
  }

  #renderBoard(playerObject, boardContainer) {
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

  #renderShips(player, playerObject, className) {
    const allBoardCells = this.#getBoardCells(player, ".grid-item");

    const allShipsCoordinatesArray = this.#getAllShipCoordinates(playerObject);

    this.#applyClassToMatchingCells(
      allBoardCells,
      allShipsCoordinatesArray,
      className
    );
  }

  #renderMissedAttacks(player, playerObject) {
    const allBoardCells = this.#getBoardCells(player, ".grid-item");

    const allMissedAttacksCoordinates = playerObject.gameboard.missedAttacks;

    this.#applyClassToMatchingCells(
      allBoardCells,
      allMissedAttacksCoordinates,
      "missed-cell",
      "."
    );
  }

  #getHitShipsCoordinates(playerObject) {
    const hitShipsCoodinates = [];

    playerObject.gameboard.board.forEach((row) => {
      row.forEach((cell) => {
        if (cell.ship && cell.isHit)
          hitShipsCoodinates.push(cell.squareCoordinates);
      });
    });

    return hitShipsCoodinates;
  }

  #renderShipsHits(player, playerObject) {
    const allBoardCells = this.#getBoardCells(player, "[class$='ship']");

    const hitShipsCoordinatesArray = this.#getHitShipsCoordinates(playerObject);

    this.#applyClassToMatchingCells(
      allBoardCells,
      hitShipsCoordinatesArray,
      "hit-ship"
    );
  }

  #handleHumanBoardUpdate() {
    this.humanBoardContainer.textContent = "";
    this.#renderBoard(this.humanPlayer, this.humanBoardContainer);
    this.#renderShips("human", this.humanPlayer, "human-ship");
    this.#renderMissedAttacks("human", this.humanPlayer);
    this.#renderShipsHits("human", this.humanPlayer);
  }

  #handleComputerBoardUpdate() {
    // const computerBoardContainer = this.#getBoardContainer("computer");
    this.computerBoardContainer.textContent = "";
    this.#renderBoard(this.computerPlayer, this.computerBoardContainer);
    this.#renderShips("computer", this.computerPlayer, "computer-ship");
    this.#renderMissedAttacks("computer", this.computerPlayer);
    this.#renderShipsHits("computer", this.computerPlayer);
  }

  #toggleBoardState(boardToEnable, boardToDisable) {
    if (boardToEnable.classList.contains("disabled-board")) {
      boardToEnable.classList.remove("disabled-board");
      boardToDisable.classList.add("disabled-board");
    }
  }

  #updateBoardDisplay = (player) => {
    if (player === "human") this.#handleHumanBoardUpdate();
    if (player === "computer") this.#handleComputerBoardUpdate();

    // this.#renderBoard(playerObject, playerBoardContainer);
  };

  #handleBoardClicks = (event) => {
    let xCoordinate = event.target.dataset.x;
    let yCoordinate = event.target.dataset.y;

    if (!xCoordinate && !yCoordinate) return;

    const humanResult = this.game.playHumanMove(
      [+xCoordinate, +yCoordinate],
      this.#updateBoardDisplay
    );

    if (humanResult === "Human Wins") {
      this.announcementBoard.textContent = "";
      this.announcementBoard.textContent =
        "Human Wins!  Click on the Reset Game button to start a new game.";
    }

    if (humanResult === "Missed") {
      setTimeout(
        () =>
          this.#toggleBoardState(
            this.humanBoardContainer,
            this.computerBoardContainer
          ),
        100
      );

      setTimeout(() => {
        const computerResult = this.game.keepComputerAttacking(
          this.#updateBoardDisplay
        );
        if (computerResult === "Computer Wins") {
          //update the dom accordingly
          this.announcementBoard.textContent = "";
          this.announcementBoard.textContent = "Computer Wins!";
        }
      }, 2000);

      setTimeout(
        () =>
          this.#toggleBoardState(
            this.computerBoardContainer,
            this.humanBoardContainer
          ),
        6000
      );
    }
  };

  #startGame() {
    this.announcementBoard.textContent = "";
    this.announcementBoard.textContent = "Game in progress...";

    this.humanBoardContainer.classList.add("disabled-board");
    this.boardContainer.addEventListener("click", this.#handleBoardClicks);

    this.resetGameButton.addEventListener(
      "click",
      this.#handleResetButtonClicks
    );
  }

  initializeGame() {
    this.announcementBoard.textContent = "";
    this.announcementBoard.textContent = this.announcementText;

    this.humanPlayer.gameboard.resetBoard();
    this.#updateBoardDisplay("human");

    this.computerPlayer.gameboard.resetBoard();
    this.#updateBoardDisplay("computer");

    this.boardContainer.removeEventListener("click", this.#handleBoardClicks);

    this.resetGameButton.disabled = true;

    if (this.humanBoardContainer.classList.contains("disabled-board")) {
      this.humanBoardContainer.classList.remove("disabled-board");
    } else {
      this.computerBoardContainer.classList.remove("disabled-board");
    }
  }

  #handleRandomizeButtonClicks = () => {
    this.initializeGame();
    this.startGameButton.disabled = false;
  };

  #handleStartButtonClicks = (event) => {
    this.randomizeButton.disabled = true;
    event.target.disabled = true;
    this.resetGameButton.disabled = false;

    this.#startGame();
  };

  #handleResetButtonClicks = (event) => {
    this.initializeGame();

    event.target.disabled = true;
    this.randomizeButton.disabled = false;
    this.startGameButton.disabled = false;
  };
}
