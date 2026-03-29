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
const audioToggle = document.getElementById('audio-toggle');
const addBotBtn = document.getElementById('add-bot-btn');

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const MAP_WIDTH = 3000;
const MAP_HEIGHT = 3000;
let currentMap = 'Alpha';
const mapSelect = document.getElementById('map-select');
const mapStatus = document.getElementById('map-status');

const MAP_THEMES = {
  'Alpha': {
    floor1: '#1e272e', floor2: '#2c3e50', floorBorder: 'rgba(255,255,255,0.05)',
    pitCol: '#0a0a0a', pitOuter: '#1a1a1a', pitEffect: 'Abyss',
    bldgLabels: ['THE COMPOUND', 'L-BLOCK', 'THE MAZE', 'LONGHOUSE', 'SOUTH-WAKE'],
    roofCols: ['rgb(40,55,70)', 'rgb(55,55,60)', 'rgb(50,20,65)', 'rgb(70,35,10)', 'rgb(30,40,50)']
  }
};

const MAP_DATA = {
  'Alpha': {
    tasks: [{x:900,y:1100,label:'⚙️ Fix Relay'},{x:1350,y:1250,label:'🔋 Charge Battery'},{x:2100,y:720,label:'📡 Align Dish'},{x:2080,y:1100,label:'🧪 Mix Solution'},{x:600,y:2100,label:'🔌 Restore Power'},{x:860,y:2100,label:'💾 Upload Data'},{x:1340,y:2690,label:'🌡️ Cool Reactor'},{x:1180,y:500,label:'⚠️ Seal Pit Crack'},{x:400,y:600,label:'🌿 Collect Samples'},{x:2200,y:1700,label:'🗺️ Survey Zone'},{x:700,y:2800,label:'🪨 Mark Boundary'},{x:2600,y:1200,label:'📦 Drop Supply'}],
    walls: [{x:780,y:780,w:20,h:640},{x:800,y:780,w:320,h:20},{x:1100,y:800,w:20,h:300},{x:1120,y:1080,w:500,h:20},{x:1600,y:1080,w:20,h:120},{x:1600,y:1300,w:20,h:120},{x:1120,y:1400,w:500,h:20},{x:1100,y:1100,w:20,h:100},{x:1100,y:1300,w:20,h:100},{x:800,y:1400,w:100,h:20},{x:1000,y:1400,w:100,h:20},{x:1980,y:580,w:440,h:20},{x:1980,y:600,w:20,h:300},{x:2400,y:600,w:20,h:100},{x:2400,y:800,w:20,h:120},{x:2200,y:900,w:200,h:20},{x:1980,y:900,w:20,h:420},{x:2200,y:920,w:20,h:380},{x:2000,y:900,w:50,h:20},{x:2150,y:900,w:50,h:20},{x:2000,y:1300,w:50,h:20},{x:2150,y:1300,w:70,h:20},{x:480,y:1980,w:540,h:20},{x:480,y:2500,w:540,h:20},{x:480,y:2000,w:20,h:100},{x:480,y:2200,w:20,h:300},{x:1000,y:1980,w:20,h:320},{x:1000,y:2400,w:20,h:100},{x:500,y:2240,w:50,h:20},{x:650,y:2240,w:200,h:20},{x:950,y:2240,w:50,h:20},{x:740,y:2000,w:20,h:50},{x:740,y:2150,w:20,h:200},{x:740,y:2450,w:20,h:50},{x:1180,y:2580,w:940,h:20},{x:1180,y:2800,w:940,h:20},{x:1180,y:2600,w:20,h:50},{x:1180,y:2750,w:20,h:50},{x:2100,y:2600,w:20,h:50},{x:2100,y:2750,w:20,h:50},{x:1490,y:2600,w:20,h:50},{x:1490,y:2750,w:20,h:50},{x:1790,y:2600,w:20,h:50},{x:1790,y:2750,w:20,h:50}],
    pits: [{x:300,y:300,r:80},{x:1000,y:500,r:120},{x:2500,y:400,r:96},{x:2700,y:2400,r:112},{x:500,y:1200,r:72},{x:1600,y:1800,r:64}],
    furniture: [{x:950,y:950,w:40,h:25},{x:2100,y:680,w:55,h:25},{x:1650,y:2700,w:120,h:60},{x:1955,y:2700,w:120,h:60}],
    roofs: [{id:'B1',x:800,y:800,w:300,h:600},{id:'B2',x:2000,y:600,w:400,h:300},{id:'B3',x:2000,y:920,w:200,h:380},{id:'B4',x:500,y:2000,w:500,h:500},{id:'B5',x:1200,y:2600,w:900,h:200}],
    doors: [{x:1095,y:1200,w:30,h:60},{x:1600,y:1180,w:20,h:80},{x:1180,y:2575,w:80,h:30},{x:1180,y:2795,w:80,h:30}]
  }
};

function drawSmoothPolygon(ctx, points) {
    if (!points || points.length < 3) return;
    ctx.beginPath();
    // Use midpoints for quadratic bezier smoothing
    let pc = { x: (points[0].x + points[points.length - 1].x) / 2, y: (points[0].y + points[points.length - 1].y) / 2 };
    ctx.moveTo(pc.x, pc.y);
    for (let i = 0; i < points.length; i++) {
        let p = points[i];
        let next = points[(i + 1) % points.length];
        let mid = { x: (p.x + next.x) / 2, y: (next.y + p.y) / 2 };
        ctx.quadraticCurveTo(p.x, p.y, mid.x, mid.y);
    }
    ctx.closePath();
    ctx.fill();
}

function collidesWithWall(px, py, pr) {
    const walls = MAP_DATA[currentMap]?.walls || MAP_DATA['Alpha'].walls;
    for (let w of walls) {
        let testX = px; let testY = py;
        if (px < w.x) testX = w.x; else if (px > w.x + w.w) testX = w.x + w.w;
        if (py < w.y) testY = w.y; else if (py > w.y + w.h) testY = w.y + w.h;
        let distX = px - testX; let distY = py - testY;
        if (Math.sqrt((distX*distX) + (distY*distY)) <= pr) return true;
    }
    return false;
}

function collidesWithProps(px, py, pr) {
    const furniture = MAP_DATA[currentMap]?.furniture || MAP_DATA['Alpha'].furniture;
    for (let it of furniture) {
        // Simple rectangular collision for furniture
        let testX = px; let testY = py;
        const halfW = it.w / 2;
        const halfH = it.h / 2;
        if (px < it.x - halfW) testX = it.x - halfW; else if (px > it.x + halfW) testX = it.x + halfW;
        if (py < it.y - halfH) testY = it.y - halfH; else if (py > it.y + halfH) testY = it.y + halfH;
        let distX = px - testX; let distY = py - testY;
        if (Math.sqrt((distX*distX) + (distY*distY)) <= pr) return true;
    }
    return false;
}

function collidesWithTasks(px, py, pr) {
    const tasks = MAP_DATA[currentMap]?.tasks || MAP_DATA['Alpha'].tasks;
    for (let t of tasks) {
        // Use a 20px radius for task object collision
        if (Math.hypot(px - t.x, py - t.y) <= pr + 20) return true;
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
    const pits = MAP_DATA[currentMap]?.pits || MAP_DATA['Alpha'].pits;
    for (let p of pits) {
        // Pits don't always have .points anymore in the new system (some are just circles)
        // If they have points, use polygon logic. Otherwise use circle logic.
        if (p.points) {
            if (isPointInPolygon(px, py, p.points)) return true;
            for (let i = 0, j = p.points.length - 1; i < p.points.length; j = i++) {
                let distSq = distToSegmentSquared(px, py, p.points[j].x, p.points[j].y, p.points[i].x, p.points[i].y);
                if (distSq <= pr * pr) return true;
            }
        } else {
            // Circle pit
            if (Math.hypot(px - p.x, py - p.y) <= pr + p.r) return true;
        }
    }
    return false;
}

function getRoomId(px, py) {
    const roofs = MAP_DATA[currentMap]?.roofs || MAP_DATA['Alpha'].roofs;
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
let myTaskIds = new Set(); // IDs of tasks assigned to this player
let nearbyBody = null; // body object player is standing near
let shownTaskId = null; // ID of the task current showing a prompt

const EMERGENCY_BTN = { x: 1500, y: 1500, r: 36, collisionR: 36 };
const DECOR_FURNITURE = []; // Deprecated: now in MAP_DATA
const DECOR_FLORA = [];     // Deprecated: now in MAP_DATA
const TASKS = [];           // Deprecated: now in MAP_DATA
window.meetingActive = false;
const SWING_COOLDOWN = 20000; // 20 second cooldown for caveman swing
let lastSwingTime = 0; 
let introActive = false; // blocks movement/actions during cinematic intro

// Persistent camera (prevents snapping to map center on frame drops)
let currentCamX = 1500 - (1000 / 2); // Default to map center initially
let currentCamY = 1500 - (1000 / 2);

function findMe() {
    if (players[myId]) return players[myId];
    // Fallback: search by name if ID flickered
    return Object.values(players).find(p => p.name === window.myName);
}
if (!window.hasOwnProperty('taskModalActive')) window.taskModalActive = false;

function assignMyTasks() {
  myTaskIds.clear();
  completedTasks.clear();
  const tasks = MAP_DATA[currentMap]?.tasks || MAP_DATA['Alpha'].tasks;
  const pool = [...tasks];
  
  // Pick 7 unique tasks
  for (let i = 0; i < 7 && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const task = pool.splice(idx, 1)[0];
    const tid = task.id || (task.label + task.x + task.y);
    task.id = tid; 
    myTaskIds.add(tid);
  }
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
    if (Math.hypot(me.x - EMERGENCY_BTN.x, me.y - EMERGENCY_BTN.y) < EMERGENCY_BTN.collisionR + 85) {
      socket.emit('callMeeting', { type: 'emergency' });
    }
  }
});

// Canvas click → emergency button
canvas.addEventListener('click', (e) => {
  if (currentState !== 'PLAYING' || window.taskModalActive) return;
  const me = players[myId];
  if (!me || me.isDead) return;
  if (Math.hypot(me.x - EMERGENCY_BTN.x, me.y - EMERGENCY_BTN.y) > EMERGENCY_BTN.collisionR + 85) return;
  const rect = canvas.getBoundingClientRect();
  const camX = Math.max(0, Math.min(MAP_WIDTH - canvas.width, me.x - canvas.width / 2));
  const camY = Math.max(0, Math.min(MAP_HEIGHT - canvas.height, me.y - canvas.height / 2));
  const wx = (e.clientX - rect.left) + camX;
  const wy = (e.clientY - rect.top) + camY;
  if (Math.hypot(wx - EMERGENCY_BTN.x, wy - EMERGENCY_BTN.y) < EMERGENCY_BTN.r + 10) {
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
    const newPlayers = roomData.players || {};
    hostId = roomData.hostId || hostId;
    currentMap = roomData.mapId || currentMap; 
    
    // Merge player data instead of replacing to prevent position snap-back
    for (let id in newPlayers) {
        if (!players[id]) {
            players[id] = newPlayers[id];
        } else {
            // Update metadata but KEEP local position if it's ME
            const p = newPlayers[id];
            players[id].role = p.role;
            players[id].isDead = p.isDead;
            players[id].color = p.color;
            players[id].name = p.name;
            players[id].isBot = p.isBot;
            
            if (id !== myId) {
                players[id].x = p.x;
                players[id].y = p.y;
                players[id].flipX = p.flipX;
                players[id].isMoving = p.isMoving;
            }
        }
    }
    
    // Remove disconnected players (but NEVER delete myself from local state)
    for (let id in players) {
        if (!newPlayers[id] && id !== myId) delete players[id];
    }
    
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
    if (data.id === myId) return; // Never snap back local player
    if (players[data.id]) {
      const p = players[data.id];
      // Track vertical direction for sprite facing
      if (data.player.y < p.y - 1) p.facingUp = true;
      else if (data.player.y > p.y + 1) p.facingUp = false;
      
      p.x = data.player.x;
      p.y = data.player.y;
      p.flipX = data.player.flipX;
      p.isMoving = data.player.isMoving;
      p.isDead = data.player.isDead;
    }
});

socket.on('mapSelected', (mapId) => {
    currentMap = mapId;
    if (mapStatus) mapStatus.innerText = `Location: Base ${mapId}`;
    if (mapSelect) mapSelect.value = mapId;
});

socket.on('gameStarted', (payload) => {
    if (currentState === 'PLAYING') return;
    players = payload.players || payload;
    currentMap = payload.mapId || currentMap; // Sync map
    handleGameStart();
});

function handleGameStart() {
    currentState = 'PLAYING'; 
    updateScreenState();
    
    bodies = [];
    
    if (players[myId]) {
        // Force sync position once on start to ensure host/players snap to hub
        myRole = players[myId].role;
        players[myId].x = players[myId].x; 
        players[myId].y = players[myId].y;
        
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

socket.on('cavemanLeftWin', () => {
    currentState = 'GAMEOVER';
    endText.innerText = 'TIME TRAVELERS WIN! The Caveman has abandoned the mission.';
    endText.style.color = '#2ecc71';
    updateScreenState();
});

socket.on('cavemenWin', () => {
    currentState = 'GAMEOVER';
    endText.innerText = '💀 CAVEMEN WIN! The Time Travelers have been eliminated.';
    endText.style.color = '#e74c3c';
    updateScreenState();
});

socket.on('crewmateWinVote', () => {
    currentState = 'GAMEOVER';
    endText.innerText = '✅ TIME TRAVELERS WIN! The Caveman has been voted out!';
    endText.style.color = '#2ecc71';
    updateScreenState();
});

// ==== Event Listeners ====

createBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (!name) return;
    window.myName = name; // Guard for identity resilience
    socket.emit('createRoom', name);
});

joinBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    const code = roomCodeInput.value.trim();
    if (code.length === 4 && name) {
        window.myName = name; // Guard for identity resilience
        socket.emit('joinRoom', { code, name });
    } else {
        errorMsg.innerText = !name ? 'Enter a name' : 'Code must be 4 letters';
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

if (audioToggle) {
  audioToggle.addEventListener('click', () => {
    const isOn = toggleAmbientMusic();
    audioToggle.innerText = isOn ? '🔊 Music: On' : '🔇 Music: Off';
    audioToggle.classList.toggle('active', isOn);
  });
}

if (addBotBtn) {
  addBotBtn.addEventListener('click', () => {
    socket.emit('addBot');
  });
}

if (mapSelect) {
  mapSelect.addEventListener('change', (e) => {
    socket.emit('selectMap', e.target.value);
  });
}

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
  const introTimer = setTimeout(() => {
    introOverlay.classList.add('fade-out');
    setTimeout(() => {
      introOverlay.classList.add('hidden');
      introActive = false;
    }, 1000); // match CSS fadeOut timing
  }, 3500); // 3.5s of reading time + 1s fade = 4.5s total

  // FINAL SAFETY: Unfreeze after 6s no matter what (e.g. if browser throttles timer or image fails)
  setTimeout(() => {
    if (introActive) {
      console.warn("Intro safety triggered: forcing unfreeze.");
      introOverlay.classList.add('hidden');
      introActive = false;
    }
  }, 6000);
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
        if (p.isBot) tag += ' (AI)';
        
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
             startBtn.innerText = `Need ${4 - playerCount} more player${(4-playerCount) === 1 ? '' : 's'}`;
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
  const me = findMe();
  if (!me) return;
  if (window.taskModalActive || introActive) return; // freeze movement during minigame or intro
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
          if (collidesWithWall(newX, me.y, 16) || collidesWithPit(newX, me.y, 16) || collidesWithProps(newX, me.y, 16) || collidesWithTasks(newX, me.y, 16) ||
              Math.hypot(newX - EMERGENCY_BTN.x, me.y - EMERGENCY_BTN.y) < EMERGENCY_BTN.collisionR + 16)
            newX = me.x;
      }
      if (dy !== 0) {
          newY += dy * speed * dt;
          if (collidesWithWall(newX, newY, 16) || collidesWithPit(newX, newY, 16) || collidesWithProps(newX, newY, 16) || collidesWithTasks(newX, newY, 16) ||
              Math.hypot(newX - EMERGENCY_BTN.x, newY - EMERGENCY_BTN.y) < EMERGENCY_BTN.collisionR + 16)
            newY = me.y;
      }
    }
    
    me.x = Math.max(20, Math.min(MAP_WIDTH - 20, newX));
    me.y = Math.max(20, Math.min(MAP_HEIGHT - 20, newY));
    me.isMoving = true;
    if (dx < 0) me.flipX = true;
    else if (dx > 0) me.flipX = false;
    
    // Throttled movement emission
    if (Date.now() % 100 < 20) {
        socket.emit('playerMovement', { x: me.x, y: me.y, flipX: me.flipX, isMoving: true });
    }
  } else {
      if (me.isMoving) {
          me.isMoving = false;
          socket.emit('playerMovement', { x: me.x, y: me.y, flipX: me.flipX, isMoving: false });
      }
  }

  // Body proximity (for [E] report) — alive non-ghost players only
  nearbyBody = null;
  if (!isGhost) {
    for (let body of bodies) {
      if (body.ejected || body.reported) continue; 
      if (Math.hypot(me.x - body.x, me.y - body.y) < 65) {
        nearbyBody = body;
        break;
      }
    }
  }

  // Task proximity detection (only alive crewmates with assigned tasks)
  let foundTask = null;
  if (myRole === 'crewmate' && myTaskIds) {
    const tasks = MAP_DATA[currentMap]?.tasks || [];
    for (let task of tasks) {
      if (myTaskIds.has(task.id) && !completedTasks.has(task.id)) {
        if (Math.hypot(me.x - task.x, me.y - task.y) < 55) {
          foundTask = task;
          break;
        }
      }
    }
  }

  if (foundTask) {
    showTaskPrompt(foundTask);
  } else {
    hideTaskPrompt();
  }
}

function drawGame(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (currentState !== 'PLAYING' && currentState !== 'GAMEOVER') return;

  const me = findMe();
  
  if (me && typeof me.x === 'number' && typeof me.y === 'number') {
     let tx = me.x - (canvas.width / 2);
     let ty = me.y - (canvas.height / 2);
     currentCamX = Math.max(0, Math.min(MAP_WIDTH - canvas.width, tx));
     currentCamY = Math.max(0, Math.min(MAP_HEIGHT - canvas.height, ty));
  }
  
  ctx.save();
  ctx.translate(-currentCamX, -currentCamY);

  // =============================================
  // GROUND — drawn every frame in PLAYING state
  // =============================================
  const theme = MAP_THEMES[currentMap] || MAP_THEMES['Alpha'];
  ctx.fillStyle = theme.floor1;
  ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

  // Subtle tile grid
  for (let gx = 0; gx < MAP_WIDTH; gx += 50) {
    for (let gy = 0; gy < MAP_HEIGHT; gy += 50) {
      const shade = ((gx/50 + gy/50) % 2 === 0) ? theme.floor2 : theme.floor1;
      ctx.fillStyle = shade;
      ctx.fillRect(gx, gy, 50, 50);
      
      ctx.strokeStyle = theme.floorBorder;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(gx, gy, 50, 50);
    }
  }

  // =============================================
  // DECORATIONS — rocks, grass clumps, etc.
  // =============================================
  drawMapDecorations(time, theme);

  // =============================================
  // PITS — Themed Hazards
  // =============================================
  const pits = MAP_DATA[currentMap]?.pits || [];
  for (let p of pits) {
    ctx.save();
    
    // Outer glow
    ctx.shadowColor = theme.pitOuter;
    ctx.shadowBlur = theme.pitEffect === 'Abyss' ? 10 : 25;

    // Pit core drawing (Polygon or Circle)
    ctx.fillStyle = theme.pitCol;
    if (p.points) {
        drawSmoothPolygon(ctx, p.points);
    } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Thematic detail: Water waves clipped to lake shape
    if (theme.pitEffect === 'Water') {
       // Build bounding box
       const bounds = p.points ? p.points.reduce((acc, pt) => ({
           minX: Math.min(acc.minX, pt.x), maxX: Math.max(acc.maxX, pt.x),
           minY: Math.min(acc.minY, pt.y), maxY: Math.max(acc.maxY, pt.y)
       }), {minX:9999,maxX:-9999,minY:9999,maxY:-9999}) : {minX:p.x-p.r, maxX:p.x+p.r, minY:p.y-p.r, maxY:p.y+p.r};

       // Clip waves strictly inside the lake shape
       ctx.save();
       if (p.points) {
           // Build clip path using smooth polygon
           ctx.beginPath();
           let firstMid = { x: (p.points[0].x + p.points[p.points.length-1].x)/2, y: (p.points[0].y + p.points[p.points.length-1].y)/2 };
           ctx.moveTo(firstMid.x, firstMid.y);
           for (let i = 0; i < p.points.length; i++) {
               let pt = p.points[i];
               let next = p.points[(i + 1) % p.points.length];
               let mid = { x: (pt.x + next.x)/2, y: (pt.y + next.y)/2 };
               ctx.quadraticCurveTo(pt.x, pt.y, mid.x, mid.y);
           }
           ctx.closePath();
           ctx.clip();
       } else {
           // Circle clip for Alpha-style circular pits
           ctx.beginPath();
           ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
           ctx.clip();
       }

       ctx.strokeStyle = 'rgba(255,255,255,0.45)';
       ctx.lineWidth = 2.5;
       for(let i = 0; i < 4; i++) {
         const move = Math.sin(time * 0.0018 + i * 1.4) * 18;
         const yPos = bounds.minY + (bounds.maxY - bounds.minY) * (0.2 + i * 0.2) + move;
         ctx.beginPath();
         ctx.moveTo(bounds.minX + 10, yPos);
         for (let x = bounds.minX + 10; x < bounds.maxX - 10; x += 50) {
             const cpx = x + 25;
             const cpy = yPos + Math.cos(time * 0.002 + x * 0.013) * 14;
             ctx.quadraticCurveTo(cpx, cpy, x + 50, yPos);
         }
         ctx.stroke();
       }
       ctx.restore();
    } else if (theme.pitEffect === 'Acid') {
       ctx.fillStyle = 'rgba(255,255,255,0.2)';
       const cx = p.x || 1500, cy = p.y || 1500, cr = p.r || 100;
       for(let i=0; i<5; i++) {
         const bubY = (time * 0.05 + i * 20) % cr;
         ctx.beginPath(); ctx.arc(cx + Math.sin(i)*cr*0.5, cy - bubY, 4, 0, Math.PI*2); ctx.fill();
       }
    }
    
    ctx.restore();
  }

  // =============================================
  // DOORS — stone archways with glow
  // =============================================
  const doors = MAP_DATA[currentMap]?.doors || [];
  for (let d of doors) {
    const isHoriz = d.w > d.h;
    // Bright floor mat — large, contrasting, clearly visible from outside
    const matPad = 18;
    ctx.fillStyle = '#f5c518'; // amber yellow
    ctx.fillRect(d.x - matPad, d.y - matPad, d.w + matPad*2, d.h + matPad*2);
    // Mat border
    ctx.strokeStyle = '#e6a817';
    ctx.lineWidth = 3;
    ctx.strokeRect(d.x - matPad, d.y - matPad, d.w + matPad*2, d.h + matPad*2);
    // Stripes across the mat
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    ctx.lineWidth = 4;
    if (isHoriz) {
      for (let sx = d.x - matPad + 8; sx < d.x + d.w + matPad; sx += 12) {
        ctx.beginPath(); ctx.moveTo(sx, d.y - matPad); ctx.lineTo(sx, d.y + d.h + matPad); ctx.stroke();
      }
    } else {
      for (let sy = d.y - matPad + 8; sy < d.y + d.h + matPad; sy += 12) {
        ctx.beginPath(); ctx.moveTo(d.x - matPad, sy); ctx.lineTo(d.x + d.w + matPad, sy); ctx.stroke();
      }
    }
    // Door panel (dark wood, inset from mat)
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(d.x - 2, d.y - 2, d.w + 4, d.h + 4);
    ctx.fillStyle = '#795548';
    ctx.fillRect(d.x, d.y, d.w, d.h);
    ctx.strokeStyle = '#4e342e';
    ctx.lineWidth = 2;
    if (isHoriz) {
      ctx.beginPath(); ctx.moveTo(d.x + d.w/3, d.y); ctx.lineTo(d.x + d.w/3, d.y + d.h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(d.x + 2*d.w/3, d.y); ctx.lineTo(d.x + 2*d.w/3, d.y + d.h); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(d.x, d.y + d.h/2); ctx.lineTo(d.x + d.w, d.y + d.h/2); ctx.stroke();
    }
    // Gold knob
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.arc(d.x + d.w/2, d.y + d.h/2, 5, 0, Math.PI * 2);
    ctx.fill();
    // Green glow on mat border
    ctx.shadowColor = '#00e676';
    ctx.shadowBlur = 12;
    ctx.strokeStyle = 'rgba(0,230,118,0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(d.x - matPad, d.y - matPad, d.w + matPad*2, d.h + matPad*2);
    ctx.shadowBlur = 0;
  }

  // =============================================
  // WALLS — stone masonry with highlight
  // =============================================
  const walls = MAP_DATA[currentMap]?.walls || [];
  for (let w of walls) {
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(w.x, w.y, w.w, w.h);

    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 2;
    ctx.strokeRect(w.x, w.y, w.w, w.h);

    // Top highlight edge
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    if (w.w > w.h) {
       ctx.beginPath(); ctx.moveTo(w.x, w.y+2); ctx.lineTo(w.x+w.w, w.y+2); ctx.stroke();
    } else {
       ctx.beginPath(); ctx.moveTo(w.x+2, w.y); ctx.lineTo(w.x+2, w.y+w.h); ctx.stroke();
    }
  }

  // =============================================
  // WORLD DECORATIONS & TASK OBJECTS
  // =============================================
  const mapTasks = MAP_DATA[currentMap]?.tasks || [];
  const furniture = MAP_DATA[currentMap]?.furniture_visuals || []; // Wait, I'll use generic furniture
  
  for (let t of mapTasks) drawTaskWorldObject(t, time);

  // Draw Emergency Button
  drawEmergencyButton(time);

  // =============================================
  // PLAYERS & BODIES
  // =============================================
  const localMe = findMe();
  for (let id in players) {
    const playerObj = players[id];
    const isLocal = playerObj === localMe;
    const amIDead = localMe && localMe.isDead;
    if (playerObj.isDead && !amIDead && !isLocal) continue;
    if (!playerObj.isDead) {
      drawPlayer(playerObj, isLocal, time);
    } else {
      drawGhost(playerObj, isLocal, time);
    }
  }

  for (let body of bodies) {
    drawDeadBody(body);
  }
  
  if (myRole === 'crewmate' || (players[myId] && players[myId].isDead)) {
    const tasks = MAP_DATA[currentMap]?.tasks || [];
    drawTasks(tasks);
  }
  
  // =============================================
  // ROOFS — fog of war with improved look
  // =============================================
  const isMe = findMe(); // Use findMe() so transparency works even if socket ID flickered
  const amIDead = isMe && isMe.isDead;
  let myRoomId = (!amIDead && isMe) ? getRoomId(isMe.x, isMe.y) : null;

  // Re-use 'theme' from line 854
  const roofs = MAP_DATA[currentMap]?.roofs || [];

  for (let r of roofs) {
    const bKey = r.id.slice(0, 2); 
    const bIndex = parseInt(r.id.slice(1)) - 1;
    const style = {
       label: theme.bldgLabels[bIndex] || 'The Outpost',
       roofCol: theme.roofCols[bIndex] || 'rgb(30,30,30)',
       windowCol: '#ffd54f', windowGlow: '#ff9800'
    };

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
function drawWoodenSigns() {
  const theme = MAP_THEMES[currentMap] || MAP_THEMES['Alpha'];
  const doors = MAP_DATA[currentMap]?.doors || [];
  
  for (let d of doors) {
    if (!d.target) continue;
    // Place sign near the door
    const sx = d.x + d.w/2;
    const sy = d.y + (d.h > 40 ? d.h + 20 : d.h + 35);
    
    ctx.save();
    ctx.translate(sx, sy);

    // Sign post
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(-2, 0, 4, 30);
    ctx.strokeStyle = '#1b1100';
    ctx.lineWidth = 1;
    ctx.strokeRect(-2, 0, 4, 30);

    // Sign board
    ctx.font = 'bold 10px Courier New, monospace';
    const tw = ctx.measureText(d.target).width + 12;
    const bh = 22;
    ctx.fillStyle = '#5d4037';
    ctx.beginPath();
    ctx.roundRect(-tw/2, -bh, tw, bh, 3);
    ctx.fill();
    ctx.strokeStyle = '#2d1d19';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Wood grain detail
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-tw/2 + 5, -bh + 7); ctx.lineTo(tw/2 - 5, -bh + 7);
    ctx.moveTo(-tw/2 + 8, -bh + 14); ctx.lineTo(tw/2 - 8, -bh + 14);
    ctx.stroke();

    // Text
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = '#efebe9';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(d.target, 0, -bh/2);
    
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

function drawMapDecorations(time, theme) {
  for (let d of DECORATIONS) {
    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.rotate(d.rot);

    if (theme.pitEffect === 'Water') {
      // Base Britney: Bio-Luminescent Mushrooms
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.003 + d.x);
      ctx.fillStyle = `hsla(${200 + d.sz*5}, 80%, 60%, ${0.6 + 0.4*pulse})`;
      ctx.shadowColor = `hsla(${200 + d.sz*5}, 80%, 60%, 1)`;
      ctx.shadowBlur = 10 * pulse;
      ctx.beginPath(); ctx.arc(0, 0, d.sz * 0.8, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, -d.sz*0.4, d.sz*0.2, 0, Math.PI*2); ctx.fill();
    } else if (theme.pitEffect === 'Acid') {
      // Base Charlie: Jungle Vines / Moss
      ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(d.sz, d.sz, d.sz*0.5, d.sz*2); ctx.stroke();
      ctx.fillStyle = '#44bd32';
      for(let i=0; i<3; i++) {
        ctx.beginPath(); ctx.ellipse(i*4, i*8, 4, 6, 0.5, 0, Math.PI*2); ctx.fill();
      }
    } else {
      // Base Alpha: Rocks & Grass
      if (d.type === 'rock') {
        ctx.fillStyle = '#3d3428';
        ctx.beginPath(); ctx.ellipse(0, 0, d.sz, d.sz * 0.65, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.beginPath(); ctx.ellipse(-d.sz*0.2, -d.sz*0.15, d.sz*0.4, d.sz*0.25, -0.5, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.strokeStyle = `rgba(${40+Math.floor(d.sz*3)},${80+Math.floor(d.sz*5)},${20+Math.floor(d.sz*2)},0.7)`;
        ctx.lineWidth = 1.5;
        for (let b = -1; b <= 1; b++) {
          ctx.beginPath(); ctx.moveTo(b * d.sz * 0.35, 0); ctx.lineTo(b * d.sz * 0.2, -d.sz * 1.2); ctx.stroke();
        }
      }
    }
    ctx.shadowBlur = 0;
    ctx.restore();
  }
}

function drawPlayer(p, isMe, time) {
  if (!p) return;
  // Local player direction detection
  if (isMe) {
    if (keys['w']) p.facingUp = true;
    else if (keys['s']) p.facingUp = false;
  }

  let bob = p.isMoving ? Math.abs(Math.sin(time * 0.015)) * 5 : 0;
  ctx.save();
  ctx.translate(p.x, p.y - bob);
  if (p.flipX) ctx.scale(-1, 1);

  // --- Hair (Visible on front and back) ---
  ctx.fillStyle = '#2d3436'; // Charcoal black for contrast
  ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (p.facingUp) {
    // Full back hair
    ctx.arc(0, -18, 13, 0, Math.PI * 2);
  } else {
    // Front fringe
    ctx.arc(0, -18, 12, Math.PI, Math.PI * 2.1);
  }
  ctx.fill(); ctx.stroke();

  if (!p.facingUp) {
    // --- Head (Front skin tone) ---
    ctx.fillStyle = '#ffdbac';
    ctx.beginPath();
    ctx.arc(0, -18, 12, 0, Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5;
    ctx.stroke();

    // --- Sunglasses ---
    ctx.fillStyle = '#1e1e1e';
    ctx.beginPath(); ctx.roundRect(-9, -21, 7, 6, 2); ctx.fill(); 
    ctx.beginPath(); ctx.roundRect(2, -21, 7, 6, 2); ctx.fill();
    ctx.strokeStyle = '#1e1e1e'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(-2, -20); ctx.lineTo(2, -20); ctx.stroke();
    // Shine
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(-4, -19, 1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(5, -19, 1, 0, Math.PI * 2); ctx.fill();
  }

  // Pre-calculate stride for depth layering
  let anim = 0;
  let isVertical = false;
  if (p.isMoving) {
    anim = Math.sin(time * 0.02) * 6;
    const dy = Math.abs(p.y - (p.lastDrawY || p.y));
    const dx = Math.abs(p.x - (p.lastDrawX || p.x));
    isVertical = dy > dx;
  }

  // --- Feet (Back-layer: hide foot going "up" behind body) ---
  if (p.isMoving && isVertical) {
    ctx.fillStyle = '#333';
    if (anim < 0) ctx.fillRect(-10, 16 + anim, 8, 5);
    else ctx.fillRect(2, 16 - anim, 8, 5);
  }

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

  // --- Suit Body ---
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.roundRect(-14, -8, 28, 24, 6);
  ctx.fill();
  ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5;
  ctx.stroke();

  if (p.facingUp) {
    // --- Back Suit Details (Seam & Vent) ---
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(0, 16); ctx.stroke(); // Seam
    ctx.beginPath(); ctx.moveTo(-4, 16); ctx.lineTo(4, 16); ctx.stroke(); // Vent
  }

  if (!p.facingUp) {
    // --- Shirt & Tie (V-neck look) ---
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(-6, -8); ctx.lineTo(6, -8); ctx.lineTo(0, 4); ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#000'; // black tie
    ctx.beginPath();
    ctx.moveTo(-1.5, -8); ctx.lineTo(1.5, -8); ctx.lineTo(0, 2); ctx.closePath();
    ctx.fill();
  }

  // --- Feet (Front-layer: show foot going "down" or sliding over body) ---
  ctx.fillStyle = '#333';
  if (p.isMoving) {
    if (isVertical) {
      if (anim >= 0) ctx.fillRect(-10, 16 + anim, 8, 5);
      else ctx.fillRect(2, 16 - anim, 8, 5);
    } else {
      // Stepping left/right: Horizontal alternate stride
      ctx.fillRect(-10 + anim, 16, 8, 5);
      ctx.fillRect(2 - anim, 16, 8, 5);
    }
    p.lastDrawX = p.x; p.lastDrawY = p.y;
  } else {
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
  // Local player direction detection
  if (isMe) {
    if (keys['w']) p.facingUp = true;
    else if (keys['s']) p.facingUp = false;
  }

  const bob = Math.sin(Date.now() * 0.003) * 6;
  ctx.save();
  ctx.translate(p.x, p.y + bob);
  if (p.flipX) ctx.scale(-1, 1);
  ctx.globalAlpha = 0.45;

  // --- Hair (Spectral) ---
  ctx.fillStyle = '#2d3436';
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1.2;
  ctx.beginPath();
  if (p.facingUp) {
    ctx.arc(0, -18, 13.5, 0, Math.PI * 2);
  } else {
    ctx.arc(0, -18, 12, Math.PI, Math.PI * 2.1);
  }
  ctx.fill(); ctx.stroke();

  if (!p.facingUp) {
    // Head skin tone
    ctx.fillStyle = '#dfe6e9';
    ctx.beginPath();
    ctx.arc(0, -18, 12, 0, Math.PI);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  // --- Spectral Suit (desaturated) ---
  ctx.fillStyle = p.color;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.roundRect(-14, -8, 28, 20, { tl: 6, tr: 6, bl: 0, br: 0 });
  ctx.fill();
  
  if (p.facingUp) {
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(0, 12); ctx.stroke();
  }
  
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = '#dfe6e9';
  ctx.beginPath();
  ctx.roundRect(-14, -8, 28, 18, { tl: 6, tr: 6, bl: 0, br: 0 });
  ctx.fill();

  if (!p.facingUp) {
    // Shirt & Tie
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.moveTo(-6, -8); ctx.lineTo(6, -8); ctx.lineTo(0, 4); ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath();
    ctx.moveTo(-1.5, -8); ctx.lineTo(1.5, -8); ctx.lineTo(0, 2); ctx.closePath();
    ctx.fill();
  }

  // --- Wavy triangle tail ---
  ctx.fillStyle = '#dfe6e9';
  const tipX = Math.sin(Date.now() * 0.005) * 12;
  ctx.beginPath();
  ctx.moveTo(-14, 10);
  ctx.lineTo(14, 10);
  ctx.lineTo(tipX, 35);
  ctx.closePath();
  ctx.fill();

  if (!p.facingUp) {
    // Sunglasses (spectral)
    ctx.fillStyle = '#1e1e1e';
    ctx.beginPath(); ctx.roundRect(-9, -21, 7, 6, 2); ctx.fill();
    ctx.beginPath(); ctx.roundRect(2, -21, 7, 6, 2); ctx.fill();
    ctx.strokeStyle = '#1e1e1e'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-2, -20); ctx.lineTo(2, -20); ctx.stroke();
  }

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
function drawTasks(tasks) {
  if (!myTaskIds) return; 
  const me = players[myId];
  const activeTasks = tasks || MAP_DATA[currentMap]?.tasks || [];

  for (let task of activeTasks) {
    // Generate an ID for comparison based on label/position if not provided
    const tid = task.id || (task.label + task.x + task.y);
    if (!myTaskIds.has(tid)) continue; 
    if (completedTasks.has(task.id)) {
      // Draw faint checkmark for completed tasks
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = '#2ecc71';
      ctx.beginPath();
      ctx.arc(task.x, task.y - 30, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✓', task.x, task.y - 29);
      ctx.restore();
      continue;
    }

    const nearby = me && Math.hypot(me.x - task.x, me.y - task.y) < 50;
    
    ctx.save();
    ctx.translate(task.x, task.y - 30);
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
    ctx.fillText(task.label, task.x, task.y - 48);
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
  if (shownTaskId && !window.meetingActive) {
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

function drawFlora(f) {
  ctx.save();
  ctx.translate(f.x, f.y);
  if (f.type === 'grass') {
    ctx.fillStyle = '#27ae60';
    // Draw 3-4 tufts
    for (let i = 0; i < 3; i++) {
       ctx.beginPath();
       ctx.moveTo(-5 + i*4, 0);
       ctx.quadraticCurveTo(-5 + i*4, -8, -2 + i*4, -12);
       ctx.lineTo(1 + i*4, 0);
       ctx.fill();
    }
  } else if (f.type === 'bush') {
    ctx.fillStyle = '#1e8449';
    ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(8, -6, 12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-8, -4, 10, 0, Math.PI * 2); ctx.fill();
    // Highlights
    ctx.fillStyle = '#2ecc71';
    ctx.beginPath(); ctx.arc(-2, -5, 5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawFurniture(it) {
  ctx.save();
  ctx.translate(it.x, it.y);
  ctx.shadowBlur = 4; ctx.shadowColor = 'rgba(0,0,0,0.3)';

  if (it.type === 'table' || it.type === 'desk') {
    const w = it.type === 'table' ? 40 : 55;
    const h = 25;
    ctx.fillStyle = '#5d4037'; // brown wood
    ctx.fillRect(-w/2, -h/2, w, h);
    ctx.strokeStyle = '#3e2723'; ctx.lineWidth = 2;
    ctx.strokeRect(-w/2, -h/2, w, h);
    // Detail lines
    ctx.beginPath(); ctx.moveTo(-w/2 + 5, -h/2); ctx.lineTo(-w/2 + 5, h/2); ctx.stroke();
  } else if (it.type === 'chair') {
    ctx.fillStyle = '#795548';
    ctx.fillRect(-8, -8, 16, 16);
    ctx.strokeRect(-8, -8, 16, 16);
  } else if (it.type === 'dining_table') {
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(-60, -30, 120, 60);
    ctx.strokeRect(-60, -30, 120, 60);
  } else if (it.type === 'stool') {
    ctx.fillStyle = '#3e2723';
    ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawTaskWorldObject(t, time) {
  ctx.save();
  ctx.translate(t.x, t.y);
  const pulse = 0.6 + 0.4 * Math.sin(time * 0.005);
  
  switch(t.id) {
    case 't1': // Fix Relay
      ctx.fillStyle = '#2c3e50'; ctx.fillRect(-12, -15, 24, 30);
      ctx.fillStyle = '#34495e'; ctx.fillRect(-10, -13, 20, 26);
      ctx.fillStyle = pulse > 0.7 ? '#2ecc71' : '#27ae60';
      ctx.beginPath(); ctx.arc(5, -8, 2, 0, Math.PI*2); ctx.fill(); // status led
      break;
    case 't2': // Charge Battery
      ctx.fillStyle = '#2980b9'; ctx.fillRect(-15, -20, 30, 40);
      ctx.fillStyle = '#3498db'; ctx.fillRect(-12, -17, 24, 34);
      ctx.fillStyle = '#f1c40f'; ctx.fillRect(-8, 5 - (15 * pulse), 16, 5); // liquid level
      break;
    case 't3': // Align Dish
      ctx.fillStyle = '#bdc3c7'; ctx.beginPath(); ctx.ellipse(0, 5, 20, 10, 0, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#7f8c8d'; ctx.stroke();
      ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-25); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, -25, 4, 0, Math.PI*2); ctx.fill();
      break;
    case 't4': // Mix Solution
      ctx.fillStyle = '#95a5a6'; ctx.fillRect(-25, -15, 50, 30);
      ctx.fillStyle = 'rgba(155, 89, 182, 0.8)'; // purple flask
      ctx.beginPath(); ctx.arc(-10, -5, 6, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(52, 152, 219, 0.8)'; // blue flask
      ctx.beginPath(); ctx.arc(10, -2, 5, 0, Math.PI*2); ctx.fill();
      break;
    case 't5': // Restore Power
      ctx.fillStyle = '#d35400'; ctx.fillRect(-18, -25, 36, 50);
      ctx.strokeStyle = '#000'; ctx.strokeRect(-18, -25, 36, 50);
      ctx.fillStyle = '#f1c40f'; ctx.beginPath(); ctx.moveTo(-5, -5); ctx.lineTo(5, 5); ctx.lineTo(-5, 5); ctx.lineTo(5, 15); ctx.stroke(); // lightning bolt
      break;
    case 't6': // Upload Data
      ctx.fillStyle = '#2c3e50'; ctx.fillRect(-20, -30, 40, 60);
      for(let i=0; i<5; i++) { // server slots
        ctx.fillStyle = (Math.random() > 0.7) ? '#3498db' : '#1a1a1a';
        ctx.fillRect(-15, -25 + (i * 10), 30, 4);
      }
      break;
    case 't7': // Cool Reactor
      ctx.fillStyle = '#7f8c8d'; ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#2c3e50'; ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI*2); ctx.fill();
      // Glowing core
      ctx.shadowBlur = 15; ctx.shadowColor = '#3498db';
      ctx.fillStyle = '#3498db'; ctx.globalAlpha = 0.5 * pulse;
      ctx.beginPath(); ctx.arc(0,0, 18, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0; ctx.globalAlpha = 1.0;
      break;
    case 't8': // Seal Crack
      ctx.strokeStyle = '#e67e22'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-20, -10); ctx.lineTo(20, 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-15, 15); ctx.lineTo(15, -15); ctx.stroke();
      break;
    case 't9': // Collect Samples
      ctx.fillStyle = '#bdc3c7'; ctx.fillRect(-20, -10, 40, 20);
      ctx.fillStyle = 'rgba(46, 204, 113, 0.4)'; // glass dome
      ctx.beginPath(); ctx.arc(0, -15, 15, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#27ae60'; ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(-5, -15); ctx.lineTo(5, -15); ctx.fill(); // plant stub
      break;
    case 't10': // Survey Zone
      ctx.strokeStyle = '#34495e'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-10, 20); ctx.moveTo(0,0); ctx.lineTo(10, 20); ctx.stroke();
      ctx.fillStyle = '#e74c3c'; ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI*2); ctx.fill();
      break;
    case 't11': // Mark Boundary
      ctx.fillStyle = '#7f8c8d'; ctx.fillRect(-4, -30, 8, 40);
      ctx.fillStyle = '#e74c3c'; ctx.beginPath(); ctx.moveTo(4,-30); ctx.lineTo(20, -22); ctx.lineTo(4, -14); ctx.fill(); // flag
      break;
    case 't12': // Drop Supply
      ctx.fillStyle = '#8B4513'; ctx.fillRect(-22, -22, 44, 44);
      ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 3; ctx.strokeRect(-22, -22, 44, 44);
      ctx.beginPath(); ctx.moveTo(-22, -22); ctx.lineTo(22, 22); ctx.moveTo(-22, 22); ctx.lineTo(22, -22); ctx.stroke();
      break;
  }
  ctx.restore();
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

function assignMyTasks() {
  myTaskIds.clear();
  completedTasks.clear();
  const tasks = MAP_DATA[currentMap]?.tasks || MAP_DATA['Alpha'].tasks;
  const pool = [...tasks];
  
  // Pick 7 unique tasks
  for (let i = 0; i < 7 && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const task = pool.splice(idx, 1)[0];
    // In our payload, some tasks might not have IDs yet, so we generate one
    const tid = task.id || (task.label + task.x + task.y);
    task.id = tid; // ensure consistency
    myTaskIds.add(tid);
  }
}

requestAnimationFrame(gameLoop);
