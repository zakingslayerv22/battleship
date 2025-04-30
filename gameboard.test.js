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
});
