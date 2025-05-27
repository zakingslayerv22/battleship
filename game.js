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

  playHumanMove([x, y], handleBoardUpdate) {
    //check before attack
    if(this.computerPlayer.gameboard.allShipsSunk()) return "Human Wins"

    const result = this.humanPlayer.gameboard.launchHumanAttack(this.computerPlayer, [x, y])

    if (result) {
      console.log("Human played", result);
      handleBoardUpdate("computer");

      //check after attack
      if(this.computerPlayer.gameboard.allShipsSunk()) return "Human Wins";
    }

    return result

  }
  
  keepComputerAttacking(handleBoardUpdate) {
    //check before attack
    if(this.humanPlayer.gameboard.allShipsSunk()) return "Computer Wins";
    
    const result = this.computerPlayer.gameboard.launchComputerAttack(this.humanPlayer);
    handleBoardUpdate("human");
    
    //check after attack
    
    if(this.humanPlayer.gameboard.allShipsSunk()) return "Computer Wins";

    if (result !== "Missed") {
      setTimeout(() => this.keepComputerAttacking(handleBoardUpdate), 2000);
    }

    return result
  }

}

// const game = new Game();

// console.log(game.getCurrentPlayer());
