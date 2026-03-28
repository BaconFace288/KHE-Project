const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Colors for players
const colors = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FFA500', '#800080', '#FFC0CB', '#00FFFF', '#A52A2A', '#808080', '#000000'];

const GAME_STATE = {
  LOBBY: 'LOBBY',
  PLAYING: 'PLAYING',
  GAMEOVER: 'GAMEOVER'
};

const rooms = {};

// Helper: generate 4 letter code
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code;
  do {
    code = '';
    for(let i=0; i<4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while(rooms[code]);
  return code;
}

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  // Store the room code the socket belongs to
  socket.roomId = null;

  function buildPlayer(name, room) {
      const playerCount = Object.keys(room.players).length;
      return {
        x: 400 + (Math.random() * 50 - 25),
        y: 300 + (Math.random() * 50 - 25),
        color: colors[playerCount % colors.length],
        role: 'crewmate',
        isDead: false,
        name: name || `Player_${Math.floor(Math.random() * 1000)}`,
        flipX: false,
        isMoving: false
      };
  }

  socket.on('createRoom', (name) => {
      const code = generateRoomCode();
      const room = {
          code: code,
          state: GAME_STATE.LOBBY,
          hostId: socket.id,
          players: {}
      };
      
      room.players[socket.id] = buildPlayer(name, room);
      rooms[code] = room;
      
      socket.join(code);
      socket.roomId = code;
      
      socket.emit('roomCreated', { code, playerId: socket.id });
      io.to(code).emit('roomUpdate', {
          players: room.players,
          hostId: room.hostId,
          state: room.state
      });
  });

  socket.on('joinRoom', ({ code, name }) => {
      const upperCode = code.toUpperCase();
      const room = rooms[upperCode];
      
      if (!room) {
          return socket.emit('joinError', 'Room does not exist.');
      }
      if (room.state !== GAME_STATE.LOBBY) {
          return socket.emit('joinError', 'Game has already started.');
      }
      if (Object.keys(room.players).length >= 10) {
          return socket.emit('joinError', 'Room is full (10 players max).');
      }
      
      room.players[socket.id] = buildPlayer(name, room);
      socket.join(upperCode);
      socket.roomId = upperCode;
      
      socket.emit('roomJoined', { code: upperCode, playerId: socket.id });
      io.to(upperCode).emit('roomUpdate', {
          players: room.players,
          hostId: room.hostId,
          state: room.state
      });
  });

  // Global Disconnect Handler
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    const roomId = socket.roomId;
    if (roomId && rooms[roomId]) {
        const room = rooms[roomId];
        delete room.players[socket.id];
        
        io.to(roomId).emit('playerDisconnected', socket.id);
        
        const remainingPlayers = Object.keys(room.players);
        if (remainingPlayers.length === 0) {
            delete rooms[roomId]; // Cleanup room
        } else {
            // Re-assign host if the host disconnected
            if (room.hostId === socket.id) {
                room.hostId = remainingPlayers[0]; // first remaining player (pseudo join-order given object key behavior)
                io.to(roomId).emit('hostChanged', room.hostId);
            }
            io.to(roomId).emit('roomUpdate', {
              players: room.players,
              hostId: room.hostId,
              state: room.state
            });
        }
    }
  });

  socket.on('playerMovement', (movementData) => {
    const roomId = socket.roomId;
    if (roomId && rooms[roomId] && rooms[roomId].players[socket.id]) {
        const room = rooms[roomId];
        room.players[socket.id].x = movementData.x;
        room.players[socket.id].y = movementData.y;
        room.players[socket.id].flipX = movementData.flipX;
        room.players[socket.id].isMoving = movementData.isMoving;
        
        // emit to all other players in the room
        socket.to(roomId).emit('playerMoved', { id: socket.id, player: room.players[socket.id] });
    }
  });

  socket.on('startGame', () => {
    const roomId = socket.roomId;
    if (!roomId) return;
    const room = rooms[roomId];
    
    // Validate Host and conditions
    if (room && socket.id === room.hostId && room.state === GAME_STATE.LOBBY) {
      const playerIds = Object.keys(room.players);
      
      if (playerIds.length < 4) {
          // Additional safety block
          return;
      }

      room.state = GAME_STATE.PLAYING;
      
      // Assign roles
      playerIds.forEach(id => {
        room.players[id].role = 'crewmate';
        room.players[id].isDead = false;
        // set random spawn
        room.players[id].x = 200 + Math.random() * 400;
        room.players[id].y = 200 + Math.random() * 200;
      });

      // Pick randomly 1-2 impostors (Cavemen) depending on size
      let impostorCount = 1;
      if (playerIds.length >= 8) impostorCount = 2; // For larger groups

      let possibleImpostors = [...playerIds];
      for(let i=0; i<impostorCount; i++) {
         const idx = Math.floor(Math.random() * possibleImpostors.length);
         const impostorId = possibleImpostors[idx];
         room.players[impostorId].role = 'impostor';
         possibleImpostors.splice(idx, 1);
      }

      io.to(roomId).emit('gameStarted', room.players);
    }
  });

  socket.on('clubPlayer', (targetId) => {
    const roomId = socket.roomId;
    if (!roomId) return;
    const room = rooms[roomId];

    if (room && room.state === GAME_STATE.PLAYING) {
        const killer = room.players[socket.id];
        const victim = room.players[targetId];

        if (killer && victim && killer.role === 'impostor' && !killer.isDead && !victim.isDead) {
          // Check distance just in case
          const dx = killer.x - victim.x;
          const dy = killer.y - victim.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            victim.isDead = true;
            io.to(roomId).emit('playerClubbed', targetId);
          }
        }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
