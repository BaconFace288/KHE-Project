const socket = io();

// UI Elements
const mainMenu = document.getElementById('main-menu');
const lobbyScreen = document.getElementById('lobby-screen');
const gameUi = document.getElementById('game-ui');
const endScreen = document.getElementById('end-screen');
const landingPage = document.getElementById('landing-page');
const playBtn = document.getElementById('play-btn');
const infoCaveman = document.getElementById('info-caveman');
const infoAgent = document.getElementById('info-agent');
const roleModal = document.getElementById('role-modal');
const roleModalIcon = document.getElementById('role-modal-icon');
const roleModalTitle = document.getElementById('role-modal-title');
const roleModalBody = document.getElementById('role-modal-body');
const roleModalClose = document.getElementById('role-modal-close');
const infoLore = document.getElementById('info-lore');
const loreModal = document.getElementById('lore-modal');
const loreModalBody = document.getElementById('lore-modal-body');
const loreModalClose = document.getElementById('lore-modal-close');

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

// Emergency meeting button (center of map)
// r = visual button radius, collisionR = physical block radius (includes pedestal)
const EMERGENCY_BTN = { x: 1500, y: 1490, r: 22, collisionR: 36 };

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
let currentState = 'LANDING';
let myRole = 'crewmate';
let hostId = null;
let completedTasks = new Set(); // task IDs completed by THIS player
let nearbyBody = null; // body object player is standing near
const SWING_COOLDOWN = 20000; // 20 second cooldown for caveman swing
let lastSwingTime = 0; 
let introActive = false; // blocks movement/actions during cinematic intro
if (!window.hasOwnProperty('taskModalActive')) window.taskModalActive = false;

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

function handleKey(e, isDown) {
  const code = e.code;
  if (code === 'KeyW' || code === 'ArrowUp') keys.w = isDown;
  if (code === 'KeyS' || code === 'ArrowDown') keys.s = isDown;
  if (code === 'KeyA' || code === 'ArrowLeft') keys.a = isDown;
  if (code === 'KeyD' || code === 'ArrowRight') keys.d = isDown;
  if (code === 'Space') {
      keys.space = isDown;
      if (isDown && !actionBtn.classList.contains('hidden')) {
          triggerClub();
      }
  }
}

document.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  handleKey(e, true);
});

document.addEventListener('keyup', (e) => {
  handleKey(e, false);
});

let swingAnim = 0; // 0 to 1 for caveman club swing

// [E] = Report dead body near player
document.addEventListener('keydown', (e) => {
  if (e.code === 'KeyE' && currentState === 'PLAYING' && !window.taskModalActive) {
    const me = players[myId];
    if (!me || me.isDead || !nearbyBody) return;
    if (nearbyBody.ejected || nearbyBody.reported) return; // safety guard
    socket.emit('callMeeting', { type: 'report', bodyName: nearbyBody.name });
  }
  // [Q] = Emergency meeting (must be near button)
  if (e.code === 'KeyQ' && currentState === 'PLAYING' && !window.taskModalActive) {
    const me = players[myId];
    if (!me || me.isDead) return;
    if (Math.hypot(me.x - EMERGENCY_BTN.x, me.y - EMERGENCY_BTN.y) < EMERGENCY_BTN.r + 60) {
      socket.emit('callMeeting', { type: 'emergency' });
    }
  }
});

// Canvas click → emergency button
canvas.addEventListener('click', (e) => {
  if (currentState !== 'PLAYING' || window.taskModalActive) return;
  const me = players[myId];
  if (!me || me.isDead) return;
  if (Math.hypot(me.x - EMERGENCY_BTN.x, me.y - EMERGENCY_BTN.y) > EMERGENCY_BTN.r + 60) return;
  const rect = canvas.getBoundingClientRect();
  const camX = Math.max(0, Math.min(MAP_WIDTH - canvas.width, me.x - canvas.width / 2));
  const camY = Math.max(0, Math.min(MAP_HEIGHT - canvas.height, me.y - canvas.height / 2));
  const wx = (e.clientX - rect.left) + camX;
  const wy = (e.clientY - rect.top) + camY;
  if (Math.hypot(wx - EMERGENCY_BTN.x, wy - EMERGENCY_BTN.y) < EMERGENCY_BTN.r) {
    socket.emit('callMeeting', { type: 'emergency' });
  }
});


// ==== Socket Events ====

socket.on('connect', () => { 
    myId = socket.id; 
    // Auto re-join if we were already in a room (tab backgrounding/refresh)
    if (currentRoomCode && myName) {
        socket.emit('joinRoom', { code: currentRoomCode, name: myName });
    }
});

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
    
    // If we transition to playing (e.g. late join or game start)
    if (currentState === 'LOBBY' && roomData.state === 'PLAYING') {
       handleGameStart();
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

socket.on('gameStarted', (payload) => {
    if (currentState === 'PLAYING') return; // already handled by roomUpdate
    players = payload.players || payload; // fallback for old schema
    handleGameStart();
});

function handleGameStart() {
    currentState = 'PLAYING'; 
    updateScreenState();
    
    bodies = [];
    
    if (players[myId]) {
        myRole = players[myId].role;
        if (myRole === 'crewmate') assignMyTasks();
        updateScreenState();
        if (!introActive) showRoleIntro(myRole);
    }
}

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

playBtn.addEventListener('click', () => {
    currentState = 'MENU';
    updateScreenState();
});

infoCaveman.addEventListener('click', () => showRoleHandbook('impostor'));
infoAgent.addEventListener('click', () => showRoleHandbook('crewmate'));
roleModalClose.addEventListener('click', () => { roleModal.classList.add('hidden'); });
infoLore.addEventListener('click', showLoreModal);
loreModalClose.addEventListener('click', () => { loreModal.classList.add('hidden'); });

actionBtn.addEventListener('click', triggerClub);

// ==== Game Logic ====

function triggerClub() {
   if (introActive) return;
   if (myRole === 'impostor' && players[myId] && !players[myId].isDead) {
      const now = Date.now();
      if (now - lastSwingTime < SWING_COOLDOWN) return; // on cooldown
      
      lastSwingTime = now;
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
  landingPage.classList.add('hidden');
  mainMenu.classList.add('hidden');
  lobbyScreen.classList.add('hidden');
  gameUi.classList.add('hidden');
  endScreen.classList.add('hidden');

  if (currentState === 'LANDING') {
      landingPage.classList.remove('hidden');
  }
  else if (currentState === 'MENU') {
      mainMenu.classList.remove('hidden');
  } 
  else if (currentState === 'LOBBY') {
      lobbyScreen.classList.remove('hidden');
      updateLobbyUI();
  } 
  else if (currentState === 'PLAYING') {
      gameUi.classList.remove('hidden');
      
      roleText.innerText = myRole === 'impostor' ? 'Caveman' : 'Time Traveler';
      roleText.style.color = myRole === 'impostor' ? '#c0392b' : '#3498db';
      
      if (myRole === 'impostor') actionBtn.classList.remove('hidden');
      else actionBtn.classList.add('hidden');
  } 
  else if (currentState === 'GAMEOVER') {
      endScreen.classList.remove('hidden');
  }
}

function showRoleHandbook(role) {
    roleModal.classList.remove('hidden');
    if (role === 'impostor') {
        roleModalIcon.innerText = '🍖';
        roleModalTitle.innerText = 'Caveman Guide';
        roleModalBody.innerHTML = `
            <div class="strategy-section">
                <span class="strategy-title">Objective</span>
                <p class="strategy-text">You are the primal protector. Your goal is to root out and eliminate the "Metal-Walkers" (Agents) who have invaded your era.</p>
            </div>
            <div class="strategy-section">
                <span class="strategy-title">Primal Combat</span>
                <p class="strategy-text">Use your <b>Club [Space]</b> to eliminate players. Be careful: swinging has a <b>20-second cooldown</b>. If you miss, you'll be vulnerable and suspicious!</p>
            </div>
            <div class="strategy-section">
                <span class="strategy-title">Stealth & Sabotage</span>
                <p class="strategy-text">Blend in by pretending to do tasks. Use the terrain to corner Agents alone. Your win condition is to eliminate all Time Travelers.</p>
            </div>
        `;
    } else {
        roleModalIcon.innerText = '⌚';
        roleModalTitle.innerText = 'Time Traveler Guide';
        roleModalBody.innerHTML = `
            <div class="strategy-section">
                <span class="strategy-title">Objective</span>
                <p class="strategy-text">You are a traveler adrift in the past. Your goal is to complete all technical repairs and survive the hunt to restore the timeline.</p>
            </div>
            <div class="strategy-section">
                <span class="strategy-title">Repairs & Logic</span>
                <p class="strategy-text">Find locations marked with <b>⚙️</b> and use <b>[E]</b> to perform repairs. You'll need to solve both physical minigames and logic/coding puzzles.</p>
            </div>
            <div class="strategy-section">
                <span class="strategy-title">Survival</span>
                <p class="strategy-text">Stay in groups. Watch for cavemen who are "faking" tasks or following you too closely. Complete all tasks to win immediately.</p>
            </div>
        `;
    }
}

function showLoreModal() {
  loreModal.classList.remove('hidden');
  loreModalBody.innerHTML = `
    <p>Deep in the year 2342, the <b>Chronos Initiative</b> was formed by top-tier Secret Agents to stabilize humanity's fractured timeline. During a routine calibration of the "Portal Divide," a catastrophic tachyon surge ripped through the laboratories, opening a permanent rift to the Pleistocene Epoch. Dozens of elite Agents were pulled through the swirling neon-blue vortex, finding themselves stranded in a primitive world they were never meant to inhabit.</p>
    
    <p>The Agents arrived at a site they had abandoned centuries ago—a decaying, high-tech observation outpost originally built to monitor the ancient world. However, the mission took an immediate turn towards conflict: the local Cavemen, seeking shelter from their harsh surroundings, had already claimed the crumbling facility as their new sanctuary. To them, these "Metal-Walkers" are not scientists returning to their post, but intruders from the stars who threaten the sacred balance of their tribal home.</p>
    
    <p>One among the cavemen, known only as <b>The Peer</b>, is the tribe’s most relentless defender. Having seen the destructive power of the intruders’ strange, glowing tools, he has picked up his club to drive the invaders back through the portal. To him, this isn't a battle for history—it's a battle to protect his home, his family, and his people from the unknown invaders who have disturbed the peace of the lab-caves.</p>
    
    <p>Now, the battle for the timeline has begun. While the stranded Agents scramble to perform emergency coding repairs and gather chronological data to reopen their portal back home, <b>The Peer</b> stalks the shadows of the cave-like corridors. The Agents must work together to identify the watcher hiding among them before the club swings and another scientist is removed from history. It is a desperate race where the primitive meets the professional, and only one era will prevail.</p>
  `;
}

function showRoleIntro(role) {
  if (introActive) return; // Guard: prevent overlapping intros causing stuck flags
  
  const introOverlay = document.getElementById('role-intro');
  const roleNameEl = document.getElementById('intro-role');
  const roleImgEl = document.getElementById('intro-image');
  const roleObjEl = document.getElementById('intro-objective');

  introActive = true;
  introOverlay.classList.remove('hidden');
  introOverlay.classList.remove('fade-out');

  if (role === 'impostor') {
    roleNameEl.innerText = 'CAVEMAN';
    roleNameEl.style.color = '#c0392b'; // dark red
    roleImgEl.src = 'caveman_intro.png';
    roleObjEl.innerText = 'Sabatoge and eliminate all Time Travelers!';
  } else {
    roleNameEl.innerText = 'TIME TRAVELER';
    roleNameEl.style.color = '#3498db'; // bright blue
    roleImgEl.src = 'timetraveler_intro.png';
    roleObjEl.innerText = 'Complete all 7 tasks and find the Caveman!';
  }

  // Cinematic sequence
  setTimeout(() => {
    introOverlay.classList.add('fade-out');
    setTimeout(() => {
      introOverlay.classList.add('hidden');
      introActive = false;
    }, 1000); // match CSS fadeOut timing
  }, 3500); // 3.5s of reading time + 1s fade = 4.5s total
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
  try {
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

    // Update swing button (cooldown indicator)
    if (myRole === 'impostor' && currentState === 'PLAYING') {
        const remaining = Math.max(0, SWING_COOLDOWN - (now - lastSwingTime));
        if (remaining > 0) {
            const secs = Math.ceil(remaining / 1000);
            actionBtn.innerText = `COOLDOWN (${secs}s)`;
            actionBtn.classList.add('cooldown-state');
            actionBtn.style.opacity = '0.6';
            actionBtn.style.pointerEvents = 'none';
        } else {
            actionBtn.innerText = 'Club [Space]';
            actionBtn.classList.remove('cooldown-state');
            actionBtn.style.opacity = '1';
            actionBtn.style.pointerEvents = 'auto';
        }
    }

    drawGame(now);
  } catch (err) {
    console.error("Critical error in gameLoop, recovering...", err);
  }
  requestAnimationFrame(gameLoop);
}

const SPEED = 200;
const GHOST_SPEED = 280;

function updateLocalPlayer(dt) {
  if (!players[myId]) return;
  if (window.taskModalActive || introActive) return; // freeze movement during minigame or intro
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
          if (collidesWithWall(newX, me.y, 16) || collidesWithPit(newX, me.y, 16) ||
              Math.hypot(newX - EMERGENCY_BTN.x, me.y - EMERGENCY_BTN.y) < EMERGENCY_BTN.collisionR + 16)
            newX = me.x;
      }
      if (dy !== 0) {
          newY += dy * speed * dt;
          if (collidesWithWall(newX, newY, 16) || collidesWithPit(newX, newY, 16) ||
              Math.hypot(newX - EMERGENCY_BTN.x, newY - EMERGENCY_BTN.y) < EMERGENCY_BTN.collisionR + 16)
            newY = me.y;
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

  // Body proximity (for [E] report) — alive non-ghost players only
  // Skip ejected (voted-out) bodies and already-reported bodies
  nearbyBody = null;
  if (!isGhost) {
    for (let body of bodies) {
      if (body.ejected || body.reported) continue; // cannot report these
      if (Math.hypot(me.x - body.x, me.y - body.y) < 60) {
        nearbyBody = body;
        break;
      }
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
  
  if (me && typeof me.x === 'number' && typeof me.y === 'number') {
     camX = me.x - (canvas.width / 2);
     camY = me.y - (canvas.height / 2);
     camX = Math.max(0, Math.min(MAP_WIDTH - canvas.width, camX));
     camY = Math.max(0, Math.min(MAP_HEIGHT - canvas.height, camY));
  } else if (currentState === 'PLAYING') {
      // Fallback camera position (map center) if player data is loading
      camX = 1500 - (canvas.width / 2);
      camY = 1500 - (canvas.height / 2);
  }
  
  ctx.save();
  ctx.translate(-camX, -camY);

  // =============================================
  // GROUND — drawn every frame in PLAYING state
  // =============================================
  ctx.fillStyle = '#1a1a12';
  ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

  // Subtle dirt tile grid (50px cells with slight shade variation)
  for (let gx = 0; gx < MAP_WIDTH; gx += 50) {
    for (let gy = 0; gy < MAP_HEIGHT; gy += 50) {
      const shade = ((gx/50 + gy/50) % 2 === 0) ? 'rgba(255,255,255,0.018)' : 'rgba(0,0,0,0.06)';
      ctx.fillStyle = shade;
      ctx.fillRect(gx, gy, 50, 50);
    }
  }
  // Dirt cracklines
  ctx.strokeStyle = 'rgba(0,0,0,0.22)';
  ctx.lineWidth = 1;
  for (let gx = 0; gx <= MAP_WIDTH; gx += 50) {
    ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, MAP_HEIGHT); ctx.stroke();
  }
  for (let gy = 0; gy <= MAP_HEIGHT; gy += 50) {
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(MAP_WIDTH, gy); ctx.stroke();
  }

  // =============================================
  // DECORATIONS — rocks, grass clumps, path
  // =============================================
  drawMapDecorations(time);

  // =============================================
  // PITS — glowing abyss
  // =============================================
  for (let p of pits) {
    if (!p.points) continue;

    // Outer glow
    ctx.save();
    ctx.shadowColor = '#ff4500';
    ctx.shadowBlur = 28;

    // Pit fill — deep dark with lava glow at edges
    ctx.beginPath();
    ctx.moveTo(p.points[0].x, p.points[0].y);
    for (let i = 1; i < p.points.length; i++) ctx.lineTo(p.points[i].x, p.points[i].y);
    ctx.closePath();

    const pitGrad = ctx.createRadialGradient(p.x, p.y, p.r * 0.1, p.x, p.y, p.r * 1.3);
    pitGrad.addColorStop(0,   '#0a0508');
    pitGrad.addColorStop(0.55,'#1a0800');
    pitGrad.addColorStop(0.8, '#5c1800');
    pitGrad.addColorStop(1,   '#ff4500');
    ctx.fillStyle = pitGrad;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Animated lava rim pulse
    const pulse = 0.5 + 0.5 * Math.sin(time * 0.003);
    ctx.strokeStyle = `rgba(255,${Math.floor(80 + 60*pulse)},0,${0.6 + 0.4*pulse})`;
    ctx.lineWidth = 5;
    ctx.stroke();

    // Inner "depth" ring
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fill();

    // Lava bubble sparks
    for (let s = 0; s < 3; s++) {
      const ang = (time * 0.002 + s * 2.1) % (Math.PI * 2);
      const sr = p.r * (0.2 + 0.15 * s);
      const sx = p.x + Math.cos(ang) * sr;
      const sy = p.y + Math.sin(ang) * sr * 0.6;
      ctx.beginPath();
      ctx.arc(sx, sy, 3 + s, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,${140+s*30},0,${0.6 + 0.3*Math.sin(time*0.004+s)})`;
      ctx.fill();
    }
    ctx.restore();

    // Crumbling stone edge
    ctx.beginPath();
    ctx.moveTo(p.points[0].x, p.points[0].y);
    for (let i = 1; i < p.points.length; i++) ctx.lineTo(p.points[i].x, p.points[i].y);
    ctx.closePath();
    ctx.strokeStyle = '#5c4033';
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.strokeStyle = '#3a2416';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // =============================================
  // DOORS — stone archways with glow
  // =============================================
  for (let d of doors) {
    // Stone mat base
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(d.x - 2, d.y - 2, d.w + 4, d.h + 4);
    // Door surface
    const isWide = d.w > d.h;
    ctx.fillStyle = '#795548';
    ctx.fillRect(d.x, d.y, d.w, d.h);
    // Plank lines
    ctx.strokeStyle = '#4e342e';
    ctx.lineWidth = 2;
    if (isWide) {
      ctx.beginPath(); ctx.moveTo(d.x + d.w/3, d.y); ctx.lineTo(d.x + d.w/3, d.y + d.h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(d.x + 2*d.w/3, d.y); ctx.lineTo(d.x + 2*d.w/3, d.y + d.h); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(d.x, d.y + d.h/3); ctx.lineTo(d.x + d.w, d.y + d.h/3); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(d.x, d.y + 2*d.h/3); ctx.lineTo(d.x + d.w, d.y + 2*d.h/3); ctx.stroke();
    }
    // Door knob
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.arc(d.x + d.w/2, d.y + d.h/2, 4, 0, Math.PI * 2);
    ctx.fill();
    // Faint green glow around doorways
    ctx.shadowColor = '#00e676';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = 'rgba(0,230,118,0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(d.x - 1, d.y - 1, d.w + 2, d.h + 2);
    ctx.shadowBlur = 0;
  }

  // =============================================
  // WALLS — stone masonry with highlight
  // =============================================
  for (let w of walls) {
    const isThick = w.w >= w.h ? w.h >= 18 : w.w >= 18;
    // Wall base — dark stone
    ctx.fillStyle = '#37474f';
    ctx.fillRect(w.x, w.y, w.w, w.h);

    // Stone block lines
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 1;
    const bw = 30, bh = 20;
    if (w.w > w.h) {
      // Horizontal wall — draw horizontal block lines
      for (let bx = w.x; bx < w.x + w.w; bx += bw) {
        ctx.beginPath(); ctx.moveTo(bx, w.y); ctx.lineTo(bx, w.y + w.h); ctx.stroke();
      }
    } else {
      // Vertical wall
      for (let by = w.y; by < w.y + w.h; by += bh) {
        ctx.beginPath(); ctx.moveTo(w.x, by); ctx.lineTo(w.x + w.w, by); ctx.stroke();
      }
    }
    // Top highlight edge
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 2;
    ctx.strokeRect(w.x, w.y, w.w, w.h);
  }

  // Draw Emergency Button
  drawEmergencyButton(time);

  // =============================================
  // PLAYERS & BODIES
  // =============================================
  for (let id in players) {
    const p = players[id];
    const isMe = id === myId;
    const amIDead = players[myId] && players[myId].isDead;
    if (p.isDead && !amIDead && !isMe) continue;
    if (!p.isDead) {
      drawPlayer(p, isMe, time);
    } else {
      drawGhost(p, isMe, time);
    }
  }

  for (let body of bodies) {
    drawDeadBody(body);
  }
  
  if (myRole === 'crewmate' || (players[myId] && players[myId].isDead)) {
    drawTasks();
  }
  
  // =============================================
  // ROOFS — fog of war with improved look
  // =============================================
  const amIDead = me && me.isDead;
  let myRoomId = (!amIDead && me) ? getRoomId(me.x, me.y) : null;

  // Building config for roof styling
  const BLDG_STYLES = {
    'B1': { label: 'The Compound',  roofCol: 'rgba(40,55,70,0.95)',   windowCol: '#ffd54f', windowGlow: '#ff9800' },
    'B2': { label: 'L-Block',       roofCol: 'rgba(55,55,60,0.95)',   windowCol: '#80deea', windowGlow: '#00bcd4' },
    'B3': { label: 'The Maze',      roofCol: 'rgba(50,20,65,0.95)',   windowCol: '#ce93d8', windowGlow: '#9c27b0' },
    'B4': { label: 'Longhouse',     roofCol: 'rgba(70,35,10,0.95)',   windowCol: '#ffcc80', windowGlow: '#ff6f00' },
  };

  for (let r of roofs) {
    const bKey = r.id.slice(0, 2); // 'B1', 'B2', etc.
    const style = BLDG_STYLES[bKey] || { roofCol: 'rgba(30,30,30,0.95)', windowCol: '#fff', windowGlow: '#fff' };

    if (amIDead) {
      // Ghost: see through roof, slight tint
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.fillRect(r.x, r.y, r.w, r.h);
    } else if (r.id !== myRoomId) {
      // Closed roof — fully opaque, draw roof detail
      ctx.fillStyle = style.roofCol;
      ctx.fillRect(r.x, r.y, r.w, r.h);

      // Roof tile lines
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      for (let tx = r.x; tx < r.x + r.w; tx += 40) {
        ctx.beginPath(); ctx.moveTo(tx, r.y); ctx.lineTo(tx, r.y + r.h); ctx.stroke();
      }
      for (let ty = r.y; ty < r.y + r.h; ty += 40) {
        ctx.beginPath(); ctx.moveTo(r.x, ty); ctx.lineTo(r.x + r.w, ty); ctx.stroke();
      }

      // Windows (only draw if room is big enough)
      drawRoofWindows(r, style, time);

      // Roof border
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 3;
      ctx.strokeRect(r.x, r.y, r.w, r.h);

    } else {
      // Current room — very light tint so you can see inside
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(r.x, r.y, r.w, r.h);
    }
  }

  // Wooden building signs (placed near exterior doors)
  if (!amIDead) {
    drawWoodenSigns();
  }

  ctx.restore();

  drawTaskHUD();
}

// =============================================
// Helper: draw windows on a roof panel
// =============================================
function drawRoofWindows(r, style, time) {
  if (r.w < 80 || r.h < 80) return;
  const cols = Math.max(1, Math.floor(r.w / 100));
  const rows = Math.max(1, Math.floor(r.h / 100));
  const ww = 18, wh = 14;
  const pulse = 0.8 + 0.2 * Math.sin(time * 0.002);
  for (let c = 0; c < cols; c++) {
    for (let rr = 0; rr < rows; rr++) {
      const wx = r.x + (r.w / cols) * (c + 0.5) - ww/2;
      const wy = r.y + (r.h / rows) * (rr + 0.5) - wh/2;
      // Window frame
      ctx.fillStyle = '#263238';
      ctx.fillRect(wx - 2, wy - 2, ww + 4, wh + 4);
      // Window glass with glow
      ctx.fillStyle = style.windowCol;
      ctx.shadowColor = style.windowGlow;
      ctx.shadowBlur = 8 * pulse;
      ctx.fillRect(wx, wy, ww, wh);
      ctx.shadowBlur = 0;
      // Cross divider
      ctx.strokeStyle = '#263238';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(wx + ww/2, wy); ctx.lineTo(wx + ww/2, wy + wh); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(wx, wy + wh/2); ctx.lineTo(wx + ww, wy + wh/2); ctx.stroke();
    }
  }
}

// =============================================
// Helper: wooden signs near doors
// =============================================
const WOODEN_SIGNS = [
  // B1
  { x: 950,  y: 1500, label: 'THE COMPOUND', color: '#f39c12' },
  { x: 1720, y: 1250, label: 'THE COMPOUND', color: '#f39c12' },
  // B2
  { x: 2510, y: 750,  label: 'L-BLOCK',       color: '#00bcd4' },
  { x: 2100, y: 1400, label: 'L-BLOCK',       color: '#00bcd4' },
  // B3
  { x: 340,  y: 2150, label: 'THE MAZE',      color: '#ce93d8' },
  { x: 1100, y: 2350, label: 'THE MAZE',      color: '#ce93d8' },
  // B4
  { x: 1040, y: 2700, label: 'LONGHOUSE',     color: '#ff8f00' },
  { x: 2200, y: 2700, label: 'LONGHOUSE',     color: '#ff8f00' },
];

function drawWoodenSigns() {
  for (let s of WOODEN_SIGNS) {
    ctx.save();
    ctx.translate(s.x, s.y);

    // Sign post
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(-2, 0, 4, 30); // taller and thinner post
    ctx.strokeStyle = '#1b1100';
    ctx.lineWidth = 1;
    ctx.strokeRect(-2, 0, 4, 30);

    // Sign board
    ctx.font = 'bold 10px Courier New, monospace'; // set font first for measurement
    const tw = ctx.measureText(s.label).width + 10;
    const bh = 22;
    ctx.fillStyle = '#5d4037';
    ctx.beginPath();
    ctx.roundRect(-tw/2, -bh, tw, bh, 3);
    ctx.fill();
    ctx.strokeStyle = '#2d1d19';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Wood grain detail on board
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-tw/2 + 5, -bh + 7); ctx.lineTo(tw/2 - 5, -bh + 7);
    ctx.moveTo(-tw/2 + 8, -bh + 14); ctx.lineTo(tw/2 - 8, -bh + 14);
    ctx.stroke();

    // Text (carved look)
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = '#efebe9';
    ctx.font = 'bold 10px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.label, 0, -bh/2);
    
    ctx.restore();
  }
}

// =============================================
// Helper: static map decorations
// =============================================
const DECORATIONS = (function() {
  const rng = (seed) => { let s = seed; return () => { s = (s*1664525+1013904223)&0xffffffff; return (s>>>0)/0xffffffff; }; };
  const r = rng(42);
  const items = [];
  // Rocks scattered across the map (avoid building areas)
  for (let i = 0; i < 120; i++) {
    const x = r() * MAP_WIDTH;
    const y = r() * MAP_HEIGHT;
    // Basic avoidance of building zones
    const inB1 = x > 780 && x < 1610 && y > 780 && y < 1420;
    const inB2 = x > 1980 && x < 2420 && y > 580 && y < 1320;
    const inB3 = x > 480  && x < 1020 && y > 1980 && y < 2520;
    const inB4 = x > 1180 && x < 2120 && y > 2580 && y < 2820;
    if (inB1 || inB2 || inB3 || inB4) continue;
    const type = r() < 0.6 ? 'rock' : 'grass';
    items.push({ x, y, type, sz: 3 + r() * 10, rot: r() * Math.PI });
  }
  return items;
})();

function drawMapDecorations(time) {
  for (let d of DECORATIONS) {
    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.rotate(d.rot);
    if (d.type === 'rock') {
      ctx.fillStyle = '#3d3428';
      ctx.beginPath();
      ctx.ellipse(0, 0, d.sz, d.sz * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.beginPath();
      ctx.ellipse(-d.sz*0.2, -d.sz*0.15, d.sz*0.4, d.sz*0.25, -0.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Grass tuft
      ctx.strokeStyle = `rgba(${40+Math.floor(d.sz*3)},${80+Math.floor(d.sz*5)},${20+Math.floor(d.sz*2)},0.7)`;
      ctx.lineWidth = 1.5;
      for (let b = -1; b <= 1; b++) {
        ctx.beginPath();
        ctx.moveTo(b * d.sz * 0.35, 0);
        ctx.lineTo(b * d.sz * 0.2, -d.sz * 1.2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
}

function drawPlayer(p, isMe, time) {
  if (!p) return;
  let bob = p.isMoving ? Math.abs(Math.sin(time * 0.01)) * 5 : 0;
  ctx.save();
  ctx.translate(p.x, p.y - bob);
  if (p.flipX) ctx.scale(-1, 1);

  // --- Head (peach/skin tone) ---
  ctx.fillStyle = '#ffdbac';
  ctx.beginPath();
  ctx.arc(0, -18, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5;
  ctx.stroke();

  // --- Sunglasses ---
  ctx.fillStyle = '#1e1e1e';
  // Left lens
  ctx.beginPath(); ctx.roundRect(-9, -21, 7, 6, 2); ctx.fill();
  // Right lens
  ctx.beginPath(); ctx.roundRect(2, -21, 7, 6, 2); ctx.fill();
  // Bridge (thinner)
  ctx.strokeStyle = '#1e1e1e'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(-2, -20); ctx.lineTo(2, -20); ctx.stroke();
  
  // Shine on glasses
  ctx.fillStyle = 'white';
  ctx.beginPath(); ctx.arc(-4, -19, 1, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(5, -19, 1, 0, Math.PI * 2); ctx.fill();

  // --- Earpiece ---
  ctx.fillStyle = '#dfe6e9';
  ctx.beginPath();
  ctx.arc(p.flipX ? 10 : -10, -18, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#636e72'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(p.flipX ? 10 : -10, -16);
  ctx.bezierCurveTo(p.flipX ? 12 : -12, -12, p.flipX ? 8 : -8, -10, p.flipX ? 10 : -10, -8);
  ctx.stroke();

  // --- Suit Body (p.color is the suit color) ---
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.roundRect(-14, -8, 28, 24, 6);
  ctx.fill();
  ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5;
  ctx.stroke();

  // --- Shirt & Tie (V-neck look) ---
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(-6, -8);
  ctx.lineTo(6, -8);
  ctx.lineTo(0, 4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#000'; // black tie
  ctx.beginPath();
  ctx.moveTo(-1.5, -8);
  ctx.lineTo(1.5, -8);
  ctx.lineTo(0, 2);
  ctx.closePath();
  ctx.fill();

  // Foot movement (simplistic agent walking)
  if (p.isMoving) {
    const footBob = Math.sin(time * 0.02) * 4;
    ctx.fillStyle = '#333';
    ctx.fillRect(-10, 16 + footBob, 8, 5); // left foot
    ctx.fillRect(2, 16 - footBob, 8, 5);  // right foot
  } else {
    ctx.fillStyle = '#333';
    ctx.fillRect(-10, 16, 8, 5);
    ctx.fillRect(2, 16, 8, 5);
  }

  // --- Role Specific: Impostor Weapon (Club) ---
  if (p.role === 'impostor') {
    // Only show weapon while swinging (only for local player for now, or based on anim state)
    if (isMe && swingAnim > 0) {
      ctx.save();
      ctx.translate(14, 5);
      ctx.rotate(Math.PI / 2 * swingAnim);
      
      // Wooden club
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.arc(0, -20, 6, 0, Math.PI * 2);
      ctx.lineTo(-3, 0); ctx.lineTo(-6, -20);
      ctx.lineTo(6, -20); ctx.lineTo(3, 0);
      ctx.fill();
      ctx.strokeStyle = '#3e2723'; ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Some texture/bands
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath(); ctx.moveTo(-4, -10); ctx.lineTo(4, -10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-5, -15); ctx.lineTo(5, -15); ctx.stroke();
      
      ctx.restore();
    }
  }
  
  ctx.restore();

  // Nametag
  ctx.fillStyle = 'white';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(p.name, p.x, p.y - 48 - bob);
}

// Draw the ghost (dead player that can still move)
function drawGhost(p, isMe, time) {
  if (!p) return;
  const bob = Math.sin(Date.now() * 0.003) * 6;
  ctx.save();
  ctx.translate(p.x, p.y + bob);
  if (p.flipX) ctx.scale(-1, 1);
  ctx.globalAlpha = 0.45; // slightly more transparent

  // --- Head ---
  ctx.fillStyle = '#dfe6e9'; // ghostly skin
  ctx.beginPath();
  ctx.arc(0, -18, 12, 0, Math.PI * 2);
  ctx.fill();

  // --- Spectral Suit Jacket (desaturated p.color) ---
  // Simple desaturation by mixing with white/grey
  ctx.fillStyle = p.color;
  ctx.globalAlpha = 0.3; // extra faint for the jacket color
  ctx.beginPath();
  ctx.roundRect(-14, -8, 28, 20, { tl: 6, tr: 6, bl: 0, br: 0 });
  ctx.fill();
  
  ctx.globalAlpha = 0.45; // reset for the rest
  ctx.fillStyle = '#dfe6e9';
  ctx.beginPath();
  ctx.roundRect(-14, -8, 28, 18, { tl: 6, tr: 6, bl: 0, br: 0 }); // ghostly overlay
  ctx.fill();

  // --- Shirt & Tie (ghostly) ---
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.beginPath();
  ctx.moveTo(-6, -8); ctx.lineTo(6, -8); ctx.lineTo(0, 4); ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.beginPath();
  ctx.moveTo(-1.5, -8); ctx.lineTo(1.5, -8); ctx.lineTo(0, 2); ctx.closePath();
  ctx.fill();

  // --- Wisp tail ---
  ctx.fillStyle = '#dfe6e9';
  ctx.beginPath();
  ctx.moveTo(-14, 10);
  ctx.bezierCurveTo(-14, 25, 0, 35, 10, 25);
  ctx.bezierCurveTo(20, 15, 0, 15, 0, 10);
  ctx.closePath();
  ctx.fill();

  // --- Sunglasses ---
  ctx.fillStyle = '#1e1e1e';
  ctx.beginPath(); ctx.roundRect(-9, -21, 7, 6, 2); ctx.fill();
  ctx.beginPath(); ctx.roundRect(2, -21, 7, 6, 2); ctx.fill();
  ctx.strokeStyle = '#1e1e1e'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-2, -20); ctx.lineTo(2, -20); ctx.stroke();

  ctx.restore();

  // Ghost nametag
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = '#b2bec3';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('👻 ' + p.name, p.x, p.y - 42 + bob);
  ctx.restore();
}

// Draw a sideways corpse at the death location
function drawDeadBody(body) {
  if (!body) return;
  ctx.save();
  ctx.translate(body.x, body.y);
  ctx.rotate(Math.PI / 2.2); // flat on ground

  // Agent head with X eyes
  ctx.fillStyle = '#ffdbac';
  ctx.beginPath(); ctx.arc(0, -18, 12, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5; ctx.stroke();

  ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
  const drawX = (ox, oy) => {
    ctx.beginPath(); ctx.moveTo(ox-3, oy-3); ctx.lineTo(ox+3, oy+3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+3, oy-3); ctx.lineTo(ox-3, oy+3); ctx.stroke();
  };
  drawX(-4, -20); drawX(4, -20);

  // Agent suit
  ctx.fillStyle = body.color;
  ctx.beginPath(); ctx.roundRect(-14, -8, 28, 24, 6); ctx.fill();
  ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5; ctx.stroke();

  // Shirt/Tie
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.beginPath();
  ctx.moveTo(-6, -8); ctx.lineTo(6, -8); ctx.lineTo(0, 4);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(-1, -8); ctx.lineTo(1, -8); ctx.lineTo(0, 0);
  ctx.closePath(); ctx.fill();

  ctx.restore();

  // Name tag
  ctx.save();
  ctx.fillStyle = '#e74c3c';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('💀 ' + body.name, body.x, body.y - 34);
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

// Task UI transition logic (prompts/hides)
function showTaskPrompt(task) {
  if (shownTaskId === task.id) return;
  shownTaskId = task.id;
}
function hideTaskPrompt() {
  shownTaskId = null;
}

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
  if (shownTaskId) {
    const task = TASKS.find(t => t.id === shownTaskId);
    if (task && !completedTasks.has(task.id)) {
      const cx = canvas.width / 2;
      const cy = canvas.height - 80;
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.beginPath(); ctx.roundRect(cx - 150, cy - 22, 300, 44, 10); ctx.fill();
      ctx.fillStyle = '#f1c40f'; ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(`[F] to start: ${task.label}`, cx, cy);
      ctx.restore();
    }
  }

  // [E] prompt when near a dead body
  const me = players[myId];
  if (nearbyBody && me && !me.isDead && !window.meetingActive) {
    const cx = canvas.width / 2;
    const cy = canvas.height - 130;
    ctx.save();
    ctx.fillStyle = 'rgba(150,0,0,0.82)';
    ctx.beginPath(); ctx.roundRect(cx - 155, cy - 22, 310, 44, 10); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(`[E] Report body: ${nearbyBody.name}`, cx, cy);
    ctx.restore();
  }

  // [Q] prompt when near emergency button
  if (me && !me.isDead && !window.meetingActive &&
      Math.hypot(me.x - EMERGENCY_BTN.x, me.y - EMERGENCY_BTN.y) < EMERGENCY_BTN.r + 65) {
    const cx = canvas.width / 2;
    const cy = canvas.height - 175;
    ctx.save();
    ctx.fillStyle = 'rgba(180,30,0,0.85)';
    ctx.beginPath(); ctx.roundRect(cx - 165, cy - 22, 330, 44, 10); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('[Q] or Click — Emergency Meeting', cx, cy);
    ctx.restore();
  }
}

function drawEmergencyButton(time) {
  const b = EMERGENCY_BTN;
  const me = players[myId];
  const nearby = me && Math.hypot(me.x - b.x, me.y - b.y) < b.collisionR + 65;
  const pulse = 0.5 + 0.5 * Math.abs(Math.sin(Date.now() * 0.004));

  ctx.save();
  ctx.translate(b.x, b.y);

  // === Pedestal body (rectangular column) ===
  const pw = 28, ph = 40; // pedestal width / height
  // Side face (darker) for 3D illusion
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.moveTo(pw/2, 14);
  ctx.lineTo(pw/2 + 6, 8);
  ctx.lineTo(pw/2 + 6, 8 + ph);
  ctx.lineTo(pw/2, 14 + ph);
  ctx.closePath();
  ctx.fill();
  // Front face
  ctx.fillStyle = '#2e2e2e';
  ctx.fillRect(-pw/2, 14, pw, ph);
  ctx.strokeStyle = '#111'; ctx.lineWidth = 1.5;
  ctx.strokeRect(-pw/2, 14, pw, ph);
  // Top of pedestal
  ctx.fillStyle = '#3a3a3a';
  ctx.beginPath();
  ctx.ellipse(0, 14, pw/2 + 3, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#555'; ctx.lineWidth = 1;
  ctx.stroke();

  // === Button cap (dome on pedestal top) ===
  if (nearby) {
    ctx.shadowColor = '#e74c3c';
    ctx.shadowBlur = 22 * pulse;
  }
  // Outer rim / base of button
  ctx.fillStyle = '#7b1a1a';
  ctx.beginPath();
  ctx.ellipse(0, 12, b.r + 4, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Red dome cap
  const grad = ctx.createRadialGradient(-b.r * 0.35, -b.r * 0.5, 1, 0, 0, b.r);
  grad.addColorStop(0, '#ff8080');
  grad.addColorStop(0.45, '#e74c3c');
  grad.addColorStop(1, '#7b1a1a');
  ctx.fillStyle = grad;
  // Draw the dome as a flattened ellipse
  ctx.beginPath();
  ctx.ellipse(0, 8, b.r, b.r * 0.7, 0, Math.PI, 0); // upper arc
  ctx.ellipse(0, 12, b.r + 4, 8, 0, 0, Math.PI);     // bottom rim
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;

  // Highlight shine on button
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath();
  ctx.ellipse(-b.r * 0.3, 5, b.r * 0.4, b.r * 0.2, -0.5, 0, Math.PI * 2);
  ctx.fill();

  // "!" text on button face
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = `bold ${b.r}px Impact`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('!', 0, 8);

  ctx.restore();

  // Label
  ctx.save();
  ctx.fillStyle = nearby ? '#e74c3c' : '#7f8c8d';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText('EMERGENCY', b.x, b.y + 58);
  ctx.restore();
}

requestAnimationFrame(gameLoop);
