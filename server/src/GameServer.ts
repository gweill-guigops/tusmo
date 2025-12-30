import { MD5 } from 'object-hash';
import { Namespace } from 'socket.io';

import { Client } from './Client';
import { Game, GameImpl } from './Game';
import { GameConfiguration } from './GameConfiguration';
import { ClientPlay } from './ClientPlay';

const warmup = 1000 * 20;

export class GameServer {
  public readonly id: string;
  configuration: GameConfiguration;
  private game: Game;
  private clients: Map<string, Client> = new Map();
  private clientStates: Map<string, ClientPlay> = new Map();

  private _hasStarted = false;
  private _hasPrestarted = false;
  private startedAt: number | null = null;
  private _hash: string | null = null;
  public readonly startAt: number;
  public readonly createdAt: number;

  constructor(id: string, createdAt: number) {
    console.log('Game.create');
    this.id = id;
    this.createdAt = createdAt;
    this.startAt = createdAt + warmup;
    this.configuration = {
      attempts: 7,
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
    this._hasPrestarted = true;

    if (this.getClients().size === 0) {
      return;
    }

    console.info('Game.prestart', this.id);

    const clients = this.getClients().entries();
    for (const [clientID, client] of clients) {
      const clientState = new ClientPlay(clientID, client.username);
      this.clientStates.set(clientID, clientState);

      const ws = client.getWs();

      ws.leave('join-lobby');
      ws.leave('lobby');

      const onSubmit = (attempt) => this.game.submit(clientState, client, attempt.toLowerCase());
      const onQuit = () => {
        ws.leave(this.getRoom());
        ws.off('submit', onSubmit);
        this.clients.delete(clientID);
      };

      ws.on('submit', onSubmit);
      ws.once('quit-game', onQuit);
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
      const word = this.game.firstWord();
      client.getWs().emit('word-info', {
        initial: word.charAt(0),
        size: word.length,
      });
    }

    setInterval(() => {
      const players = Array.from(this.clientStates.values()).map((clientState) =>
        clientState.getTurnSumary(),
      );
      const newHash = MD5(players);
      if (this._hash == null || newHash != this._hash) {
        this._hash = newHash;
        ns.to(this.getRoom()).emit('players', players);
      }
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
