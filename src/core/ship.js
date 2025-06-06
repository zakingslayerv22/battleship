export class Ship {
  constructor(length, hits = 0, isSunk = false) {
    this.length = length;
    this.hits = hits;
    this.isSunk = isSunk;
  }

  hit() {
    this.hits++;
    this.#updateSunkStatus();
    return "Hit!";
  }

  #updateSunkStatus() {
    this.isSunk = this.length === this.hits;
  }
}
