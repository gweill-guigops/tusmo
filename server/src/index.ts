import { createServer } from 'http';
import { Server } from 'socket.io';
import { GameManager } from './GameManager';
import { Client } from './Client';
import { loadAll } from './LoadDictionnary';

const httpServer = createServer();
const io = new Server(httpServer, {});

const ns = io.of('/');

const sids = ns.adapter.sids;

const gm = new GameManager(ns);

setInterval(() => {
  gm.tick();
  ns.to('landing').emit('lobby', gm.getLobby().toString());
}, 1000);

io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté');
  const clientID = socket.id;

  socket.join('landing');

  socket.on('join-lobby', ({ persistentID, username }) => {
    gm.joinLobby(clientID, new Client(clientID, persistentID, username, socket));
    socket.join(gm.getLobby().getRoom());
  });

  socket.on('quit-lobby', () => {
    socket.leave(gm.getLobby().getRoom());
    gm.quitLobby(clientID);
  });

  socket.on('disconnect', () => {
    console.debug('disconnect', clientID, sids);
    for (const roomID of sids.get(clientID) ?? []) {
      const room = gm.getRoom(roomID);
      if (room === undefined) {
        continue;
      }
      room.removeClient(clientID);
    }

    console.log('Utilisateur déconnecté');
  });
});

loadAll();

httpServer.listen(3001);
