const socket = io();

// UI Elements
const mainMenu = document.getElementById('main-menu');
const lobbyScreen = document.getElementById('lobby-screen');
const gameUi = document.getElementById('game-ui');
const endScreen = document.getElementById('end-screen');

const playerNameInput = document.getElementById('player-name');
const roomCodeInput = document.getElementById('room-code-input');
const createBtn = document.getElementById('create-btn');
const joinBtn = document.getElementById('join-btn');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const errorMsg = document.getElementById('error-msg');

const currentRoomCodeText = document.getElementById('current-room-code');
const playerListDiv = document.getElementById('player-list');
const hostControls = document.getElementById('host-controls');
const waitMsg = document.getElementById('wait-msg');
const hostStatus = document.getElementById('host-status');

const roleText = document.getElementById('role-text');
const actionBtn = document.getElementById('action-btn');
const endText = document.getElementById('end-text');

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const MAP_WIDTH = 3000;
const MAP_HEIGHT = 3000;

// === Map Obstacles ===
const WT = 20; // Wall thickness
const DW = 100; // Door width

const roofs = [
  // B1 (The Compound) - Shift B inward to reveal 1100x1120 inner wall
  { id: 'B1_A', x: 800, y: 800, w: 300, h: 600, color: '#34495e' },
  { id: 'B1_B', x: 1120, y: 1100, w: 480, h: 300, color: '#2c3e50' },
  // B2 (L-Block) - Shift B down to reveal 900x920 inner wall
  { id: 'B2_A', x: 2000, y: 600, w: 400, h: 300, color: '#7f8c8d' },
  { id: 'B2_B', x: 2000, y: 920, w: 200, h: 380, color: '#95a5a6' },
  // B3 (Maze Block) - Shrink all to reveal 740x760 and 2240x2260 inner crosses
  { id: 'B3_A', x: 500, y: 2000, w: 240, h: 240, color: '#8e44ad' },
  { id: 'B3_B', x: 760, y: 2000, w: 240, h: 240, color: '#9b59b6' },
  { id: 'B3_C', x: 500, y: 2260, w: 240, h: 240, color: '#8e44ad' },
  { id: 'B3_D', x: 760, y: 2260, w: 240, h: 240, color: '#9b59b6' },
  // B4 (Longhouse) - Slicing at 1490x1510 and 1790x1810 inner walls
  { id: 'B4_A', x: 1200, y: 2600, w: 290, h: 200, color: '#e67e22' },
  { id: 'B4_B', x: 1510, y: 2600, w: 280, h: 200, color: '#d35400' },
  { id: 'B4_C', x: 1810, y: 2600, w: 290, h: 200, color: '#e67e22' }
];

const walls = [
  // B1 Walls (Compound)
  { x: 780, y: 780, w: 20, h: 640 }, // Left A
  { x: 800, y: 780, w: 320, h: 20 }, // Top A
  { x: 1100, y: 800, w: 20, h: 300 }, // Right A (top part)
  { x: 1120, y: 1080, w: 500, h: 20 }, // Top B
  { x: 1600, y: 1080, w: 20, h: 120 }, // Right B top
  { x: 1600, y: 1300, w: 20, h: 120 }, // Right B bot (Door at Y:1200-1300)
  { x: 1120, y: 1400, w: 500, h: 20 }, // Bottom B
  { x: 1100, y: 1100, w: 20, h: 100 }, // Inner A-B top
  { x: 1100, y: 1300, w: 20, h: 100 }, // Inner A-B bot (Door at Y:1200-1300)
  { x: 800, y: 1400, w: 100, h: 20 }, // Bottom A left
  { x: 1000, y: 1400, w: 100, h: 20 }, // Bottom A right (Door at X:900-1000)

  // B2 Walls (L-Block)
  { x: 1980, y: 580, w: 440, h: 20 }, // Top A
  { x: 1980, y: 600, w: 20, h: 300 }, // Left A
  { x: 2400, y: 600, w: 20, h: 100 }, // Right A top
  { x: 2400, y: 800, w: 20, h: 120 }, // Right A bot (Door at Y:700-800)
  { x: 2200, y: 900, w: 200, h: 20 }, // Bottom A right part
  { x: 1980, y: 900, w: 20, h: 420 }, // Left B
  { x: 2200, y: 920, w: 20, h: 380 }, // Right B
  { x: 2000, y: 900, w: 50, h: 20 }, // Inner left
  { x: 2150, y: 900, w: 50, h: 20 }, // Inner right (Door at X:2050-2150)
  { x: 2000, y: 1300, w: 50, h: 20 }, // Bottom left
  { x: 2150, y: 1300, w: 70, h: 20 }, // Bottom right (Door at X:2050-2150)
  
  // B3 Walls (Maze)
  { x: 480, y: 1980, w: 540, h: 20 }, // Top outer
  { x: 480, y: 2500, w: 540, h: 20 }, // Bottom outer
  { x: 480, y: 2000, w: 20, h: 100 }, // Left top
  { x: 480, y: 2200, w: 20, h: 300 }, // Left bot (Door at Y:2100-2200)
  { x: 1000, y: 1980, w: 20, h: 320 }, // Right top
  { x: 1000, y: 2400, w: 20, h: 100 }, // Right bot (Door at Y:2300-2400)
  { x: 500, y: 2240, w: 50, h: 20 }, // H-Inner left
  { x: 650, y: 2240, w: 200, h: 20 }, // H-Inner mid (Doors at 550-650, 850-950)
  { x: 950, y: 2240, w: 50, h: 20 }, // H-Inner right
  { x: 740, y: 2000, w: 20, h: 50 }, // V-Inner top
  { x: 740, y: 2150, w: 20, h: 200 }, // V-Inner mid (Doors at 2050-2150, 2350-2450)
  { x: 740, y: 2450, w: 20, h: 50 }, // V-Inner bot

  // B4 Walls (Longhouse)
  { x: 1180, y: 2580, w: 940, h: 20 }, // Top
  { x: 1180, y: 2800, w: 940, h: 20 }, // Bottom
  { x: 1180, y: 2600, w: 20, h: 50 }, // Left top
  { x: 1180, y: 2750, w: 20, h: 50 }, // Left bot (Door at Y:2650-2750)
  { x: 2100, y: 2600, w: 20, h: 50 }, // Right top
  { x: 2100, y: 2750, w: 20, h: 50 }, // Right bot (Door at Y:2650-2750)
  { x: 1490, y: 2600, w: 20, h: 50 }, // Inner AB top
  { x: 1490, y: 2750, w: 20, h: 50 }, // Inner AB bot
  { x: 1790, y: 2600, w: 20, h: 50 }, // Inner BC top
  { x: 1790, y: 2750, w: 20, h: 50 }  // Inner BC bot
];

const doors = [
  // B1
  { x: 900, y: 1380, w: 100, h: 60 },
  { x: 1080, y: 1200, w: 60, h: 100 },
  { x: 1580, y: 1200, w: 60, h: 100 },
  // B2
  { x: 2380, y: 700, w: 60, h: 100 },
  { x: 2050, y: 880, w: 100, h: 60 },
  { x: 2050, y: 1280, w: 100, h: 60 },
  // B3
  { x: 440, y: 2100, w: 60, h: 100 }, // sticking out left so you see it well outside
  { x: 980, y: 2300, w: 60, h: 100 },
  { x: 550, y: 2230, w: 100, h: 40 },
  { x: 850, y: 2230, w: 100, h: 40 },
  { x: 730, y: 2050, w: 40, h: 100 },
  { x: 730, y: 2350, w: 40, h: 100 },
  // B4
  { x: 1140, y: 2650, w: 60, h: 100 }, // stick out further left
  { x: 2080, y: 2650, w: 60, h: 100 },
  { x: 1470, y: 2650, w: 60, h: 100 },
  { x: 1770, y: 2650, w: 60, h: 100 }
];

function createLumpyPit(cx, cy, r) {
   const pts = [];
   const numPoints = 16;
   for(let i=0; i<numPoints; i++) {
       const ang = (i / numPoints) * Math.PI * 2;
       const noise = (Math.random() - 0.5) * (r * 0.4);
       const dist = r + noise;
       pts.push({ x: cx + Math.cos(ang) * dist, y: cy + Math.sin(ang) * dist });
   }
   return { x: cx, y: cy, r: r * 0.8, points: pts }; 
}

const pits = [
  createLumpyPit(300, 300, 100),
  createLumpyPit(1000, 500, 150),
  createLumpyPit(2500, 400, 120),
  createLumpyPit(2700, 2400, 140),
  createLumpyPit(500, 1200, 90),
  createLumpyPit(1600, 1800, 80)
];

// === Tasks for Time Travelers ===
const TASKS = [
  // Inside buildings
  { id: 't1', x: 900,  y: 1100, label: '⚙️ Fix Relay',       done: false }, // B1_A
  { id: 't2', x: 1350, y: 1250, label: '🔋 Charge Battery',  done: false }, // B1_B
  { id: 't3', x: 2100, y: 720,  label: '📡 Align Dish',      done: false }, // B2_A
  { id: 't4', x: 2080, y: 1100, label: '🧪 Mix Solution',    done: false }, // B2_B
  { id: 't5', x: 600,  y: 2100, label: '🔌 Restore Power',   done: false }, // B3_A
  { id: 't6', x: 860,  y: 2100, label: '💾 Upload Data',     done: false }, // B3_B
  { id: 't7', x: 1340, y: 2690, label: '🌡️ Cool Reactor',    done: false }, // B4_A
  // Near a pit
  { id: 't8', x: 1050, y: 490,  label: '⚠️ Seal Pit Crack',  done: false }, // near pit[1]
  // Outside buildings
  { id: 't9',  x: 400,  y: 600,  label: '🌿 Collect Samples', done: false },
  { id: 't10', x: 2200, y: 1700, label: '🗺️ Survey Zone',     done: false },
  { id: 't11', x: 700,  y: 2800, label: '🪨 Mark Boundary',   done: false },
  { id: 't12', x: 2600, y: 1200, label: '📦 Drop Supply',     done: false },
];

function collidesWithWall(px, py, pr) {
    for (let w of walls) {
        let testX = px; let testY = py;
        if (px < w.x) testX = w.x; else if (px > w.x + w.w) testX = w.x + w.w;
        if (py < w.y) testY = w.y; else if (py > w.y + w.h) testY = w.y + w.h;
        let distX = px - testX; let distY = py - testY;
        if (Math.sqrt((distX*distX) + (distY*distY)) <= pr) return true;
    }
    return false;
}

function isPointInPolygon(px, py, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        let xi = poly[i].x, yi = poly[i].y;
        let xj = poly[j].x, yj = poly[j].y;
        let intersect = ((yi > py) !== (yj > py))
            && (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function distToSegmentSquared(px, py, vx, vy, wx, wy) {
    let l2 = (wx - vx) * (wx - vx) + (wy - vy) * (wy - vy);
    if (l2 === 0) return (px - vx) * (px - vx) + (py - vy) * (py - vy);
    let t = ((px - vx) * (wx - vx) + (py - vy) * (wy - vy)) / l2;
    t = Math.max(0, Math.min(1, t));
    return (px - (vx + t * (wx - vx))) ** 2 + (py - (vy + t * (wy - vy))) ** 2;
}

function collidesWithPit(px, py, pr) {
    for (let p of pits) {
        if (!p.points) continue;
        
        // Quick bounds check (p.r is roughly 80% of original radius scaling)
        if (Math.hypot(px - p.x, py - p.y) > p.r * 2 + pr) continue;

        if (isPointInPolygon(px, py, p.points)) return true;

        for (let i = 0, j = p.points.length - 1; i < p.points.length; j = i++) {
            let distSq = distToSegmentSquared(px, py, p.points[j].x, p.points[j].y, p.points[i].x, p.points[i].y);
            if (distSq <= pr * pr) return true;
        }
    }
    return false;
}

function getRoomId(px, py) {
    for (let r of roofs) {
        // give a 20px padding (WT) to the room detection so doorways count as being inside the room
        if (px > r.x - 20 && px < r.x + r.w + 20 && py > r.y - 20 && py < r.y + r.h + 20) {
            return r.id;
        }
    }
    return null;
}
// ==========================

// Game State
let players = {};
let myId = null;
let currentRoomCode = null;
let currentState = 'MENU';
let myRole = 'crewmate';
let hostId = null;
let completedTasks = new Set(); // task IDs completed by THIS player
let bodies = []; // { x, y, color, name, role } - persisted dead body positions
let myTaskIds = null; // Set of 7 task IDs assigned to this player

function assignMyTasks() {
    const all = TASKS.map(t => t.id);
    // Fisher-Yates shuffle then take first 7
    for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
    }
    myTaskIds = new Set(all.slice(0, 7));
    // Reset completion state for new game
    completedTasks = new Set();
    TASKS.forEach(t => { t.done = false; });
}

// Input Handling
const keys = { w: false, a: false, s: false, d: false, space: false };
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (keys.hasOwnProperty(key)) keys[key] = true;
  if (e.code === 'Space' && !actionBtn.classList.contains('hidden')) {
     triggerClub();
  }
});
document.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  if (keys.hasOwnProperty(key)) keys[key] = false;
});

let swingAnim = 0; // 0 to 1 for caveman club swing

// ==== Socket Events ====

socket.on('connect', () => { myId = socket.id; });

socket.on('joinError', (msg) => {
    errorMsg.innerText = msg;
});

socket.on('roomCreated', (data) => {
    currentRoomCode = data.code;
    currentRoomCodeText.innerText = currentRoomCode;
    currentState = 'LOBBY';
    updateScreenState();
});

socket.on('roomJoined', (data) => {
    currentRoomCode = data.code;
    currentRoomCodeText.innerText = currentRoomCode;
    currentState = 'LOBBY';
    errorMsg.innerText = '';
    updateScreenState();
});

socket.on('roomUpdate', (roomData) => {
    players = roomData.players;
    hostId = roomData.hostId;
    
    // If we transition to playing
    if (currentState === 'LOBBY' && roomData.state === 'PLAYING') {
       currentState = 'PLAYING';
       myRole = players[myId].role;
       updateScreenState();
    }
    
    updateLobbyUI();
});

socket.on('hostChanged', (newHostId) => {
    hostId = newHostId;
    updateLobbyUI();
});

socket.on('playerDisconnected', (id) => {
    delete players[id];
    updateLobbyUI();
});

socket.on('playerMoved', (data) => {
    if (players[data.id]) {
      players[data.id].x = data.player.x;
      players[data.id].y = data.player.y;
      players[data.id].flipX = data.player.flipX;
      players[data.id].isMoving = data.player.isMoving;
    }
});

socket.on('gameStarted', (serverPlayers) => {
    players = serverPlayers;
    bodies = []; // clear bodies from any previous game
    currentState = 'PLAYING';
    myRole = players[myId].role;
    if (myRole === 'crewmate') assignMyTasks();
    updateScreenState();
});

socket.on('playerClubbed', (data) => {
    // Support both old string and new object format
    const id = typeof data === 'string' ? data : data.id;
    if (players[id]) {
      const p = players[id];
      // Save the body at the location of death
      bodies.push({
        x: typeof data === 'object' && data.deathX !== undefined ? data.deathX : p.x,
        y: typeof data === 'object' && data.deathY !== undefined ? data.deathY : p.y,
        color: p.color,
        name: p.name,
        role: p.role
      });
      p.isDead = true;
      checkWinCondition();
    }
});

socket.on('taskCompleted', ({ taskId, playerId }) => {
    // Each player manages their own completedTasks locally.
    // This event is kept for future extension (e.g. shared progress bar).
});

socket.on('crewmatesWinTasks', () => {
    currentState = 'GAMEOVER';
    endText.innerText = '✅ Time Travelers Win! All tasks completed!';
    endText.style.color = '#2ecc71';
    updateScreenState();
});

// ==== Event Listeners ====

createBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    socket.emit('createRoom', name);
});

joinBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    const code = roomCodeInput.value.trim();
    if (code.length === 4) {
        socket.emit('joinRoom', { code, name });
    } else {
        errorMsg.innerText = 'Code must be 4 letters';
    }
});

startBtn.addEventListener('click', () => {
    socket.emit('startGame');
});

restartBtn.addEventListener('click', () => {
    location.reload(); 
});

actionBtn.addEventListener('click', triggerClub);

// ==== Game Logic ====

function triggerClub() {
   if (myRole === 'impostor' && players[myId] && !players[myId].isDead) {
      swingAnim = 1; 
      
      let closestId = null;
      let closestDist = Infinity;
      const me = players[myId];
      
      for(let id in players) {
          if (id === myId) continue;
          const p = players[id];
          if (!p.isDead && p.role === 'crewmate') {
              const dist = Math.hypot(me.x - p.x, me.y - p.y);
              if (dist < 100 && dist < closestDist) {
                  closestDist = dist;
                  closestId = id;
              }
          }
      }
      if (closestId) {
          socket.emit('clubPlayer', closestId);
      }
   }
}

function updateScreenState() {
  mainMenu.classList.add('hidden');
  lobbyScreen.classList.add('hidden');
  gameUi.classList.add('hidden');
  endScreen.classList.add('hidden');

  if (currentState === 'MENU') {
      mainMenu.classList.remove('hidden');
  } 
  else if (currentState === 'LOBBY') {
      lobbyScreen.classList.remove('hidden');
      updateLobbyUI();
  } 
  else if (currentState === 'PLAYING') {
      gameUi.classList.remove('hidden');
      
      roleText.innerText = myRole === 'impostor' ? 'Caveman (Impostor)' : 'Time Traveler (Crewmate)';
      roleText.style.color = myRole === 'impostor' ? '#c0392b' : '#3498db';
      
      if (myRole === 'impostor') actionBtn.classList.remove('hidden');
      else actionBtn.classList.add('hidden');
  } 
  else if (currentState === 'GAMEOVER') {
      endScreen.classList.remove('hidden');
  }
}

function updateLobbyUI() {
    if (currentState !== 'LOBBY') return;
    
    playerListDiv.innerHTML = '';
    let playerCount = 0;
    
    for (let id in players) {
        playerCount++;
        const p = players[id];
        let tag = '';
        if (id === myId) tag += ' (You)';
        if (id === hostId) tag += ' 👑 HOST';
        
        playerListDiv.innerHTML += `<div style="padding: 5px 0;"><span style="display:inline-block;width:12px;height:12px;background:${p.color};border-radius:50%;margin-right:8px;vertical-align:middle;"></span>${p.name}${tag}</div>`;
    }
    
    if (myId === hostId) {
        hostStatus.innerText = "You are the Host.";
        hostControls.classList.remove('hidden');
        waitMsg.classList.add('hidden');
        
        if (playerCount >= 4) {
             startBtn.disabled = false;
             startBtn.innerText = "Start Game";
        } else {
             startBtn.disabled = true;
             startBtn.innerText = `Start Game (Need ${4 - playerCount} more player${(4-playerCount) === 1 ? '' : 's'})`;
        }
    } else {
        hostStatus.innerText = "";
        hostControls.classList.add('hidden');
        waitMsg.classList.remove('hidden');
    }
}

function checkWinCondition() {
    let aliveCrew = 0;
    let aliveImpostors = 0;
    for(let id in players) {
        if (!players[id].isDead) {
            if (players[id].role === 'crewmate') aliveCrew++;
            else aliveImpostors++;
        }
    }
    
    if (aliveCrew === 0) {
        currentState = 'GAMEOVER';
        endText.innerText = "Cavemen Win! All Time Travelers eliminated.";
        endText.style.color = "#c0392b";
        updateScreenState();
    } else if (aliveImpostors === 0) {
        currentState = 'GAMEOVER';
        endText.innerText = "Time Travelers Win! All Cavemen defeated.";
        endText.style.color = "#3498db";
        updateScreenState();
    }
}

// Check if ALL alive crewmates have finished their 7 tasks
function checkTaskWinCondition() {
    if (myRole !== 'crewmate') return;
    if (!myTaskIds) return;
    // If this player has completed all their tasks
    if (completedTasks.size >= 7) {
        socket.emit('allTasksDone'); // tell server this crewmate is done
    }
}

// ==== Render Loop ====

let lastTime = Date.now();
function gameLoop() {
  const now = Date.now();
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  if (currentState === 'PLAYING') {
    updateLocalPlayer(dt);
  }
  
  if (swingAnim > 0) {
      swingAnim -= dt * 5; 
      if (swingAnim < 0) swingAnim = 0;
  }

  drawGame(now);
  requestAnimationFrame(gameLoop);
}

const SPEED = 200;
const GHOST_SPEED = 280;

function updateLocalPlayer(dt) {
  if (!players[myId]) return;
  if (window.taskModalActive) return; // freeze movement during minigame
  const me = players[myId];
  const isGhost = me.isDead;
  
  let dx = 0; let dy = 0;
  if (keys.w) dy -= 1;
  if (keys.s) dy += 1;
  if (keys.a) dx -= 1;
  if (keys.d) dx += 1;

  if (dx !== 0 || dy !== 0) {
    const length = Math.hypot(dx, dy);
    dx /= length; dy /= length;
    const speed = isGhost ? GHOST_SPEED : SPEED;
    
    let newX = me.x;
    let newY = me.y;
    
    if (isGhost) {
      // Ghosts pass through everything
      newX += dx * speed * dt;
      newY += dy * speed * dt;
    } else {
      if (dx !== 0) {
          newX += dx * speed * dt;
          if (collidesWithWall(newX, me.y, 16) || collidesWithPit(newX, me.y, 16)) newX = me.x;
      }
      if (dy !== 0) {
          newY += dy * speed * dt;
          if (collidesWithWall(newX, newY, 16) || collidesWithPit(newX, newY, 16)) newY = me.y;
      }
    }
    
    me.x = Math.max(20, Math.min(MAP_WIDTH - 20, newX));
    me.y = Math.max(20, Math.min(MAP_HEIGHT - 20, newY));
    me.isMoving = true;
    if (dx < 0) me.flipX = true;
    else if (dx > 0) me.flipX = false;
    
    socket.emit('playerMovement', { x: me.x, y: me.y, flipX: me.flipX, isMoving: true });
  } else {
      if (me.isMoving) {
          me.isMoving = false;
          socket.emit('playerMovement', { x: me.x, y: me.y, flipX: me.flipX, isMoving: false });
      }
  }

  // Task proximity detection (only alive crewmates with assigned tasks)
  if (!isGhost && myRole === 'crewmate' && myTaskIds) {
    for (let task of TASKS) {
      if (!myTaskIds.has(task.id)) continue; // only assigned tasks
      if (completedTasks.has(task.id)) continue;
      if (Math.hypot(me.x - task.x, me.y - task.y) < 50) {
        showTaskPrompt(task);
        return;
      }
    }
    hideTaskPrompt();
  }
}

function drawGame(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (currentState !== 'PLAYING' && currentState !== 'GAMEOVER') return;

  const me = players[myId];
  let camX = 0, camY = 0;
  if (me) {
     camX = me.x - canvas.width / 2;
     camY = me.y - canvas.height / 2;
     camX = Math.max(0, Math.min(MAP_WIDTH - canvas.width, camX));
     camY = Math.max(0, Math.min(MAP_HEIGHT - canvas.height, camY));
  }
  
  ctx.save();
  ctx.translate(-camX, -camY);

  ctx.strokeStyle = '#2ecc71';
  ctx.lineWidth = 2;
  
  // To avoid drawing massive grids, just draw the whole thing
  for(let i = 0; i <= MAP_WIDTH; i+=50) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, MAP_HEIGHT); ctx.stroke();
  }
  for(let i = 0; i <= MAP_HEIGHT; i+=50) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(MAP_WIDTH, i); ctx.stroke();
  }

  // Draw boundary wall
  ctx.strokeStyle = '#1abc9c';
  ctx.lineWidth = 10;
  ctx.strokeRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
  
  // Draw Pits
  ctx.fillStyle = '#1c130d';
  ctx.strokeStyle = '#0a0705';
  ctx.lineWidth = 5;
  for (let p of pits) {
      if (p.points) {
         ctx.beginPath();
         ctx.moveTo(p.points[0].x, p.points[0].y);
         for(let i=1; i<p.points.length; i++) ctx.lineTo(p.points[i].x, p.points[i].y);
         ctx.closePath();
         ctx.fill();
         ctx.stroke();
      }
  }

  // Draw Doors (Floor Mats)
  ctx.fillStyle = '#8B4513';
  for (let d of doors) {
      ctx.fillRect(d.x, d.y, d.w, d.h);
  }

  // Draw Walls (interiors)
  ctx.fillStyle = '#95a5a6';
  ctx.strokeStyle = '#7f8c8d';
  ctx.lineWidth = 2;
  for (let w of walls) {
      ctx.fillRect(w.x, w.y, w.w, w.h);
      ctx.strokeRect(w.x, w.y, w.w, w.h);
  }

  for (let id in players) {
    const p = players[id];
    const isMe = id === myId;
    const amIDead = players[myId] && players[myId].isDead;
    // Ghosts are only visible to dead players (or themselves)
    if (p.isDead && !amIDead && !isMe) continue;
    if (!p.isDead) {
      drawPlayer(p, isMe, time);
    } else {
      drawGhost(p, isMe, time);
    }
  }

  // Draw dead bodies (always visible to everyone)
  for (let body of bodies) {
    drawDeadBody(body);
  }
  
  // Draw tasks (only for alive crewmates and ghosts of crewmates)
  if (myRole === 'crewmate' || (players[myId] && players[myId].isDead)) {
    drawTasks();
  }
  
  // Draw Roofs for Vision Blocking (Fog of War)
  // Ghosts see through all roofs
  const amIDead = me && me.isDead;
  let myRoomId = (!amIDead && me) ? getRoomId(me.x, me.y) : null;
  for (let r of roofs) {
      if (amIDead) {
          // Ghost: draw roof at 15% opacity so map is still visible but distinct
          ctx.fillStyle = 'rgba(0,0,0,0.15)';
          ctx.fillRect(r.x, r.y, r.w, r.h);
      } else if (r.id !== myRoomId) {
          ctx.fillStyle = r.color;
          ctx.fillRect(r.x, r.y, r.w, r.h);
      } else {
          ctx.fillStyle = 'rgba(0,0,0,0.1)';
          ctx.fillRect(r.x, r.y, r.w, r.h);
      }
  }

  ctx.restore();

  // Task HUD is drawn in screen-space (after world restore)
  drawTaskHUD();
}

function drawPlayer(p, isMe, time) {
  let bob = p.isMoving ? Math.abs(Math.sin(time * 0.01)) * 5 : 0;
  ctx.save();
  ctx.translate(p.x, p.y - bob);
  if (p.flipX) ctx.scale(-1, 1);

  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.arc(0, -10, 16, Math.PI, 0);
  ctx.lineTo(16, 10);
  ctx.arc(0, 10, 16, 0, Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000';
  ctx.stroke();

  if (p.role === 'impostor') {
      ctx.fillStyle = '#8e44ad';
      ctx.fillRect(-16, 0, 32, 12);
      ctx.save();
      ctx.translate(15, 5);
      if (isMe && swingAnim > 0) ctx.rotate(Math.PI / 2 * swingAnim);
      else ctx.rotate(-Math.PI / 6);
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.arc(0, -20, 6, 0, Math.PI*2);
      ctx.lineTo(-3, 0); ctx.lineTo(-6, -20);
      ctx.lineTo(6, -20); ctx.lineTo(3, 0);
      ctx.fill(); ctx.stroke();
      ctx.restore();
      ctx.fillStyle = '#000';
      ctx.fillRect(2, -12, 10, 3);
      ctx.beginPath(); ctx.arc(5, -8, 2, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(10, -8, 2, 0, Math.PI*2); ctx.fill();
  } else {
      ctx.fillStyle = '#3498db';
      ctx.beginPath(); ctx.roundRect(0, -15, 18, 12, 4); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = '#7f8c8d';
      ctx.fillRect(-22, -8, 8, 20); ctx.strokeRect(-22, -8, 8, 20);
      ctx.fillStyle = '#1abc9c';
      ctx.beginPath(); ctx.arc(-18, 5, 2, 0, Math.PI*2); ctx.fill();
  }
  ctx.restore();

  ctx.fillStyle = 'white';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(p.name, p.x, p.y - 45 - bob);
}

// Draw the ghost (dead player that can still move)
function drawGhost(p, isMe, time) {
  const bob = Math.sin(Date.now() * 0.003) * 4;
  ctx.save();
  ctx.translate(p.x, p.y + bob);
  if (p.flipX) ctx.scale(-1, 1);
  ctx.globalAlpha = 0.55;

  // Ghostly white body
  ctx.fillStyle = '#dfe6e9';
  ctx.beginPath();
  ctx.arc(0, -10, 16, Math.PI, 0);
  ctx.lineTo(16, 14);
  ctx.arc(10, 10, 6, 0, Math.PI);
  ctx.arc(0,  10, 6, 0, Math.PI);
  ctx.arc(-10,10, 6, 0, Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#b2bec3';
  ctx.stroke();

  // X eyes
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = '#636e72';
  ctx.lineWidth = 2;
  const drawX = (ox, oy) => {
    ctx.beginPath(); ctx.moveTo(ox-4, oy-4); ctx.lineTo(ox+4, oy+4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+4, oy-4); ctx.lineTo(ox-4, oy+4); ctx.stroke();
  };
  drawX(-6, -12); drawX(6, -12);

  ctx.restore();

  // Ghost nametag (only visible to dead players — caller filters)
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = '#dfe6e9';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('👻 ' + p.name, p.x, p.y - 38 + bob);
  ctx.restore();
}

// Draw a sideways corpse at the death location
function drawDeadBody(body) {
  ctx.save();
  ctx.translate(body.x, body.y);
  ctx.rotate(Math.PI / 2); // lay on side

  ctx.fillStyle = body.color;
  ctx.beginPath();
  ctx.arc(0, -10, 16, Math.PI, 0);
  ctx.lineTo(16, 10);
  ctx.arc(0, 10, 16, 0, Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000';
  ctx.stroke();

  // X eyes
  ctx.fillStyle = '#000';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  const drawX = (ox, oy) => {
    ctx.beginPath(); ctx.moveTo(ox-3,oy-3); ctx.lineTo(ox+3,oy+3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+3,oy-3); ctx.lineTo(ox-3,oy+3); ctx.stroke();
  };
  drawX(-6, -12); drawX(6, -12);
  ctx.restore();

  // Name label above corpse
  ctx.save();
  ctx.fillStyle = '#e74c3c';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('💀 ' + body.name, body.x, body.y - 28);
  ctx.restore();
}

// Draw task markers on the map
function drawTasks() {
  if (!myTaskIds) return; // tasks not assigned yet
  const me = players[myId];

  for (let task of TASKS) {
    if (!myTaskIds.has(task.id)) continue; // not assigned to this player
    if (completedTasks.has(task.id)) {
      // Draw faint checkmark for completed tasks
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = '#2ecc71';
      ctx.beginPath();
      ctx.arc(task.x, task.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✓', task.x, task.y + 1);
      ctx.restore();
      continue;
    }

    const nearby = me && Math.hypot(me.x - task.x, me.y - task.y) < 50;
    
    ctx.save();
    ctx.translate(task.x, task.y);
    if (nearby) {
      const pulse = 0.6 + 0.4 * Math.sin(Date.now() * 0.008);
      ctx.shadowColor = '#f1c40f';
      ctx.shadowBlur = 20 * pulse;
    }
    ctx.fillStyle = nearby ? '#f1c40f' : '#f39c12';
    ctx.beginPath();
    ctx.arc(0, 0, nearby ? 14 : 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e67e22';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('!', 0, 1);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = '#f1c40f';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(task.label, task.x, task.y - 18);
    ctx.restore();
  }
}

// === Task UI ===
let shownTaskId = null;
function showTaskPrompt(task) {
  if (shownTaskId === task.id) return;
  shownTaskId = task.id;
  // Show a quick F-key prompt on the canvas (drawn next frame)
}
function hideTaskPrompt() {
  shownTaskId = null;
}

// Override keydown for task interaction
document.addEventListener('keydown', (e) => {
  if (e.code === 'KeyF' && shownTaskId) {
    const task = TASKS.find(t => t.id === shownTaskId);
    if (task && !task.done && !completedTasks.has(task.id)) {
      task.done = true;
      completedTasks.add(task.id);
      socket.emit('taskComplete', task.id);
      shownTaskId = null;
    }
  }
});

// Render the task HUD (task prompt + progress bar)
function drawTaskHUD() {
  // Progress counter for crewmates
  if (myRole === 'crewmate' && myTaskIds && currentState === 'PLAYING') {
    const done = completedTasks.size;
    const total = 7;
    const barW = 160;
    const barH = 14;
    const bx = 10;
    const by = 10;

    ctx.save();
    // Background pill
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath();
    ctx.roundRect(bx, by, barW + 100, 34, 8);
    ctx.fill();

    // Label
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Tasks: ${done} / ${total}`, bx + 8, by + 8);

    // Track
    ctx.fillStyle = '#2c2c4a';
    ctx.beginPath();
    ctx.roundRect(bx + 8, by + 18, barW, barH, 4);
    ctx.fill();

    // Fill
    const fillW = Math.min(barW, (done / total) * barW);
    if (fillW > 0) {
      const gradient = ctx.createLinearGradient(bx + 8, 0, bx + 8 + barW, 0);
      gradient.addColorStop(0, '#27ae60');
      gradient.addColorStop(1, '#2ecc71');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(bx + 8, by + 18, fillW, barH, 4);
      ctx.fill();
    }
    ctx.restore();
  }

  // [F] prompt when near a task
  if (!shownTaskId) return;
  const task = TASKS.find(t => t.id === shownTaskId);
  if (!task || completedTasks.has(task.id)) return;
  
  const cx = canvas.width / 2;
  const cy = canvas.height - 80;
  
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.beginPath();
  ctx.roundRect(cx - 150, cy - 22, 300, 44, 10);
  ctx.fill();
  ctx.fillStyle = '#f1c40f';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`[F] to start: ${task.label}`, cx, cy);
  ctx.restore();
}

requestAnimationFrame(gameLoop);
