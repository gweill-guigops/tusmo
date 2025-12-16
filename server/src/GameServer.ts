import { Namespace } from 'socket.io';
import { Client, ClientPlay } from './Client';
import { GameConfiguration } from './GameConfiguration';
import { Game, GameImpl } from './Game';

const warmup = 1000 * 10;

export class GameServer {
  public readonly id: string;
  configuration: GameConfiguration;
  private game: Game;
  private clients: Map<string, Client> = new Map();
  private clientStates: Map<string, ClientPlay> = new Map();

  private _hasStarted = false;
  private _hasPrestarted = false;
  private startedAt: number | null = null;
  public readonly startAt: number;
  public readonly createdAt: number;

  constructor(id: string, createdAt: number) {
    console.log('Game.create');
    this.id = id;
    this.createdAt = createdAt;
    this.startAt = createdAt + warmup;
    this.configuration = {
      attempts: 8,
      words: 4,
    };
  }

  getClients() {
    return this.clients;
  }

  addClient(clientID: string, client: Client) {
    this.clients.set(clientID, client);
  }

  removeClient(clientID: string) {
    this.clients.delete(clientID);
  }

  phase() {
    const now = Date.now();

    if (this._hasPrestarted) {
      if (this.clients.size === 0) {
        return 'FINISHED';
      }
      return 'ACTIVE';
    } else {
      if (now - this.createdAt < warmup) {
        return 'LOBBY';
      }
      return 'ACTIVE';
    }
  }

  hasPrestarted(): Boolean {
    return this._hasPrestarted;
  }

  async prestart(ns: Namespace) {
    console.info('Game.prestart', this.id);
    this._hasPrestarted = true;

    if (this.getClients().size === 0) {
      return;
    }

    const clients = this.getClients().entries();
    for (const [clientID, client] of clients) {
      const clientState = new ClientPlay(clientID);
      this.clientStates.set(clientID, clientState);

      const ws = client.getWs();

      ws.leave('join-lobby');
      ws.leave('lobby');
      ws.on('submit', (attempt) => this.game.submit(clientState, client, attempt.toLowerCase()));
    }

    this.game = new GameImpl(this.configuration);

    ns.to(this.getRoom()).emit('prestart', this.id);
    await this.game.init();

    setTimeout(() => {
      this.start(ns);
    }, 1000);
  }

  hasStarted(): Boolean {
    return this._hasStarted;
  }

  start(ns: Namespace) {
    console.info('Game.start', this.id);
    this._hasStarted = true;
    this.startedAt = Date.now();

    ns.to(this.getRoom()).emit('start', this.configuration, this.startedAt);

    for (const [clientID, client] of this.clients) {
      this.game.words[0];
      client.getWs().emit('word-info', {
        initial: this.game.words[0].charAt(0),
        size: this.game.words[0].length,
      });
    }

    setInterval(() => {
      // ns.to(this.getRoom()).emit(
      //   'leaderboard',
      //   Array.from(this.clientStates.values()).map((clientState) => clientState.getCurrentTurn()),
      // );
    }, 1000);
  }

  end() {
    for (const client of this.clients.values()) {
      client.getWs().leave(this.getRoom());
    }
    console.info('Game is finished');
  }

  getRoom() {
    return `game-${this.id}`;
  }

  toString() {
    return {
      clients: [...this.clients.values()],
      _hasStarted: this._hasStarted,
      _hasPrestarted: this._hasPrestarted,
      _startTime: this.startedAt,
      id: this.id,
      createdAt: this.createdAt,
      startAt: this.startAt,
    };
  }
}
