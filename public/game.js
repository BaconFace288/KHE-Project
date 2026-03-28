const socket = io();

// UI Elements
const lobbyScreen = document.getElementById('lobby-screen');
const gameUi = document.getElementById('game-ui');
const endScreen = document.getElementById('end-screen');
const endText = document.getElementById('end-text');
const playerNameInput = document.getElementById('player-name');
const joinBtn = document.getElementById('join-btn');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const playerListDiv = document.getElementById('player-list');
const roleText = document.getElementById('role-text');
const actionBtn = document.getElementById('action-btn');

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game State
let players = {};
let myId = null;
let currentState = 'LOBBY';
let myRole = 'crewmate';

// Input Handling
const keys = { w: false, a: false, s: false, d: false, space: false };
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (keys.hasOwnProperty(key)) keys[key] = true;
  if (e.code === 'Space' && actionBtn.classList.contains('hidden') === false) {
     triggerClub();
  }
});
document.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  if (keys.hasOwnProperty(key)) keys[key] = false;
});

// Sound / Local State
let swingAnim = 0; // 0 to 1 for caveman club swing

// Socket Events
socket.on('connect', () => { myId = socket.id; });

socket.on('currentPlayers', (serverPlayers) => {
  players = serverPlayers;
  updateLobbyUI();
});

socket.on('newPlayer', (data) => {
  players[data.id] = data.player;
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

socket.on('gameState', (state) => {
  currentState = state;
  updateScreenState();
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

socket.on('nameUpdated', (data) => {
    if(players[data.id]) {
        players[data.id].name = data.name;
        updateLobbyUI();
    }
});

// Button listeners
joinBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim() || 'Player';
    socket.emit('updateName', name);
});

startBtn.addEventListener('click', () => {
  socket.emit('startGame');
});

restartBtn.addEventListener('click', () => {
   // Simplified restart
   location.reload();
});

actionBtn.addEventListener('click', triggerClub);

function triggerClub() {
   if (myRole === 'impostor' && !players[myId].isDead) {
      swingAnim = 1; // start swing animation
      
      // Find closest crewmate
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
  if (currentState === 'LOBBY') {
    lobbyScreen.classList.remove('hidden');
    gameUi.classList.add('hidden');
    endScreen.classList.add('hidden');
  } else if (currentState === 'PLAYING') {
    lobbyScreen.classList.add('hidden');
    gameUi.classList.remove('hidden');
    
    roleText.innerText = myRole === 'impostor' ? 'Caveman (Impostor)' : 'Time Traveler (Crewmate)';
    roleText.style.color = myRole === 'impostor' ? '#c0392b' : '#3498db';
    
    if (myRole === 'impostor') {
      actionBtn.classList.remove('hidden');
    } else {
      actionBtn.classList.add('hidden');
    }
  } else {
    // GAME OVER
    gameUi.classList.add('hidden');
    endScreen.classList.remove('hidden');
  }
}

function updateLobbyUI() {
  playerListDiv.innerHTML = '<h3>Players:</h3>';
  for (let id in players) {
    const p = players[id];
    playerListDiv.innerHTML += `<div><span style="display:inline-block;width:12px;height:12px;background:${p.color};border-radius:50%;margin-right:5px;"></span>${p.name} ${id === myId ? '(You)' : ''}</div>`;
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

// Game Loop
let lastTime = Date.now();
function gameLoop() {
  const now = Date.now();
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  if (currentState === 'PLAYING') {
    updateLocalPlayer(dt);
  }
  
  if (swingAnim > 0) {
      swingAnim -= dt * 5; // Swing duration
      if (swingAnim < 0) swingAnim = 0;
  }

  drawGame(now);
  requestAnimationFrame(gameLoop);
}

const SPEED = 200;

function updateLocalPlayer(dt) {
  if (!players[myId] || players[myId].isDead) return;
  
  let dx = 0;
  let dy = 0;
  if (keys.w) dy -= 1;
  if (keys.s) dy += 1;
  if (keys.a) dx -= 1;
  if (keys.d) dx += 1;

  if (dx !== 0 || dy !== 0) {
    // Normalize
    const length = Math.hypot(dx, dy);
    dx /= length; dy /= length;
    
    players[myId].x += dx * SPEED * dt;
    players[myId].y += dy * SPEED * dt;
    
    // Bounds check
    players[myId].x = Math.max(20, Math.min(canvas.width - 20, players[myId].x));
    players[myId].y = Math.max(20, Math.min(canvas.height - 20, players[myId].y));
    
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
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw Background Elements (Grid or grass)
  ctx.strokeStyle = '#2ecc71';
  ctx.lineWidth = 2;
  for(let i = 0; i < canvas.width; i+=50) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
  }
  for(let i = 0; i < canvas.height; i+=50) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
  }

  // Draw Players
  for (let id in players) {
    drawPlayer(players[id], id === myId, time);
  }
}

function drawPlayer(p, isMe, time) {
  ctx.save();
  ctx.translate(p.x, p.y);
  
  if (p.flipX) {
      ctx.scale(-1, 1);
  }
  
  if (p.isDead) {
      // Draw ghost
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#ecf0f1';
      ctx.beginPath();
      ctx.arc(0, 0, 15, Math.PI, 0); // top arc
      ctx.lineTo(15, 20);
      ctx.lineTo(8, 15);
      ctx.lineTo(0, 20);
      ctx.lineTo(-8, 15);
      ctx.lineTo(-15, 20);
      ctx.closePath();
      ctx.fill();
      
      // Eyes
      ctx.fillStyle = 'black';
      ctx.beginPath(); ctx.arc(5, -5, 3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(-5, -5, 3, 0, Math.PI*2); ctx.fill();
      
      ctx.restore();
      return;
  }

  // Bobbing animation for walking
  let bob = 0;
  if (p.isMoving) {
      bob = Math.abs(Math.sin(time * 0.01)) * 5;
  }
  
  ctx.translate(0, -bob);

  // Body
  ctx.fillStyle = p.color;
  ctx.beginPath();
  // Bean shape
  ctx.arc(0, -10, 16, Math.PI, 0);
  ctx.lineTo(16, 10);
  ctx.arc(0, 10, 16, 0, Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000';
  ctx.stroke();

  // Role specific features
  if (p.role === 'impostor') {
      // Caveman Look: Loincloth and Club
      ctx.fillStyle = '#8e44ad'; // Some primitive rag color
      ctx.fillRect(-16, 0, 32, 12);
      
      // Club!
      ctx.save();
      // Right hand holds the club
      ctx.translate(15, 5);
      if (isMe && swingAnim > 0) {
          // Swing it
          ctx.rotate(Math.PI / 2 * swingAnim);
      } else {
          ctx.rotate(-Math.PI / 6);
      }
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.arc(0, -20, 6, 0, Math.PI*2);
      ctx.arc(0, 0, 3, 0, Math.PI*2);
      ctx.lineTo(-3, 0); ctx.lineTo(-6, -20);
      ctx.lineTo(6, -20); ctx.lineTo(3, 0);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      
      // Face (Eyebrow ridge)
      ctx.fillStyle = '#000';
      ctx.fillRect(2, -12, 10, 3);
      ctx.beginPath(); ctx.arc(5, -8, 2, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(10, -8, 2, 0, Math.PI*2); ctx.fill();
      
  } else {
      // Time Traveler Look: High tech visor
      ctx.fillStyle = '#3498db'; // Visor color
      ctx.beginPath();
      ctx.roundRect(0, -15, 18, 12, 4);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Backpack / Time Battery
      ctx.fillStyle = '#7f8c8d';
      ctx.fillRect(-22, -8, 8, 20);
      ctx.strokeRect(-22, -8, 8, 20);
      
      // Glowing dot
      ctx.fillStyle = '#1abc9c';
      ctx.beginPath(); ctx.arc(-18, 5, 2, 0, Math.PI*2); ctx.fill();
  }
  
  ctx.restore();

  // Draw Nameplate
  ctx.fillStyle = 'white';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(p.name, p.x, p.y - 45 - bob);
}

// Start loop
requestAnimationFrame(gameLoop);
