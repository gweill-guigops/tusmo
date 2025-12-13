import { Manager, Socket } from 'socket.io-client';

let manager: Manager | undefined;
let socket: Socket | undefined;

export const useWebSocket = (host?: string, config = {}) => {
  if (socket === undefined) {
    manager = new Manager(host, config);

    socket = manager.socket('/');

    socket.on('connect', () => {
      console.log('connect');
    });
    socket.on('disconnect', () => {
      console.log('disconnect');
    });
    socket.on('ping', () => {
      console.log('ping');
    });
    const socketReactive = reactive(socket);
    return { socket: socketReactive };
  } else {
    const socketReactive = reactive(socket);
    return { socket: socketReactive };
  }
};

export const useNamespace = (namespace: string) => {
  if (manager === undefined) {
    throw new Error('Manager is not created yet');
  }
  const socket = manager.socket(namespace);

  socket.on('connect', () => {
    console.log('connect', socket.id);
  });
  socket.on('disconnect', () => {
    console.log('disconnect', socket.id);
  });
  socket.on('ping', () => {
    console.log('ping');
  });
  const socketReactive = reactive(socket);
  return { socket: socketReactive };
};
