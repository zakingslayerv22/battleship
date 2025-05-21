import { Game } from "./game";

describe("test game logic", () => {
  let newGame;

  const mockHumanAttack = jest.fn().mockReturnValue("Hit");
  const mockComputerAttack = jest.fn().mockReturnValue("Hit");
  const mockUpdateBoard = jest.fn();

  const humanPlayer = {
    gameboard: {
      launchHumanAttack: mockHumanAttack,
    },
  };

  const computerPlayer = {
    gameboard: {
      launchComputerAttack: mockComputerAttack,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks(); // reset call history before each test
    newGame = new Game(humanPlayer, computerPlayer, mockUpdateBoard); // fresh Gamebefore every test
  });

  test("launches human and computer attacks and calls the updateBoard callback correctly", () => {
    newGame.playMove([3, 5], mockUpdateBoard);

    // 1. Check human attack called with correct args
    expect(mockHumanAttack).toHaveBeenCalledWith(computerPlayer, [3, 5]);

    // 2. Check order and args of update board
    expect(mockUpdateBoard).toHaveBeenNthCalledWith(1, "computer");
    expect(mockUpdateBoard).toHaveBeenNthCalledWith(2, "human");

    // 3. Check computer attack called
    expect(mockComputerAttack).toHaveBeenCalledWith(humanPlayer);

    // 4. Check update board called twice
    expect(mockUpdateBoard).toHaveBeenCalledTimes(2);
  });
});
