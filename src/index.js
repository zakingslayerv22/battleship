import { DomController } from "./controllers/dom-controller.js";
import { Human, Computer } from "./core/player.js";

const humanPlayer = new Human();
const computerPlayer = new Computer();
const domController = new DomController(humanPlayer, computerPlayer);

domController.initializeGame();
