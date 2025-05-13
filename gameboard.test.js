import { GameBoard } from "./gameboard";

describe("test gameboard", () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new GameBoard(); // fresh GameBoard before every test
  });

  test("place ship on coordinates", () => {
    gameboard.placeShip(4, 0, 0);

    expect(gameboard.board[0][0].ship).toEqual({
      length: 4,
      hits: 0,
      isSunk: false,
    });
  });

  test("place ship of length > 1 vertically", () => {
    gameboard.placeShip(4, 2, 1);

    expect(gameboard.board[2][1].ship && gameboard.board[5][1].ship).toEqual({
      length: 4,
      hits: 0,
      isSunk: false,
    });

    expect(gameboard.shipDataList[0].coordinates).toContainEqual([2, 1]);
  });

  test("place ship of length > 1 horizontally", () => {
    gameboard.togglePlacementDirection();

    gameboard.placeShip(4, 2, 1);

    expect(gameboard.board[2][1].ship && gameboard.board[2][4].ship).toEqual({
      length: 4,
      hits: 0,
      isSunk: false,
    });

    expect(gameboard.shipDataList[0].coordinates).toContainEqual([2, 1]);
  });

  test("receive attack", () => {
    gameboard.placeShip(4, 1, 1);

    gameboard.receiveAttack(1, 1);

    expect(gameboard.board[1][1].isHit).toBe(true);
  });

  test("record missed attack", () => {
    gameboard.placeShip(4, 1, 1);

    gameboard.receiveAttack(1, 2);

    expect(gameboard.missedAttacks).toContainEqual([1, 2]);
  });

  test("report all ships sunk status", () => {
    gameboard.placeShip(2, 1, 1);
    gameboard.receiveAttack(1, 1);
    gameboard.receiveAttack(2, 1);

    expect(gameboard.allShipsSunk()).toBe(true);
  });

  describe("populate gameboard with ships", () => {
    beforeEach(() => {
      gameboard.populateWithDefaultShips();
    });

    test("places correct number of ships", () => {
      const occupiedCells = gameboard.board.flat().filter((cell) => cell.ship);
      // total occupied cells (based on placed ships' lengths)
      const totalExpectedLengths = 20;
      expect(occupiedCells.length).toBe(totalExpectedLengths);
    });

    test("places ship at specific locations", () => {
      //vertically placed
      expect(gameboard.board[3][0] && gameboard.board[3][4]).toBeDefined();
      //horizontally placed
      expect(gameboard.board[1][0] && gameboard.board[1][1]).toBeDefined();

      expect(gameboard.board[1][0].ship.length).toBe(2);
    });
  });

  describe("launchComputerAttack", () => {
    test("launchComputerAttack calls receiveAttack with correct coordinates and returns result", () => {
      const mockCoordinates = [3, 5];
      const mockReceiveAttack = jest.fn().mockReturnValue("Hit!");

      const playerObject = {
        gameboard: {
          receiveAttack: mockReceiveAttack,
        },
      };

      class Computer {
        getNextComputerAttack = jest.fn().mockReturnValue(mockCoordinates);

        launchComputerAttack(playerObject) {
          const coordinates = this.getNextComputerAttack();
          return playerObject.gameboard.receiveAttack(
            coordinates[0],
            coordinates[1]
          );
        }
      }

      const computerPlayer = new Computer();

      const result = computerPlayer.launchComputerAttack(playerObject);

      expect(computerPlayer.getNextComputerAttack).toHaveBeenCalled();

      expect(mockReceiveAttack).toHaveBeenCalledWith(3, 5);

      expect(result).toBe("Hit!");
    });
  });
});
