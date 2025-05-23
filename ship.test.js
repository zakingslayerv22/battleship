import { Ship } from "./ship";

describe("ship's tests", () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(4, 0); // fresh Ship before every test
  });

  test("increase hits", () => {
    ship.hit();
    expect(ship.hits).toBe(1);
  });

  test("update sunk status", () => {
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();

    expect(ship.isSunk).toBe(true);
  });
});
