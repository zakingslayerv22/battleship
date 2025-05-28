import { Game } from "./game";

describe("test game logic", () => {
  let newGame;

  const mockHumanAttack = jest.fn().mockReturnValue("Hit");
  const mockComputerAttack = jest.fn()
    .mockReturnValueOnce("Hit")
    .mockReturnValueOnce("Missed");
  const mockUpdateBoard = jest.fn();
  const humanShipsSunk = jest.fn().mockReturnValue(false)
  const computerShipsSunk = jest.fn().mockReturnValue(false)

  const humanPlayer = {
    gameboard: {
      launchHumanAttack: mockHumanAttack,
      allShipsSunk : humanShipsSunk
      
    },
  };

  const computerPlayer = {
    gameboard: {
      launchComputerAttack: mockComputerAttack,
      allShipsSunk : computerShipsSunk
    },
  };

  beforeEach(() => {
    jest.clearAllMocks(); // reset call history before each test
    newGame = new Game(humanPlayer, computerPlayer); // fresh Gamebefore every test
    humanShipsSunk.mockReturnValue(false);
    computerShipsSunk.mockReturnValue(false)
  });
  
  describe("test human move", () => {
    test("launches human attacks and calls the updateBoard callback correctly", () => {
      newGame.playHumanMove([3, 5], mockUpdateBoard);
  
      // 1. Check human attack called with correct args
      expect(mockHumanAttack).toHaveBeenCalledWith(computerPlayer, [3, 5]);
  
      // 2. Check order and args of update board
      expect(mockUpdateBoard).toHaveBeenNthCalledWith(1, "computer");
  
    });
  
    test("returns if computer ships are sunk before move", () => {
      computerShipsSunk.mockReturnValue(true);
  
      const result = newGame.playHumanMove([3, 5], mockUpdateBoard);
  
      expect(mockHumanAttack).not.toHaveBeenCalled()
      expect(result).toBe("Human Wins")
    })
  
    test("returns if computer ships are sunk after move", () => {

      newGame.playHumanMove([3, 5], mockUpdateBoard);
      computerShipsSunk.mockReturnValue(true);
      const result = newGame.playHumanMove([3, 7], mockUpdateBoard);
  
  
      expect(mockHumanAttack).toHaveBeenCalledTimes(1)
      expect(result).toBe("Human Wins")
    })
  })

  describe("test computer moves", () => {

 

    test("launches computer attacks and calls the updateBoard callback correctly", () => {
      jest.useFakeTimers(); //pause real timers

      newGame.keepComputerAttacking(mockUpdateBoard);
  
      // 1. Check computer attack called with correct args
      expect(mockComputerAttack).toHaveBeenCalledWith(humanPlayer);
  
      // 2. Check order and args of update board
      expect(mockUpdateBoard).toHaveBeenNthCalledWith(1, "human");
    });
    

    test("returns if human ships are sunk before move", () => {
      humanShipsSunk.mockReturnValue(true);
  
      const result = newGame.keepComputerAttacking(mockUpdateBoard);
  
      expect(mockHumanAttack).not.toHaveBeenCalled()
      expect(result).toBe("Computer Wins")
    });
  
    test("returns if computer ships are sunk after move", () => {
      newGame.keepComputerAttacking(mockUpdateBoard);
      humanShipsSunk.mockReturnValue(true);
      const result = newGame.keepComputerAttacking(mockUpdateBoard);
  
  
      expect(mockComputerAttack).toHaveBeenCalledTimes(1)
      expect(result).toBe("Computer Wins")
    })

    test("keeps attacking if result is not missed", () => {

      jest.useFakeTimers(); //pause real timers

      newGame.keepComputerAttacking(mockUpdateBoard);
      
      //initial call
      expect(mockComputerAttack).toHaveBeenCalledTimes(1);
      expect(mockUpdateBoard).toHaveBeenCalledTimes(1);


      //after pausing real timers, 
      //setTimeout doesn’t run now unless you advanceTimersByTime.
      //fast-forward 2 seconds
      jest.advanceTimersByTime(2000); 

      //now second attack happens
      expect(mockComputerAttack).toHaveBeenCalledTimes(2);
      expect(mockUpdateBoard).toHaveBeenCalledTimes(2);

    })
  })

});
