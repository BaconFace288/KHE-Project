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
  // B1 (The Compound)
  { id: 'B1_A', x: 800, y: 800, w: 300, h: 600, color: '#34495e' },
  { id: 'B1_B', x: 1100, y: 1100, w: 500, h: 300, color: '#2c3e50' },
  // B2 (L-Block)
  { id: 'B2_A', x: 2000, y: 600, w: 400, h: 300, color: '#7f8c8d' },
  { id: 'B2_B', x: 2000, y: 900, w: 200, h: 400, color: '#95a5a6' },
  // B3 (Maze Block)
  { id: 'B3_A', x: 500, y: 2000, w: 250, h: 250, color: '#8e44ad' },
  { id: 'B3_B', x: 750, y: 2000, w: 250, h: 250, color: '#9b59b6' },
  { id: 'B3_C', x: 500, y: 2250, w: 250, h: 250, color: '#8e44ad' },
  { id: 'B3_D', x: 750, y: 2250, w: 250, h: 250, color: '#9b59b6' },
  // B4 (Longhouse)
  { id: 'B4_A', x: 1200, y: 2600, w: 300, h: 200, color: '#e67e22' },
  { id: 'B4_B', x: 1500, y: 2600, w: 300, h: 200, color: '#d35400' },
  { id: 'B4_C', x: 1800, y: 2600, w: 300, h: 200, color: '#e67e22' }
];

const walls = [
  // B1 Walls
  { x: 800-WT, y: 800-WT, w: 300+2*WT, h: WT },
  { x: 800-WT, y: 800, w: WT, h: 600 },
  { x: 800-WT, y: 1400, w: 100, h: WT }, 
  { x: 900+DW, y: 1400, w: 200+WT-DW, h: WT },
  { x: 1100, y: 800, w: WT, h: 300 },
  { x: 1100, y: 1100, w: WT, h: 100 },
  { x: 1100, y: 1200+DW, w: WT, h: 200-DW },
  { x: 1100+WT, y: 1100-WT, w: 200, h: WT },
  { x: 1300+DW+WT, y: 1100-WT, w: 300-DW-WT, h: WT },
  { x: 1600, y: 1100-WT, w: WT, h: 300+2*WT },
  { x: 1100+WT, y: 1400, w: 500, h: WT },

  // B2 Walls 
  { x: 2000-WT, y: 600-WT, w: 400+2*WT, h: WT },
  { x: 2000-WT, y: 600, w: WT, h: 300 },
  { x: 2400, y: 600, w: WT, h: 100 },
  { x: 2400, y: 700+DW, w: WT, h: 200-DW },
  { x: 2000-WT, y: 900, w: WT, h: WT },
  { x: 2000, y: 900, w: 100, h: WT },
  { x: 2100+DW, y: 900, w: 300-DW+WT, h: WT },
  { x: 2000-WT, y: 900+WT, w: WT, h: 400 },
  { x: 2200, y: 900+WT, w: WT, h: 400 },
  { x: 2000-WT, y: 1300, w: 100+WT, h: WT },
  { x: 2100+DW, y: 1300, w: 100, h: WT },
  
  // B3 Walls 
  { x: 500-WT, y: 2000-WT, w: 500+2*WT, h: WT },
  { x: 500-WT, y: 2500, w: 500+2*WT, h: WT },
  { x: 500-WT, y: 2000, w: WT, h: 100 },
  { x: 500-WT, y: 2100+DW, w: WT, h: 400-DW },
  { x: 1000, y: 2000, w: WT, h: 300 },
  { x: 1000, y: 2300+DW, w: WT, h: 200-DW },
  { x: 500, y: 2250-WT/2, w: 100, h: WT },
  { x: 600+DW, y: 2250-WT/2, w: 400-DW, h: WT },
  { x: 750-WT/2, y: 2000, w: WT, h: 100 },
  { x: 750-WT/2, y: 2100+DW, w: WT, h: 400-DW },

  // B4 Walls
  { x: 1200-WT, y: 2600-WT, w: 900+2*WT, h: WT },
  { x: 1200-WT, y: 2800, w: 900+2*WT, h: WT },
  { x: 1200-WT, y: 2600, w: WT, h: 50 },
  { x: 1200-WT, y: 2650+DW, w: WT, h: 150-DW },
  { x: 2100, y: 2600, w: WT, h: 50 },
  { x: 2100, y: 2650+DW, w: WT, h: 150-DW },
  { x: 1500-WT/2, y: 2600, w: WT, h: 50 },
  { x: 1500-WT/2, y: 2650+DW, w: WT, h: 150-DW },
  { x: 1800-WT/2, y: 2600, w: WT, h: 50 },
  { x: 1800-WT/2, y: 2650+DW, w: WT, h: 150-DW }
];

const doors = [
  { x: 900, y: 1400-WT, w: DW, h: WT*3 }, 
  { x: 1300+WT, y: 1100-WT*2, w: DW, h: WT*3 }, 
  { x: 1100-WT, y: 1200, w: WT*3, h: DW }, 
  { x: 2400-WT*2, y: 700, w: WT*3, h: DW }, 
  { x: 2100, y: 1300-WT, w: DW, h: WT*3 }, 
  { x: 2000, y: 900-WT, w: DW, h: WT*3 }, 
  { x: 500-WT*2, y: 2000+100, w: WT*3, h: DW }, 
  { x: 1000-WT, y: 2300, w: WT*3, h: DW }, 
  { x: 500+100, y: 2250-WT*1.5, w: DW, h: WT*3 }, 
  { x: 750-WT*1.5, y: 2000+100, w: WT*3, h: DW }, 
  { x: 1200-WT*2, y: 2650, w: WT*3, h: DW }, 
  { x: 2100-WT, y: 2650, w: WT*3, h: DW }, 
  { x: 1500-WT*1.5, y: 2650, w: WT*3, h: DW }, 
  { x: 1800-WT*1.5, y: 2650, w: WT*3, h: DW }  
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

function collidesWithPit(px, py, pr) {
    for (let p of pits) {
        if (Math.hypot(px - p.x, py - p.y) < p.r + pr) return true;
    }
    return false;
}

function getRoomId(px, py) {
    for (let r of roofs) {
        if (px > r.x && px < r.x + r.w && py > r.y && py < r.y + r.h) {
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
    currentState = 'PLAYING';
    myRole = players[myId].role;
    updateScreenState();
});

socket.on('playerClubbed', (id) => {
    if (players[id]) {
      players[id].isDead = true;
      checkWinCondition();
    }
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
        endText.innerText = "Cavemen Win!";
        endText.style.color = "#c0392b";
        updateScreenState();
    } else if (aliveImpostors === 0) {
        currentState = 'GAMEOVER';
        endText.innerText = "Time Travelers Win!";
        endText.style.color = "#3498db";
        updateScreenState();
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

function updateLocalPlayer(dt) {
  if (!players[myId] || players[myId].isDead) return;
  
  let dx = 0; let dy = 0;
  if (keys.w) dy -= 1;
  if (keys.s) dy += 1;
  if (keys.a) dx -= 1;
  if (keys.d) dx += 1;

  if (dx !== 0 || dy !== 0) {
    const length = Math.hypot(dx, dy);
    dx /= length; dy /= length;
    
    let newX = players[myId].x;
    let newY = players[myId].y;
    
    if (dx !== 0) {
        newX += dx * SPEED * dt;
        if (collidesWithWall(newX, players[myId].y, 16) || collidesWithPit(newX, players[myId].y, 16)) {
            newX = players[myId].x; 
        }
    }
    if (dy !== 0) {
        newY += dy * SPEED * dt;
        if (collidesWithWall(newX, newY, 16) || collidesWithPit(newX, newY, 16)) {
            newY = players[myId].y;
        }
    }
    
    players[myId].x = Math.max(20, Math.min(MAP_WIDTH - 20, newX));
    players[myId].y = Math.max(20, Math.min(MAP_HEIGHT - 20, newY));
    
    players[myId].isMoving = true;
    if (dx < 0) players[myId].flipX = true;
    else if (dx > 0) players[myId].flipX = false;
    
    socket.emit('playerMovement', {
        x: players[myId].x, 
        y: players[myId].y,
        flipX: players[myId].flipX,
        isMoving: true
    });
  } else {
      if (players[myId].isMoving) {
          players[myId].isMoving = false;
          socket.emit('playerMovement', {
              x: players[myId].x, 
              y: players[myId].y,
              flipX: players[myId].flipX,
              isMoving: false
          });
      }
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
    drawPlayer(players[id], id === myId, time);
  }
  
  // Draw Roofs for Vision Blocking (Fog of War)
  let myRoomId = me ? getRoomId(me.x, me.y) : null;
  for (let r of roofs) {
      if (r.id !== myRoomId) {
          ctx.fillStyle = r.color;
          // exact floor dimensions to preserve external wall visibility
          ctx.fillRect(r.x, r.y, r.w, r.h); 
      } else {
          ctx.fillStyle = 'rgba(0,0,0,0.1)';
          ctx.fillRect(r.x, r.y, r.w, r.h);
      }
  }

  ctx.restore();
}

function drawPlayer(p, isMe, time) {
  ctx.save();
  ctx.translate(p.x, p.y);
  
  if (p.flipX) ctx.scale(-1, 1);
  
  if (p.isDead) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#ecf0f1';
      ctx.beginPath();
      ctx.arc(0, 0, 15, Math.PI, 0);
      ctx.lineTo(15, 20); ctx.lineTo(8, 15); ctx.lineTo(0, 20);
      ctx.lineTo(-8, 15); ctx.lineTo(-15, 20);
      ctx.closePath();
      ctx.fill();
      
      ctx.fillStyle = 'black';
      ctx.beginPath(); ctx.arc(5, -5, 3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(-5, -5, 3, 0, Math.PI*2); ctx.fill();
      ctx.restore();
      return;
  }

  let bob = p.isMoving ? Math.abs(Math.sin(time * 0.01)) * 5 : 0;
  ctx.translate(0, -bob);

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
      ctx.arc(0, -20, 6, 0, Math.PI*2); ctx.arc(0, 0, 3, 0, Math.PI*2);
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

requestAnimationFrame(gameLoop);
