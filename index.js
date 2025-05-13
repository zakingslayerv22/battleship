import { DomController } from "./dom-controller.js";
import { Human, Computer } from "./player.js";

const domController = new DomController();
const humanPlayer = new Human();
const computerPlayer = new Computer();

const humanBoardContainer = document.querySelector(".human-board");
const computerBoardContainer = document.querySelector(".computer-board");

domController.renderBoard(humanPlayer, humanBoardContainer);
domController.renderBoard(computerPlayer, computerBoardContainer);

humanPlayer.gameboard.populateWithDefaultShips();
computerPlayer.gameboard.populateWithDefaultShips();

console.log(domController.renderShips("human", humanPlayer));

console.log(computerPlayer.gameboard.launchComputerAttack(humanPlayer));
