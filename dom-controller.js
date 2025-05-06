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
}
