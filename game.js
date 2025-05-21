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

  playMove(x, y, handleBoardUpdate) {
    let currentPlayer = this.#getCurrentPlayer();

    let result = currentPlayer.gameboard.launchHumanAttack(
      this.computerPlayer,
      [x, y]
    );

    if (result) {
      handleBoardUpdate("computer");

      this.#switchPlayerTurn();

      currentPlayer = this.#getCurrentPlayer();

      result = currentPlayer.gameboard.launchComputerAttack(this.humanPlayer);

      if (result) {
        handleBoardUpdate("human");
      }
    }
  }
}

// const game = new Game();

// console.log(game.getCurrentPlayer());
