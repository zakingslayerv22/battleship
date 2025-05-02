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
      sunk: false,
    });
  });

  test("place ship of length > 1 vertically", () => {
    gameboard.placeShip(4, 2, 1);

    expect(gameboard.board[2][1].ship && gameboard.board[5][1].ship).toEqual({
      length: 4,
      hits: 0,
      sunk: false,
    });
  });

  test("place ship of length > 1 horizontally", () => {
    gameboard.togglePlacementDirection();

    gameboard.placeShip(4, 2, 1);

    expect(gameboard.board[2][1].ship && gameboard.board[2][4].ship).toEqual({
      length: 4,
      hits: 0,
      sunk: false,
    });
  });
});
