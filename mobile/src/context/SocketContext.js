import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../services/api';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected:', socketRef.current.id);
      setConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setConnected(false);
    });

    socketRef.current.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const joinExpertRoom = (expertId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join_expert', expertId);
    }
  };

  const leaveExpertRoom = (expertId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave_expert', expertId);
    }
  };

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, connected, joinExpertRoom, leaveExpertRoom }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
