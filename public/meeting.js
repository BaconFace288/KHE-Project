// =====================================================
//  MEETING SYSTEM — The Primitive Peer
//  Uses globals from game.js: socket, players, myId,
//  bodies, checkWinCondition
// =====================================================

let meetingTimerInterval = null;
let meetingTimeLeft = 60;
let myVote = null;
const votedPlayers = new Set(); // socket IDs who have cast a vote

// DOM refs
const flashEl       = document.getElementById('meeting-flash');
const flashText     = document.getElementById('meeting-flash-text');
const voteScreen    = document.getElementById('vote-screen');
const voteTitle     = document.getElementById('vote-title');
const voteTimerEl   = document.getElementById('vote-timer');
const callerInfoEl  = document.getElementById('caller-info');
const playerListEl  = document.getElementById('vote-player-list');
const skipBtn       = document.getElementById('skip-vote-btn');
const voteResultEl  = document.getElementById('vote-result');
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const chatPanel     = document.getElementById('chat-panel');
const chatMessages  = document.getElementById('chat-messages');
const chatInput     = document.getElementById('chat-input');
const chatSendBtn   = document.getElementById('chat-send-btn');

// ===== Socket Events =====
socket.on('meetingCalled', (data) => openMeeting(data));
socket.on('meetingResult', (data) => showResult(data));
socket.on('voteCast', ({ voterId }) => {
  votedPlayers.add(voterId);
  const el = document.getElementById(`vck-${voterId}`);
  if (el) el.textContent = '✓';
});
socket.on('meetingChatMsg', ({ name, color, text, isDead }) => {
  appendChat(name, color, text, isDead);
});

// ===== Open Meeting =====
function openMeeting(data) {
  // Clear any active task modal
  if (typeof closeModal === 'function') closeModal();
  
  window.meetingActive = true;
  myVote = null;
  votedPlayers.clear();
  meetingTimeLeft = 60;
  window.taskModalActive = true; // freeze movement

  const isReport = data.type === 'report';
  flashText.style.color = isReport ? '#e74c3c' : '#f39c12';
  flashText.innerHTML = isReport
    ? '💀 DEAD BODY<br>REPORTED!'
    : '⚠️ EMERGENCY<br>MEETING!';

  console.log("MEETING SYSTEM: openMeeting called with data:", data);
  
  flashEl.classList.add('active');
  console.log("MEETING SYSTEM: Flash active class added");

  setTimeout(() => {
    console.log("MEETING SYSTEM: Timeout finished, showing vote screen");
    flashEl.classList.remove('active');
    showVoteScreen(data);
  }, 2500);

  // Mark the reported body immediately so no one can re-report it
  if (data.type === 'report' && data.bodyName) {
    const b = bodies.find(bd => bd.name === data.bodyName && !bd.ejected);
    if (b) b.reported = true;
  }
}

function showVoteScreen(data) {
  voteTitle.textContent = data.type === 'report' ? 'Dead Body Reported' : 'Emergency Meeting';
  const col = data.callerColor || '#ecf0f1';
  callerInfoEl.innerHTML = `<span style="color:${col};font-weight:bold">${data.callerName}</span> called ${data.type === 'report' ? 'a body report' : 'an emergency meeting'}` +
    (data.bodyName ? ` — <span style="color:#e74c3c">💀 ${data.bodyName} is dead</span>` : '');

  voteResultEl.style.display = 'none';
  voteResultEl.textContent = '';
  chatPanel.classList.remove('open');
  chatMessages.innerHTML = '';
  chatInput.value = '';
  chatToggleBtn.textContent = '💬 Open Chat ▼';

  buildPlayerList();
  skipBtn.disabled = false;
  skipBtn.className = 'skip-btn';
  skipBtn.textContent = '⏭ Skip Vote';

  voteScreen.classList.add('active');
  updateTimer();
  meetingTimerInterval = setInterval(() => {
    meetingTimeLeft--;
    updateTimer();
    if (meetingTimeLeft <= 0) clearInterval(meetingTimerInterval);
  }, 1000);
}

function buildPlayerList() {
  playerListEl.innerHTML = '';
  const amIDead = players[myId] && players[myId].isDead;

  for (let id in players) {
    const p = players[id];
    const row = document.createElement('div');
    row.className = 'vote-player-row' + (p.isDead ? ' dead' : '');
    row.id = `vrow-${id}`;

    const dot = document.createElement('span');
    dot.className = 'vote-color-dot';
    dot.style.background = p.color;

    const name = document.createElement('span');
    name.className = 'vote-player-name';
    name.textContent = (p.isDead ? '💀 ' : '') + p.name + (id === myId ? ' (You)' : '');

    const check = document.createElement('span');
    check.className = 'voted-check';
    check.id = `vck-${id}`;
    check.textContent = '';

    const tally = document.createElement('span');
    tally.className = 'vote-tally';
    tally.id = `vtl-${id}`;

    row.append(dot, name, tally, check);

    if (!amIDead && !p.isDead && id !== myId) {
      const btn = document.createElement('button');
      btn.className = 'vote-btn';
      btn.textContent = 'Vote';
      btn.id = `vbtn-${id}`;
      btn.addEventListener('click', () => castVote(id));
      row.appendChild(btn);
    }
    playerListEl.appendChild(row);
  }
}

function castVote(targetId) {
  if (myVote !== null) return;
  myVote = targetId;
  socket.emit('castVote', targetId);

  // Disable all vote buttons
  document.querySelectorAll('.vote-btn').forEach(b => b.disabled = true);
  skipBtn.disabled = true;

  if (targetId === 'skip') {
    skipBtn.className = 'skip-btn chosen';
    skipBtn.textContent = '✓ Skipped';
  } else {
    const b = document.getElementById(`vbtn-${targetId}`);
    if (b) { b.classList.add('chosen'); b.textContent = '✓ Voted'; }
  }
}

skipBtn.addEventListener('click', () => castVote('skip'));

function updateTimer() {
  const m = Math.floor(meetingTimeLeft / 60);
  const s = meetingTimeLeft % 60;
  voteTimerEl.textContent = `${m}:${String(s).padStart(2,'0')}`;
  voteTimerEl.style.color = meetingTimeLeft <= 10 ? '#e74c3c' : '#f1c40f';
}

// ===== Meeting Result =====
function showResult(data) {
  clearInterval(meetingTimerInterval);
  document.querySelectorAll('.vote-btn').forEach(b => b.disabled = true);
  skipBtn.disabled = true;

  // Show vote tallies
  for (let id in data.votes) {
    const el = document.getElementById(`vtl-${id}`);
    if (el && id !== 'skip') el.textContent = `×${data.votes[id]}`;
  }

  voteResultEl.style.display = 'block';
  if (data.eliminated) {
    voteResultEl.textContent = `🚀 ${data.eliminatedName} was killed!`;
    voteResultEl.style.color = '#e74c3c';
    const row = document.getElementById(`vrow-${data.eliminated}`);
    if (row) row.classList.add('ejected');
    // Add body to game world
    if (players[data.eliminated]) {
      players[data.eliminated].isDead = true;
      const p = players[data.eliminated];
      const bx = data.deathX ?? p.x;
      const by = data.deathY ?? p.y;
      if (!bodies.some(b => b.name === p.name && Math.hypot(b.x-bx, b.y-by) < 5)) {
        // ejected:true means this body was voted out and cannot be reported
        bodies.push({ x: bx, y: by, color: p.color, name: p.name, role: p.role, ejected: true });
      }
    }
  } else {
    voteResultEl.textContent = 'No one was killed. (Tie or skip)';
    voteResultEl.style.color = '#95a5a6';
  }

  // Apply server-assigned spawn positions to all players
  if (data.spawnPositions) {
    for (const id in data.spawnPositions) {
      if (players[id]) {
        players[id].x = data.spawnPositions[id].x;
        players[id].y = data.spawnPositions[id].y;
      }
    }
  }

  setTimeout(() => {
    closeMeeting();
    if (typeof checkWinCondition === 'function') checkWinCondition();
  }, 4000);
}

function closeMeeting() {
  window.meetingActive = false;
  myVote = null;
  voteScreen.classList.remove('active');
  window.taskModalActive = false;
  
  // Restore focus to game canvas for immediate keyboard response
  const gc = document.getElementById('gameCanvas');
  if (gc) gc.focus();
}

// ===== Chat =====
chatToggleBtn.addEventListener('click', () => {
  const open = chatPanel.classList.toggle('open');
  chatToggleBtn.textContent = open ? '💬 Close Chat ▲' : '💬 Open Chat ▼';
  if (open) { chatInput.focus(); chatMessages.scrollTop = chatMessages.scrollHeight; }
});

chatInput.addEventListener('keydown', e => { if (e.code === 'Enter') sendChat(); });
chatSendBtn.addEventListener('click', sendChat);

function sendChat() {
  const t = chatInput.value.trim();
  if (!t || !meetingActive) return;
  chatInput.value = '';
  socket.emit('meetingChat', t);
}

function appendChat(name, color, text, isDead) {
  // Ghost messages only visible to other dead players
  const iAmDead = players[myId] && players[myId].isDead;
  if (isDead && !iAmDead) return; // hide ghost chat from alive players

  const d = document.createElement('div');
  d.className = 'chat-msg' + (isDead ? ' ghost-msg' : '');
  d.innerHTML = `<span class="chat-name" style="color:${color}">${isDead ? '👻 ' : ''}${name}:</span> ${text}`;
  chatMessages.appendChild(d);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
