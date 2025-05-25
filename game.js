export class Game {
  constructor(humanPlayer, computerPlayer) {
    this.humanPlayer = humanPlayer;
    this.computerPlayer = computerPlayer;

    // this.playersArray = [humanPlayer, computerPlayer];
    this.currentPlayer = this.humanPlayer;
  }

  #getCurrentPlayer() {
    return this.currentPlayer;
  }

  #switchPlayerTurn() {
    this.currentPlayer =
      this.currentPlayer === this.humanPlayer
        ? this.computerPlayer
        : this.humanPlayer;
  }

  playMove([x, y], handleBoardUpdate) {
    //initial check
    if (this.checkAllShipsSunk(this.humanPlayer, this.computerPlayer)) {
     return;
    }

    //play
    let result = this.#getCurrentPlayer().gameboard.launchHumanAttack(
      this.computerPlayer,
      [x, y]
    );

    if (result) {
      console.log("Human played", result);
      handleBoardUpdate("computer");

      //check after human attack
      if (this.checkAllShipsSunk(this.humanPlayer, this.computerPlayer)) {
        return;
      }

      this.#switchPlayerTurn();

      result = this.#getCurrentPlayer().gameboard.launchComputerAttack(
        this.humanPlayer
      );

      if (result) {
        handleBoardUpdate("human");

        //check after computer attack
        if (this.checkAllShipsSunk(this.humanPlayer, this.computerPlayer)) {
          return;
        }
      }
    }
  }

  checkAllShipsSunk(humanPlayerObject, computerPlayerObject) {
    return (
      humanPlayerObject.gameboard.allShipsSunk() ||
      computerPlayerObject.gameboard.allShipsSunk()
    );
  }
}

// const game = new Game();

// console.log(game.getCurrentPlayer());
