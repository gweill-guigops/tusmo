import { createServer } from 'http';
import { Server } from 'socket.io';

import { GameManager } from './GameManager';
import { Client } from './Client';

import { loadAll } from './LoadDictionnary';

const httpServer = createServer();
const io = new Server(httpServer, {});

const ns = io.of('/');

const gm = new GameManager(ns);

setInterval(() => {
  gm.tick();
  if (ns.adapter.rooms.has('join-lobby')) {
    ns.to('join-lobby').emit('lobby', gm.getLobby().toString());
  }
}, 1000);

io.on('connection', (socket) => {
  const clientID = socket.id;
  console.log('Utilisateur connecté', clientID);

  socket.on('join-lobby', () => {
    socket.join('join-lobby');
  });

  socket.on('join-lobby-game', ({ persistentID, username }) => {
    gm.joinLobby(clientID, new Client(clientID, persistentID, username, socket));
    socket.join(gm.getLobby().getRoom());
  });

  socket.on('quit-lobby-game', () => {
    socket.leave(gm.getLobby().getRoom());
    gm.quitLobby(clientID);
  });

  socket.on('disconnecting', () => {
    console.debug('Utilisateur déconnecté', clientID, socket.rooms);
    for (const roomID of socket.rooms ?? []) {
      const room = gm.getRoom(roomID);
      if (room === undefined) {
        continue;
      }
      room.removeClient(clientID);
    }
  });
});

loadAll();

httpServer.listen(3001);
