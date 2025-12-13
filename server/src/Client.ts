import { Socket } from 'socket.io';
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
  public turns: Turn[] = [];
  constructor(clientID) {
    this.clientID = clientID;
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
}

export class Client {
  public lastPing: number = Date.now();
  public readonly clientID: string;
  public readonly persistentID: string;
  public readonly username: string;
  private readonly _ws: Socket;

  constructor(clientID: string, persistentID: string, username: string, ws: Socket) {
    this.clientID = clientID;
    this.persistentID = persistentID;
    this.username = username;
    this._ws = ws;
  }

  getWs() {
    return this._ws;
  }

  toJSON() {
    return {
      clientID: this.clientID,
      persistentID: this.persistentID,
      username: this.username,
    };
  }
}
