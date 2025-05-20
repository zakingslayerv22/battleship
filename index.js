import { DomController } from "./dom-controller.js";
import { Human, Computer } from "./player.js";

const domController = new DomController();
const humanPlayer = new Human();
const computerPlayer = new Computer();

const humanBoardContainer = document.querySelector(".human-board");
const computerBoardContainer = document.querySelector(".computer-board");

//render boards
domController.renderBoard(humanPlayer, humanBoardContainer);
domController.renderBoard(computerPlayer, computerBoardContainer);

//populate with ships
humanPlayer.gameboard.populateWithDefaultShips();
computerPlayer.gameboard.populateWithDefaultShips();

//render ships
console.log(domController.renderShips("human", humanPlayer, "human-ship"));
console.log(
  domController.renderShips("computer", computerPlayer, "computer-ship")
);

//launch attacks
console.log(computerPlayer.gameboard.launchComputerAttack(humanPlayer));
console.log(humanPlayer.gameboard.receiveAttack(9, 6));
console.log(humanPlayer.gameboard.receiveAttack(9, 7));
console.log(humanPlayer.gameboard.launchHumanAttack(computerPlayer, [0, 0]));

//render missed attacks
domController.renderMissedAttacks("human", humanPlayer);
domController.renderMissedAttacks("computer", computerPlayer);

//render ship hits
domController.renderShipsHits("human", humanPlayer);
domController.renderShipsHits("computer", computerPlayer);
