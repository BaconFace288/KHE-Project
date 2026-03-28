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
const DW = 80; // Door width
const buildings = [
  { id: "B1", x: 800, y: 800, w: 400, h: 400, roofColor: '#34495e', door: { side: 'bottom', offset: 160 } },
  { id: "B2", x: 2000, y: 1800, w: 500, h: 350, roofColor: '#2c3e50', door: { side: 'left', offset: 135 } },
  { id: "B3", x: 1800, y: 1200, w: 250, h: 250, roofColor: '#7f8c8d', door: { side: 'top', offset: 85 } }
];

const walls = [];
buildings.forEach(b => {
    // Top
    if (b.door.side === 'top') {
        walls.push({ x: b.x, y: b.y, w: b.door.offset, h: WT });
        walls.push({ x: b.x + b.door.offset + DW, y: b.y, w: b.w - (b.door.offset + DW), h: WT });
    } else { walls.push({ x: b.x, y: b.y, w: b.w, h: WT }); }

    // Bottom
    if (b.door.side === 'bottom') {
        walls.push({ x: b.x, y: b.y + b.h - WT, w: b.door.offset, h: WT });
        walls.push({ x: b.x + b.door.offset + DW, y: b.y + b.h - WT, w: b.w - (b.door.offset + DW), h: WT });
    } else { walls.push({ x: b.x, y: b.y + b.h - WT, w: b.w, h: WT }); }

    // Left
    if (b.door.side === 'left') {
        walls.push({ x: b.x, y: b.y, w: WT, h: b.door.offset });
        walls.push({ x: b.x, y: b.y + b.door.offset + DW, w: WT, h: b.h - (b.door.offset + DW) });
    } else { walls.push({ x: b.x, y: b.y, w: WT, h: b.h }); }

    // Right
    if (b.door.side === 'right') {
        walls.push({ x: b.x + b.w - WT, y: b.y, w: WT, h: b.door.offset });
        walls.push({ x: b.x + b.w - WT, y: b.y + b.door.offset + DW, w: WT, h: b.h - (b.door.offset + DW) });
    } else { walls.push({ x: b.x + b.w - WT, y: b.y, w: WT, h: b.h }); }
});

const pits = [
  { x: 1000, y: 1500, r: 80 },
  { x: 1600, y: 2200, r: 100 },
  { x: 2200, y: 800, r: 60 }
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

function getBuildingId(px, py) {
    for (let b of buildings) {
        // slightly inside the walls to trigger roof disappear
        if (px > b.x && px < b.x + b.w && py > b.y && py < b.y + b.h) {
            return b.id;
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
  ctx.fillStyle = '#0f0f0f';
  for (let p of pits) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
      ctx.strokeStyle = '#2d1a11';
      ctx.lineWidth = 5;
      ctx.stroke();
  }

  // Draw Walls (interiors)
  ctx.fillStyle = '#95a5a6';
  for (let w of walls) {
      ctx.fillRect(w.x, w.y, w.w, w.h);
      ctx.strokeStyle = '#7f8c8d';
      ctx.lineWidth = 2;
      ctx.strokeRect(w.x, w.y, w.w, w.h);
  }

  for (let id in players) {
    drawPlayer(players[id], id === myId, time);
  }
  
  // Draw Roofs for Vision Blocking
  let myBId = me ? getBuildingId(me.x, me.y) : null;
  for (let b of buildings) {
      if (b.id !== myBId) {
          ctx.fillStyle = b.roofColor;
          ctx.fillRect(b.x - 5, b.y - 5, b.w + 10, b.h + 10);
      } else {
          ctx.fillStyle = 'rgba(0,0,0,0.1)';
          ctx.fillRect(b.x, b.y, b.w, b.h);
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
