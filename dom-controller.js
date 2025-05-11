export class DomController {
  renderBoard(player, boardContainer) {
    player.gameboard.board.forEach((row, rowIndex) => {
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

  #applyClassToMatchingCells(cellsArray, coordinatesArray, className) {
    coordinatesArray.forEach((coordinate) => {
      cellsArray.forEach((cell) => {
        const cellCoordinates = this.#getCellCoordinates(cell);

        if (
          coordinate[0] === cellCoordinates[0] &&
          coordinate[1] === cellCoordinates[1]
        ) {
          cell.classList.add(className);
        }
      });
    });
  }

  renderShips(player, playerObject) {
    const boardContainer = this.#getBoardContainer(player);
    const allBoardCells = boardContainer.querySelectorAll(".grid-item");

    const allShipsCoordinatesArray = this.#getAllShipCoordinates(playerObject);

    this.#applyClassToMatchingCells(
      allBoardCells,
      allShipsCoordinatesArray,
      "ship"
    );
  }
}
