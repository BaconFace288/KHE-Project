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

function endMeeting(roomId) {
  const room = rooms[roomId];
  if (!room || !room.meeting) return;
  if (room.meetingTimer) { clearTimeout(room.meetingTimer); room.meetingTimer = null; }

  const votes = room.meeting.votes;
  const alive = Object.keys(room.players).filter(id => !room.players[id].isDead);
  const counts = {};
  let cast = 0;
  for (let vid in votes) { const t = votes[vid]; counts[t] = (counts[t]||0)+1; cast++; }
  const skipTotal = (counts['skip']||0) + (alive.length - cast);
  let maxV = 0, top = [];
  for (let id in counts) {
    if (id === 'skip' || !room.players[id]) continue;
    if (counts[id] > maxV) { maxV = counts[id]; top = [id]; }
    else if (counts[id] === maxV) top.push(id);
  }
  let eliminated = (top.length === 1 && maxV > skipTotal) ? top[0] : null;
  if (eliminated && room.players[eliminated]) {
    room.players[eliminated].isDead = true;
    room.players[eliminated].deathX = room.players[eliminated].x;
    room.players[eliminated].deathY = room.players[eliminated].y;
  }
  const snap = room.meeting;
  room.meeting = null;

  // Teleport all alive players to spawn circle around the button
  const aliveIds = Object.keys(room.players).filter(id => !room.players[id].isDead);
  const spawnPositions = {};
  if (aliveIds.length > 0) {
    aliveIds.forEach((id, i) => {
      const angle = (i / aliveIds.length) * Math.PI * 2;
      const sx = Math.round(1500 + Math.cos(angle) * 200);
      const sy = Math.round(1500 + Math.sin(angle) * 200);
      room.players[id].x = sx;
      room.players[id].y = sy;
      spawnPositions[id] = { x: sx, y: sy };
    });
  }

  io.to(roomId).emit('meetingResult', {
    eliminated,
    eliminatedName: eliminated ? room.players[eliminated]?.name : null,
    deathX: eliminated ? room.players[eliminated]?.deathX : null,
    deathY: eliminated ? room.players[eliminated]?.deathY : null,
    votes: counts,
    type: snap.type,
    spawnPositions
  });

  checkWinCondition(roomId);
}

function checkWinCondition(roomId) {
    const room = rooms[roomId];
    if (!room || room.state !== GAME_STATE.PLAYING) return;

    const alivePlayers = Object.values(room.players).filter(p => !p.isDead);
    const aliveImpostors = alivePlayers.filter(p => p.role === 'impostor').length;
    const aliveCrewmates = alivePlayers.filter(p => p.role === 'crewmate').length;

    if (aliveImpostors === 0) {
        room.state = GAME_STATE.GAMEOVER;
        io.to(roomId).emit('crewmateWinVote');
    } else if (aliveImpostors >= aliveCrewmates) {
        room.state = GAME_STATE.GAMEOVER;
        io.to(roomId).emit('cavemenWin');
    }
}

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
        const disconnectedPlayerMatch = room.players[socket.id];
        delete room.players[socket.id];
        
        io.to(roomId).emit('playerDisconnected', socket.id);
        
        const remainingPlayers = Object.keys(room.players);
        
        // --- Added: Win Condition if Caveman Leaves ---
        if (room.state === GAME_STATE.PLAYING && disconnectedPlayerMatch && disconnectedPlayerMatch.role === 'impostor') {
            const remainingImpostors = Object.values(room.players).filter(p => p.role === 'impostor' && !p.isDead);
            if (remainingImpostors.length === 0) {
                room.state = GAME_STATE.GAMEOVER;
                io.to(roomId).emit('cavemanLeftWin');
            }
        }
        // ----------------------------------------------

        if (remainingPlayers.length === 0) {
            delete rooms[roomId]; // Cleanup room
        } else {
            // Re-assign host if the host disconnected
            if (room.hostId === socket.id) {
                room.hostId = remainingPlayers[0]; 
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
        const player = room.players[socket.id];
        player.x = movementData.x;
        player.y = movementData.y;
        player.flipX = movementData.flipX;
        player.isMoving = movementData.isMoving;
        
        // emit to all other players in the room
        socket.to(roomId).emit('playerMoved', { id: socket.id, player });
    }
  });

  socket.on('taskComplete', (taskId) => {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) return;
    const room = rooms[roomId];
    if (!room.completedTasks) room.completedTasks = new Set();
    room.completedTasks.add(taskId);
    io.to(roomId).emit('taskCompleted', { taskId, playerId: socket.id });
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
      // Clear any ongoing meeting
      if (room.meetingTimer) { clearTimeout(room.meetingTimer); room.meetingTimer = null; }
      room.meeting = null;
      room.tasksDone = null;
      
      // Assign roles
      playerIds.forEach(id => {
        room.players[id].role = 'crewmate';
        room.players[id].isDead = false;
        // set random spawn
        room.players[id].x = 1500 + Math.random() * 200;
        room.players[id].y = 1500 + Math.random() * 200;
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

      // Sync state and trigger the reveal across the room
      const payload = {
          players: room.players,
          hostId: room.hostId,
          state: room.state
      };
      
      io.in(roomId).emit('roomUpdate', payload);
      io.in(roomId).emit('gameStarted', payload);
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
          const dx = killer.x - victim.x;
          const dy = killer.y - victim.y;
          if (Math.sqrt(dx*dx + dy*dy) < 100) {
            victim.isDead = true;
            victim.deathX = victim.x;
            victim.deathY = victim.y;
            io.to(roomId).emit('playerClubbed', { id: targetId, deathX: victim.deathX, deathY: victim.deathY });
            
            checkWinCondition(roomId);
          }
        }
    }
});

  socket.on('callMeeting', ({ type, bodyName }) => {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) return;
    const room = rooms[roomId];
    if (room.state !== GAME_STATE.PLAYING) return;
    if (room.meeting) return;
    const caller = room.players[socket.id];
    if (!caller || caller.isDead) return;

    room.meeting = { type, calledBy: socket.id, votes: {} };
    io.to(roomId).emit('meetingCalled', {
      type, calledBy: socket.id,
      callerName: caller.name, callerColor: caller.color,
      bodyName: bodyName || null
    });
    room.meetingTimer = setTimeout(() => endMeeting(roomId), 60000);
  });

  socket.on('castVote', (targetId) => {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) return;
    const room = rooms[roomId];
    if (!room.meeting || room.state !== GAME_STATE.PLAYING) return;
    const voter = room.players[socket.id];
    if (!voter || voter.isDead) return;
    if (room.meeting.votes[socket.id] !== undefined) return;
    if (targetId !== 'skip' && (!room.players[targetId] || room.players[targetId].isDead)) return;
    room.meeting.votes[socket.id] = targetId;
    io.to(roomId).emit('voteCast', { voterId: socket.id });
    const alive = Object.keys(room.players).filter(id => !room.players[id].isDead);
    if (Object.keys(room.meeting.votes).length >= alive.length) endMeeting(roomId);
  });

  socket.on('meetingChat', (text) => {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) return;
    const room = rooms[roomId];
    if (!room.meeting) return;
    const player = room.players[socket.id];
    if (!player) return;
    io.to(roomId).emit('meetingChatMsg', {
      name: player.name, color: player.color,
      text: String(text).slice(0, 150),
      isDead: player.isDead
    });
  });


  socket.on('allTasksDone', () => {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) return;
    const room = rooms[roomId];
    if (room.state !== GAME_STATE.PLAYING) return;

    // Mark this player as tasks-complete
    if (!room.tasksDone) room.tasksDone = new Set();
    room.tasksDone.add(socket.id);

    // Check if ALL crewmates have finished (alive or dead)
    const allCrew = Object.entries(room.players)
      .filter(([id, p]) => p.role === 'crewmate');
    const allDone = allCrew.every(([id]) => room.tasksDone.has(id));

    if (allDone && allCrew.length > 0) {
      room.state = GAME_STATE.GAMEOVER;
      io.to(roomId).emit('crewmatesWinTasks');
    }
  });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
