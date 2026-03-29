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

// MAP CONFIGURATIONS
const MAP_DATA = {
  'Alpha': {
    tasks: [
        { x: 900,  y: 1100 }, { x: 1350, y: 1250 }, { x: 2100, y: 720 },
        { x: 2080, y: 1100 }, { x: 600,  y: 2100 }, { x: 860,  y: 2100 },
        { x: 1340, y: 2690 }, { x: 1180, y: 500 },  { x: 400,  y: 600 },
        { x: 2200, y: 1700 }, { x: 700,  y: 2800 }, { x: 2600, y: 1200 }
    ],
    walls: [
      { x: 780, y: 780, w: 20, h: 640 }, { x: 800, y: 780, w: 320, h: 20 },
      { x: 1100, y: 800, w: 20, h: 300 }, { x: 1120, y: 1080, w: 500, h: 20 },
      { x: 1600, y: 1080, w: 20, h: 120 }, { x: 1600, y: 1300, w: 20, h: 120 },
      { x: 1120, y: 1400, w: 500, h: 20 }, { x: 1100, y: 1100, w: 20, h: 100 },
      { x: 1100, y: 1300, w: 20, h: 100 }, { x: 800, y: 1400, w: 100, h: 20 },
      { x: 1000, y: 1400, w: 100, h: 20 },
      { x: 1980, y: 580, w: 440, h: 20 }, { x: 1980, y: 600, w: 20, h: 300 },
      { x: 2400, y: 600, w: 20, h: 100 }, { x: 2400, y: 800, w: 20, h: 120 },
      { x: 2200, y: 900, w: 200, h: 20 }, { x: 1980, y: 900, w: 20, h: 420 },
      { x: 2200, y: 920, w: 20, h: 380 }, { x: 2000, y: 900, w: 50, h: 20 },
      { x: 2150, y: 900, w: 50, h: 20 }, { x: 2000, y: 1300, w: 50, h: 20 },
      { x: 2150, y: 1300, w: 70, h: 20 },
      { x: 480, y: 1980, w: 540, h: 20 }, { x: 480, y: 2500, w: 540, h: 20 },
      { x: 480, y: 2000, w: 20, h: 100 }, { x: 480, y: 2200, w: 20, h: 300 },
      { x: 1000, y: 1980, w: 20, h: 320 }, { x: 1000, y: 2400, w: 20, h: 100 },
      { x: 500, y: 2240, w: 50, h: 20 }, { x: 650, y: 2240, w: 200, h: 20 },
      { x: 950, y: 2240, w: 50, h: 20 }, { x: 740, y: 2000, w: 20, h: 50 },
      { x: 740, y: 2150, w: 20, h: 200 }, { x: 740, y: 2450, w: 20, h: 50 },
      { x: 1180, y: 2580, w: 940, h: 20 }, { x: 1180, y: 2800, w: 940, h: 20 },
      { x: 1180, y: 2600, w: 20, h: 50 }, { x: 1180, y: 2750, w: 20, h: 50 },
      { x: 2100, y: 2600, w: 20, h: 50 }, { x: 2100, y: 2750, w: 20, h: 50 },
      { x: 1490, y: 2600, w: 20, h: 50 }, { x: 1490, y: 2750, w: 20, h: 50 },
      { x: 1790, y: 2600, w: 20, h: 50 }, { x: 1790, y: 2750, w: 20, h: 50 }
    ],
    pits: [
      { x: 300, y: 300, r: 80 }, { x: 1000, y: 500, r: 120 },
      { x: 2500, y: 400, r: 96 }, { x: 2700, y: 2400, r: 112 },
      { x: 500, y: 1200, r: 72 }, { x: 1600, y: 1800, r: 64 }
    ],
    furniture: [
      { x: 950, y: 950, w: 40, h: 25 }, { x: 2100, y: 680, w: 55, h: 25 },
      { x: 1650, y: 2700, w: 120, h: 60 }, { x: 1955, y: 2700, w: 120, h: 60 }
    ]
  },
  'Britney': {
    tasks: [
        { x: 500, y: 500 }, { x: 2500, y: 500 }, { x: 1500, y: 1500 },
        { x: 500, y: 2500 }, { x: 2500, y: 2500 }, { x: 1500, y: 400 },
        { x: 2600, y: 1500 }, { x: 400, y: 1500 }, { x: 1500, y: 2600 }
    ],
    walls: [
      { x: 400, y: 400, w: 20, h: 400 }, { x: 400, y: 400, w: 400, h: 20 }, // N-W Box
      { x: 2200, y: 400, w: 400, h: 20 }, { x: 2600, y: 400, w: 20, h: 400 }, // N-E Box
      { x: 1200, y: 1200, w: 600, h: 20 }, { x: 1200, y: 1800, w: 600, h: 20 }, // Central Hall
      { x: 1200, y: 1200, w: 20, h: 600 }, { x: 1800, y: 1200, w: 20, h: 600 },
      { x: 400, y: 2200, w: 20, h: 400 }, { x: 400, y: 2600, w: 400, h: 20 }, // S-W Box
      { x: 2200, y: 2600, w: 400, h: 20 }, { x: 2600, y: 2200, w: 20, h: 400 } // S-E Box
    ],
    pits: [
      { x: 1500, y: 800, r: 150 }, { x: 1500, y: 2200, r: 150 }, // Central Water bodies
      { x: 800, y: 1500, r: 100 }, { x: 2200, y: 1500, r: 100 }
    ],
    furniture: [
       { x: 1500, y: 1400, w: 100, h: 40 }, { x: 1500, y: 1600, w: 100, h: 40 }
    ]
  },
  'Charlie': {
    tasks: [
        { x: 1000, y: 500 }, { x: 2000, y: 500 }, { x: 1500, y: 1000 },
        { x: 500, y: 1500 }, { x: 2500, y: 1500 }, { x: 1500, y: 2000 },
        { x: 1000, y: 2500 }, { x: 2000, y: 2500 }
    ],
    walls: [
      { x: 200,  y: 200,  w: 2600, h: 20 }, { x: 200,  y: 2800, w: 2600, h: 20 }, // Outer ruins
      { x: 200,  y: 200,  w: 20,   h: 2600 }, { x: 2800, y: 200,  w: 20,   h: 2600 },
      { x: 1000, y: 1000, w: 20,   h: 1000 }, { x: 2000, y: 1000, w: 20,   h: 1000 }, // Maze walls
      { x: 1000, y: 1000, w: 1000, h: 20 }, { x: 1000, y: 2000, w: 1000, h: 20 }
    ],
    pits: [
        { x: 600, y: 600, r: 100 }, { x: 2400, y: 600, r: 100 }, // Acid swamps
        { x: 600, y: 2400, r: 100 }, { x: 2400, y: 2400, r: 100 },
        { x: 1500, y: 1500, r: 120 }
    ],
    furniture: [
        { x: 1500, y: 1500, w: 80, h: 80 } // Center altar
    ]
  }
};

function collides(px, py, pr, mapId = 'Alpha') {
    const map = MAP_DATA[mapId] || MAP_DATA['Alpha'];
    // 1. Walls
    for (let w of map.walls) {
        let testX = px; let testY = py;
        if (px < w.x) testX = w.x; else if (px > w.x + w.w) testX = w.x + w.w;
        if (py < w.y) testY = w.y; else if (py > w.y + w.h) testY = w.y + w.h;
        if (Math.hypot(px - testX, py - testY) <= pr) return true;
    }
    // 2. Pits
    for (let pit of map.pits) {
        if (Math.hypot(px - pit.x, py - pit.y) <= pit.r + pr) return true;
    }
    // 3. Furniture
    for (let f of map.furniture) {
        let testX = px; let testY = py;
        if (px < f.x - f.w/2) testX = f.x - f.w/2; else if (px > f.x + f.w/2) testX = f.x + f.w/2;
        if (py < f.y - f.h/2) testY = f.y - f.h/2; else if (py > f.y + f.h/2) testY = f.y + f.h/2;
        if (Math.hypot(px - testX, py - testY) <= pr) return true;
    }
    // 4. Emergency Button
    if (Math.hypot(px - 1500, py - 1490) <= 36 + pr) return true;

    return false;
}
function tickBots() {
    for (let roomId in rooms) {
        const room = rooms[roomId];
        if (room.state !== GAME_STATE.PLAYING) continue;
        
        // Sync with human intro (4.5s)
        if (room.roundStartTime && Date.now() < room.roundStartTime + 4500) {
            continue;
        }

        if (room.meeting) {
            // During meeting, bots vote if they haven't (heuristic: vote at 40s mark)
            handleBotMeeting(room);
            continue;
        }

        for (let botId in room.players) {
            const bot = room.players[botId];
            if (!bot.isBot) continue;

            if (bot.role === 'crewmate') {
                handleCrewmateBot(bot, room);
            } else {
                handleCavemanBot(bot, room, botId);
            }
            
            // Sync bot movement (Ghosts move too!)
            const p = room.players[botId];
            io.to(roomId).emit('playerMoved', { id: botId, player: { x: p.x, y: p.y, flipX: p.flipX, isMoving: p.isMoving, isDead: p.isDead } });
        }
    }
}

function handleBotMeeting(room) {
    // Wait for all alive humans to vote before bots step in
    const aliveHumans = Object.keys(room.players).filter(id => !room.players[id].isBot && !room.players[id].isDead);
    const humansVoted = aliveHumans.every(id => room.meeting.votes[id] !== undefined);
    
    if (!humansVoted && aliveHumans.length > 0) return;

    // Boss Step: AI players vote instantly when humans are done
    for (let id in room.players) {
        const p = room.players[id];
        if (p.isBot && !p.isDead && room.meeting.votes[id] === undefined) {
             // Find consensus target from suspicion log
             let target = 'skip';
             let maxS = 0;
             Object.entries(p.suspicion).forEach(([tid, count]) => {
                 if (room.players[tid] && !room.players[tid].isDead && count > maxS) {
                     maxS = count; target = tid;
                 }
             });
             // Vote for top target or skip
             room.meeting.votes[id] = target;
             io.to(room.code).emit('voteCast', { voterId: id });
             const alive = Object.keys(room.players).filter(pid => !room.players[pid].isDead);
             if (Object.keys(room.meeting.votes).length >= alive.length) {
                 endMeeting(room.code);
                 return; // Avoid multiple calls if multiple bots vote
             }
        }
    }
}

const BOT_RADIUS = 16;
function handleCrewmateBot(bot, room) {
    if (bot.tasksCompleted >= 7) {
        bot.botState = 'FOLLOWING';
    }

    if (bot.botState === 'FOLLOWING') {
        // Safety Stalking: Find nearest alive non-hostile player
        let nearest = null; let minDist = Infinity;
        Object.entries(room.players).forEach(([id, p]) => {
            if (p.isDead || p.role === 'impostor' || p === bot) return;
            const d = Math.hypot(bot.x - p.x, bot.y - p.y);
            if (d < minDist) { minDist = d; nearest = p; }
        });

        if (nearest) {
            if (minDist > 80) {
                moveTowards(bot, nearest.x, nearest.y);
                bot.isMoving = true;
            } else {
                bot.isMoving = false;
            }
        } else {
            bot.isMoving = false;
        }
        return;
    }

    if (bot.botState === 'IDLE' || !bot.target) {
        const map = MAP_DATA[room.mapId] || MAP_DATA['Alpha'];
        bot.target = map.tasks[Math.floor(Math.random() * map.tasks.length)];
        bot.botState = 'MOVING';
        bot.isMoving = true;
    }

    if (bot.botState === 'MOVING') {
        const dist = Math.hypot(bot.target.x - bot.x, bot.target.y - bot.y);
        if (dist < 25) {
            bot.botState = 'TASKING';
            // Each task takes solid 25 seconds
            bot.taskTimer = Date.now() + 25000;
            bot.isMoving = false;
        } else {
            moveTowards(bot, bot.target.x, bot.target.y);
        }
    }

    if (bot.botState === 'TASKING') {
        if (Date.now() > bot.taskTimer) {
            bot.tasksCompleted = (bot.tasksCompleted || 0) + 1;
            room.completedTasksCount = (room.completedTasksCount || 0) + 1;
            
            io.to(room.code).emit('taskCompleted', { taskId: 'bot_task', playerId: bot.id });
            bot.botState = 'IDLE';
            bot.target = null;
            checkWinCondition(room.code);
        }
    }
}

function handleCavemanBot(bot, room, botId) {
    // Ghosts can't kill!
    if (bot.isDead) {
        bot.isMoving = false;
        return;
    }

    // 1. Cool-off / Faking Logic
    if (bot.fakeUntil && Date.now() < bot.fakeUntil) {
        handleCrewmateBot(bot, room); // Act like a crewmate
        return;
    }

    // 2. Kill Cooldown check (20s)
    const canKill = !bot.lastKillTime || (Date.now() - bot.lastKillTime > 20000);

    // 3. Find nearest crewmate
    let nearest = null; let minDist = Infinity;
    Object.entries(room.players).forEach(([id, p]) => {
        if (id === botId || p.isDead || p.role !== 'crewmate') return;
        const d = Math.hypot(bot.x - p.x, bot.y - p.y);
        if (d < minDist) { minDist = d; nearest = p; }
    });

    if (nearest && canKill) {
        bot.isMoving = true;
        moveTowards(bot, nearest.x, nearest.y);
        if (minDist < 60) {
            // Kill logic
            nearest.isDead = true;
            nearest.deathX = nearest.x; nearest.deathY = nearest.y;
            bot.lastKillTime = Date.now();
            // Trigger faking for 15-60s after a kill
            bot.fakeUntil = Date.now() + (15000 + Math.random() * 45000);
            
            io.to(room.code).emit('playerClubbed', { id: Object.keys(room.players).find(k => room.players[k] === nearest), deathX: nearest.deathX, deathY: nearest.deathY });
            checkWinCondition(room.code);
        }
    } else {
        // If can't kill or no targets, fake being a crewmate (prevents standing still suspiciously)
        handleCrewmateBot(bot, room);
    }
}

function moveTowards(bot, tx, ty) {
    const directAngle = Math.atan2(ty - bot.y, tx - bot.x);
    
    // Finer navigation: check every 15 degrees (0, +/- 0.26, +/- 0.52...)
    const probes = [0, 0.26, -0.26, 0.52, -0.52, 0.78, -0.78, 1.04, -1.04, 1.31, -1.31, 1.57, -1.57];
    let selectedAngle = null;

    for (let offset of probes) {
        const testAngle = directAngle + offset;
        const nextX = bot.x + Math.cos(testAngle) * BOT_WALK_SPEED;
        const nextY = bot.y + Math.sin(testAngle) * BOT_WALK_SPEED;
        
        if (!collides(nextX, nextY, BOT_RADIUS, room.mapId)) {
            selectedAngle = testAngle;
            break;
        }
    }

    if (selectedAngle !== null) {
        // Swept check: check midpoint to prevent tunneling at high speed
        const midX = bot.x + Math.cos(selectedAngle) * (BOT_WALK_SPEED / 2);
        const midY = bot.y + Math.sin(selectedAngle) * (BOT_WALK_SPEED / 2);
        
        if (collides(midX, midY, BOT_RADIUS, room.mapId)) {
            selectedAngle = null; // Midpoint blocked!
        }
    }

    if (selectedAngle !== null) {
        const nextX = bot.x + Math.cos(selectedAngle) * BOT_WALK_SPEED;
        const nextY = bot.y + Math.sin(selectedAngle) * BOT_WALK_SPEED;
        
        // Progress tracking: If we haven't gotten closer to TARGET in 6 ticks (0.6s), we are "ramming"
        if (!bot.progressCheckTicks) bot.progressCheckTicks = 0;
        if (bot.progressCheckTicks % 6 === 0) {
            const currentDist = Math.hypot(tx - nextX, ty - nextY);
            if (bot.lastDistToTarget !== undefined) {
                // We must get at least 20px closer in 0.6s (expected max is 90px close)
                if (currentDist > bot.lastDistToTarget - 20) {
                    selectedAngle = null; // Force redirect
                }
            }
            bot.lastDistToTarget = currentDist;
        }
        bot.progressCheckTicks++;
    }

    if (selectedAngle !== null) {
        const nextX = bot.x + Math.cos(selectedAngle) * BOT_WALK_SPEED;
        const nextY = bot.y + Math.sin(selectedAngle) * BOT_WALK_SPEED;
        bot.flipX = (nextX < bot.x);
        bot.x = nextX; bot.y = nextY;
        bot.isMoving = true;
        bot.stuckTicks = 0;
    } else {
        bot.isMoving = false;
        bot.stuckTicks = (bot.stuckTicks || 0) + 1;
        
        // Panic Recovery: Immediate redirect
        // Pick a different task location
        const map = MAP_DATA[room.mapId] || MAP_DATA['Alpha'];
        bot.target = map.tasks[Math.floor(Math.random() * map.tasks.length)];
        bot.botState = 'IDLE';
        bot.stuckTicks = 0;
        bot.progressCheckTicks = 0;
        bot.lastDistToTarget = undefined;
    }
}

setInterval(tickBots, 100);

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
  room.roundStartTime = Date.now();
  
  // Interruption Reset: Reset AI task timers
  Object.values(room.players).forEach(p => {
    if (p.isBot && p.role === 'crewmate' && p.botState === 'TASKING') {
        p.botState = 'IDLE';
        p.taskTimer = 0;
    }
  });

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
    } else {
        // Task Win Check: 7 tasks per crewmate (alive or dead)
        const totalCrew = Object.values(room.players).filter(p => p.role === 'crewmate').length;
        const requiredTasks = totalCrew * 7;
        const completed = room.completedTasksCount || 0;
        
        if (completed >= requiredTasks) {
            room.state = GAME_STATE.GAMEOVER;
            io.to(roomId).emit('crewmateWinTasks');
        }
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
        isMoving: false,
        tasksCompleted: 0,
        taskTimer: 0
      };
  }

  socket.on('createRoom', (name) => {
      const code = generateRoomCode();
      const room = {
          code: code,
          state: GAME_STATE.LOBBY,
          hostId: socket.id,
          players: {},
          mapId: 'Alpha'
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

  socket.on('selectMap', (mapId) => {
      const roomId = socket.roomId;
      if (!roomId || !rooms[roomId]) return;
      const room = rooms[roomId];
      if (room.hostId !== socket.id || room.state !== GAME_STATE.LOBBY) return;
      if (!MAP_DATA[mapId]) return;

      room.mapId = mapId;
      io.to(roomId).emit('mapSelected', mapId);
  });

  socket.on('addBot', () => {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) return;
    const room = rooms[roomId];
    if (room.hostId !== socket.id || room.state !== GAME_STATE.LOBBY) return;
    
    // Hard cap at 10 players (human + AI)
    if (Object.keys(room.players).length >= 10) return;

    const botId = `bot_${Math.floor(Math.random() * 10000)}`;
    room.players[botId] = buildPlayer(`AI_${Math.floor(Math.random() * 1000)}`, room);
    room.players[botId].isBot = true;
    room.players[botId].botState = 'IDLE';
    room.players[botId].target = null;
    room.players[botId].targetTime = 0;
    room.players[botId].suspicion = {}; 

    io.to(roomId).emit('roomUpdate', {
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
    
    room.completedTasksCount = (room.completedTasksCount || 0) + 1;
    io.to(roomId).emit('taskCompleted', { taskId, playerId: socket.id });
    checkWinCondition(roomId);
  });

  socket.on('startGame', () => {
    const roomId = socket.roomId;
    if (!roomId) return;
    const room = rooms[roomId];
    
    // Validate Host and conditions
    if (room && socket.id === room.hostId && room.state === GAME_STATE.LOBBY) {
      const playerIds = Object.keys(room.players);
      
      if (playerIds.length < 4) {
          // Allow starting with bots if total players >= 4
          // No change needed here if we count bot keys, which we do
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
        
        if (room.players[id].isBot) {
            room.players[id].fakeUntil = Date.now() + (15000 + Math.random() * 30000);
            room.players[id].lastKillTime = 0;
        }
      });

      room.roundStartTime = Date.now();

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
          state: room.state,
          mapId: room.mapId
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

    // AI Bots listen to chat
    const msg = String(text).toLowerCase();
    for (let id in room.players) {
        const p = room.players[id];
        if (p.isBot) {
            Object.entries(room.players).forEach(([targetId, target]) => {
                if (targetId === id) return;
                const nameMatch = msg.includes(target.name.toLowerCase());
                const colorMap = { '#FF0000': 'red', '#0000FF': 'blue', '#00FF00': 'green', '#FFFF00': 'yellow', '#FFA500': 'orange', '#800080': 'purple' };
                const colorCode = target.color.toUpperCase();
                const colorName = colorMap[colorCode];
                if (nameMatch || (colorName && msg.includes(colorName))) {
                    p.suspicion[targetId] = (p.suspicion[targetId] || 0) + 1;
                }
            });
        }
    }

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
