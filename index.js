import { DomController } from "./dom-controller.js";
import { Human, Computer } from "./player.js";

const humanPlayer = new Human();
const computerPlayer = new Computer();
const domController = new DomController(humanPlayer, computerPlayer);

domController.initializeGame();
