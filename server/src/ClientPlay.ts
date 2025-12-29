import { Guess } from './Guess';

export class Turn {
  guesses: Guess[];
  constructor() {
    this.guesses = [];
  }

  addGuess(guess: Guess) {
    this.guesses.push(guess);
  }
  getGuessesSize() {
    return this.guesses.length;
  }
}

export class ClientPlay {
  public readonly clientID: string;
  public readonly username: string;
  public turns: Turn[] = [];
  public endedAt: number;
  public isWon: boolean;
  constructor(clientID, username) {
    this.clientID = clientID;
    this.username = username;
    this.isWon = false;
    this.addTurn();
  }

  addTurn() {
    this.turns.push(new Turn());
  }

  getCurrentTurn(): Turn {
    return this.turns[this.turns.length - 1];
  }

  getTurnsSize(): number {
    return this.turns.length;
  }

  getTurnSumary() {
    return [
      this.username,
      this.turns.map((t) => t.guesses.map((g) => g.validation)),
      this.endedAt,
      this.isWon,
    ];
  }
}
