import { Socket } from 'socket.io';

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
