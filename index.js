import { DomController } from "./src/controllers/dom-controller.js";
import { Human, Computer } from "./src/core/player.js";

const humanPlayer = new Human();
const computerPlayer = new Computer();
const domController = new DomController(humanPlayer, computerPlayer);

domController.initializeGame();
