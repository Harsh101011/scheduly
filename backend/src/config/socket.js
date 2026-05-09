const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Client joins expert-specific room to get real-time slot updates
    socket.on('join_expert', (expertId) => {
      socket.join(expertId);
      console.log(`  ↳ ${socket.id} joined room [expert:${expertId}]`);
    });

    socket.on('leave_expert', (expertId) => {
      socket.leave(expertId);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

module.exports = { initSocket, getIO };
