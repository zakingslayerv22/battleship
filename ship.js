export class Ship {
  constructor(length, hits = 0, sunk = false) {
    this.length = length;
    this.hits = hits;
    this.sunk = sunk;
  }

  hit() {
    this.hits++;
    this.#updateSunkStatus();
    return "Hit!";
  }

  #updateSunkStatus() {
    this.sunk = this.length === this.hits;
  }
}
