import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '/';

export const useSocket = (user) => {
  const socket = useRef(null);

  useEffect(() => {
    if (!user) return;

    socket.current = io(SOCKET_URL, {
      pingTimeout: 60000,
    });

    socket.current.emit('setup', user);

    socket.current.on('connected', () => {
      console.log('Socket connected to server');
    });

    socket.current.on('message received', (newMessageReceived) => {
      // This will be handled in the component via event listeners on socket
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [user]);

  const joinChat = (chatId) => {
    if (socket.current) {
      socket.current.emit('join chat', chatId);
    }
  };

  const sendMessage = (newMessage) => {
    if (socket.current) {
      socket.current.emit('new message', newMessage);
    }
  };

  return { socket: socket.current, joinChat, sendMessage };
};
