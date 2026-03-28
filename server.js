const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const players = {};
const colors = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FFA500', '#800080', '#FFC0CB', '#00FFFF', '#A52A2A', '#808080', '#000000'];

const GAME_STATE = {
  LOBBY: 'LOBBY',
  PLAYING: 'PLAYING',
  MEETING: 'MEETING'
};

let currentState = GAME_STATE.LOBBY;

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  players[socket.id] = {
    x: 400,
    y: 300,
    color: colors[Object.keys(players).length % colors.length],
    role: 'crewmate', // or 'impostor'
    isDead: false,
    name: `Player_${Math.floor(Math.random() * 1000)}`
  };

  socket.emit('currentPlayers', players);
  socket.emit('gameState', currentState);
  socket.broadcast.emit('newPlayer', { id: socket.id, player: players[socket.id] });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    delete players[socket.id];
    io.emit('playerDisconnected', socket.id);
    
    if (Object.keys(players).length === 0) {
      currentState = GAME_STATE.LOBBY; // reset if empty
    }
  });

  socket.on('playerMovement', (movementData) => {
    if (!players[socket.id]) return;
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].flipX = movementData.flipX;
    players[socket.id].isMoving = movementData.isMoving;
    
    // emit to all other players
    socket.broadcast.emit('playerMoved', { id: socket.id, player: players[socket.id] });
  });

  socket.on('startGame', () => {
    if (currentState === GAME_STATE.LOBBY) {
      currentState = GAME_STATE.PLAYING;
      
      const playerIds = Object.keys(players);
      // Assign roles
      playerIds.forEach(id => {
        players[id].role = 'crewmate';
        players[id].isDead = false;
        // set random spawn
        players[id].x = 200 + Math.random() * 400;
        players[id].y = 200 + Math.random() * 200;
      });

      // Pick 1 random impostor (Caveman)
      if (playerIds.length > 0) {
        const impostorId = playerIds[Math.floor(Math.random() * playerIds.length)];
        players[impostorId].role = 'impostor';
      }

      io.emit('gameStarted', players);
    }
  });

  socket.on('clubPlayer', (targetId) => {
    if (currentState !== GAME_STATE.PLAYING) return;
    const killer = players[socket.id];
    const victim = players[targetId];

    if (killer && victim && killer.role === 'impostor' && !killer.isDead && !victim.isDead) {
      // Check distance just in case
      const dx = killer.x - victim.x;
      const dy = killer.y - victim.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        victim.isDead = true;
        io.emit('playerClubbed', targetId);
      }
    }
  });
  
  // Update Name
  socket.on('updateName', (name) => {
     if(players[socket.id]) {
        players[socket.id].name = name;
        io.emit('nameUpdated', { id: socket.id, name: name });
     }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
