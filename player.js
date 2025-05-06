import { GameBoard } from "./gameboard.js";

export class Human {
  constructor() {
    this.gameboard = new GameBoard();
  }
}

export class Computer {
  constructor() {
    this.gameboard = new GameBoard();
  }
}
