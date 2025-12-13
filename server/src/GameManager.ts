import { Namespace } from 'socket.io';
import { GameServer } from './GameServer';
import { generateID } from './utils';
import { Client } from './Client';

type Room = {
  id: string;
  gameServer: GameServer;
};

export class GameManager {
  gameServers: Map<String, GameServer> = new Map();
  ns: Namespace;

  constructor(ns: Namespace) {
    this.ns = ns;
  }

  createGameServer(): Room {
    const gameId = generateID();
    const gameServer = new GameServer(gameId, Date.now());
    return {
      id: gameId,
      gameServer: gameServer,
    };
  }

  getRoom(roomID: string) {
    if (roomID.startsWith('game-')) {
      return this.gameServers.get(roomID.substring('game-'.length));
    }
  }

  getLobby(): GameServer {
    for (const gameServer of this.gameServers.values()) {
      if (gameServer.phase() === 'LOBBY') {
        return gameServer;
      }
    }
    const room = this.createGameServer();
    this.gameServers.set(room.id, room.gameServer);
    return room.gameServer;
  }

  joinLobby(clientID: string, player: Client) {
    const lobby = this.getLobby();
    lobby.addClient(clientID, player);
    console.log('gm.joinLobby', `Utilisateur ${clientID} rejoind la salle ${lobby.getRoom()}`);
  }

  quitLobby(clientID: string) {
    const lobby = this.getLobby();
    lobby.removeClient(clientID);
    console.log('gm.quitLobby', `Utilisateur ${clientID} quitte la salle ${lobby.getRoom()}`);
  }

  tick() {
    const actives: Map<String, GameServer> = new Map();
    console.info('gm.tick', 'gameServers #', this.gameServers.size);
    for (const [id, gameServer] of this.gameServers) {
      const phase = gameServer.phase();
      console.info('gm.tick', { id, phase, clients: gameServer.getClients().size });
      if (phase === 'FINISHED') {
        gameServer.end();
      } else {
        actives.set(id, gameServer);
        if (phase === 'ACTIVE') {
          if (!gameServer.hasPrestarted()) {
            gameServer.prestart(this.ns);
          }
        }
      }
    }
    this.gameServers = actives;
  }
}
