// =====================================================
//  MEETING SYSTEM — The Primitive Peer (FAIL-SAFE RECONSTRUCTION)
//  Syncing with globals: window.socket, window.players,
//  window.myId, window.bodies, window.meetingActive, window.meetingStartTime
// =====================================================

let meetingTimerInterval = null;
let meetingTimeLeft = 60;
let myVote = null;
const votedPlayers = new Set(); 

// Dynamic DOM Re-acquisition (Prevents missing-element-on-startup bugs)
function getMeetingElements() {
  return {
    flashEl:       document.getElementById('meeting-flash'),
    flashText:     document.getElementById('meeting-flash-text'),
    voteScreen:    document.getElementById('vote-screen'),
    voteTitle:     document.getElementById('vote-title'),
    voteTimerEl:   document.getElementById('vote-timer'),
    callerInfoEl:  document.getElementById('caller-info'),
    playerListEl:  document.getElementById('vote-player-list'),
    skipBtn:       document.getElementById('skip-vote-btn'),
    voteResultEl:  document.getElementById('vote-result'),
    chatToggleBtn: document.getElementById('chat-toggle-btn'),
    chatPanel:     document.getElementById('chat-panel'),
    chatMessages:  document.getElementById('chat-messages'),
    chatInput:     document.getElementById('chat-input'),
    chatSendBtn:   document.getElementById('chat-send-btn'),
    uiLayer:       document.getElementById('meeting-ui-layer')
  };
}

// ===== Socket Events =====
if (window.socket) {
  window.socket.on('meetingCalled', (data) => openMeeting(data));
  window.socket.on('meetingResult', (data) => showResult(data));
  window.socket.on('voteCast', ({ voterId }) => {
    votedPlayers.add(voterId);
    const el = document.getElementById(`vck-${voterId}`);
    if (el) el.textContent = '✓';
  });
  window.socket.on('meetingChatMsg', ({ name, color, text, isDead }) => {
    appendChat(name, color, text, isDead);
  });
} else {
  console.error("CRITICAL: MEETING SYSTEM: window.socket is not initialized!");
}

// ===== Open Meeting =====
function openMeeting(data) {
  const els = getMeetingElements();
  
  if (typeof closeModal === 'function') closeModal();
  
  window.meetingActive = true;
  window.meetingStartTime = Date.now(); 
  myVote = null;
  votedPlayers.clear();
  meetingTimeLeft = 60;
  window.taskModalActive = true; // freeze movement

  if (!els.flashEl || !els.flashText) {
    console.error("CRITICAL: MEETING SYSTEM: Flash elements missing from DOM!");
    // At least the canvas strobe in game.js will trigger since window.meetingActive is true
    return;
  }

  // FORCE VISIBILITY VIA JAVASCRIPT (Overrides any CSS file issues)
  els.flashEl.style.setProperty('display', 'flex', 'important');
  els.flashEl.style.setProperty('z-index', '999999', 'important');
  els.flashEl.style.setProperty('visibility', 'visible', 'important');
  els.flashEl.style.setProperty('opacity', '1', 'important');

  const isReport = data.type === 'report';
  els.flashText.style.color = isReport ? '#e74c3c' : '#f39c12';
  els.flashText.innerHTML = isReport ? '💀 DEAD BODY<br>REPORTED!' : '⚠️ EMERGENCY<br>MEETING!';

  console.log("MEETING SYSTEM: openMeeting triggered successfully at", window.meetingStartTime);
  
  setTimeout(() => {
    els.flashEl.style.display = 'none';
    showVoteScreen(data);
  }, 2500);

  // Mark body
  if (data.type === 'report' && data.bodyName && window.bodies) {
    const b = window.bodies.find(bd => bd.name === data.bodyName && !bd.ejected);
    if (b) b.reported = true;
  }
}

function showVoteScreen(data) {
  const els = getMeetingElements();
  if (!els.voteScreen) {
      console.error("CRITICAL: MEETING SYSTEM: Vote screen missing!");
      return;
  }
  
  // FORCE VISIBILITY
  els.voteScreen.style.setProperty('display', 'flex', 'important');
  els.voteScreen.style.setProperty('z-index', '999998', 'important');
  els.voteScreen.style.setProperty('visibility', 'visible', 'important');
  els.voteScreen.style.setProperty('opacity', '1', 'important');

  if (els.voteTitle) els.voteTitle.textContent = data.type === 'report' ? 'Dead Body Reported' : 'Emergency Meeting';
  if (els.callerInfoEl) {
    const col = data.callerColor || '#ecf0f1';
    els.callerInfoEl.innerHTML = `<span style="color:${col};font-weight:bold">${data.callerName}</span> called ${data.type === 'report' ? 'a body report' : 'an emergency meeting'}` +
      (data.bodyName ? ` — <span style="color:#e74c3c">💀 ${data.bodyName} is dead</span>` : '');
  }

  if (els.voteResultEl) {
    els.voteResultEl.style.display = 'none';
    els.voteResultEl.textContent = '';
  }
  if (els.chatPanel) els.chatPanel.classList.remove('open');
  if (els.chatMessages) els.chatMessages.innerHTML = '';
  if (els.chatInput) els.chatInput.value = '';

  buildPlayerList();
  if (els.skipBtn) {
    els.skipBtn.disabled = false;
    els.skipBtn.className = 'skip-btn';
    els.skipBtn.textContent = '⏭ Skip Vote';
  }

  updateTimer();
  if (meetingTimerInterval) clearInterval(meetingTimerInterval);
  meetingTimerInterval = setInterval(() => {
    meetingTimeLeft--;
    updateTimer();
    if (meetingTimeLeft <= 0) clearInterval(meetingTimerInterval);
  }, 1000);
}

function buildPlayerList() {
  const els = getMeetingElements();
  try {
    if (!els.playerListEl || !window.players) return;
    els.playerListEl.innerHTML = '';
    const amIDead = window.players[window.myId] && window.players[window.myId].isDead;

    for (let id in window.players) {
      const p = window.players[id];
      const row = document.createElement('div');
      row.className = 'vote-player-row' + (p.isDead ? ' dead' : '');
      row.id = `vrow-${id}`;

      const dot = document.createElement('span');
      dot.className = 'vote-color-dot';
      dot.style.background = p.color;

      const name = document.createElement('span');
      name.className = 'vote-player-name';
      name.textContent = (p.isDead ? '💀 ' : '') + p.name + (id === window.myId ? ' (You)' : '');

      const check = document.createElement('span');
      check.className = 'voted-check';
      check.id = `vck-${id}`;
      check.textContent = '';

      const tally = document.createElement('span');
      tally.className = 'vote-tally';
      tally.id = `vtl-${id}`;

      row.append(dot, name, tally, check);

      if (!amIDead && !p.isDead && id !== window.myId) {
        const btn = document.createElement('button');
        btn.className = 'vote-btn';
        btn.textContent = 'Vote';
        btn.id = `vbtn-${id}`;
        btn.addEventListener('click', () => castVote(id));
        row.appendChild(btn);
      }
      els.playerListEl.appendChild(row);
    }
  } catch (err) {
    console.error("MEETING SYSTEM: Error in buildPlayerList:", err);
  }
}

function castVote(targetId) {
  const els = getMeetingElements();
  if (myVote !== null || !window.socket) return;
  myVote = targetId;
  window.socket.emit('castVote', targetId);

  document.querySelectorAll('.vote-btn').forEach(b => b.disabled = true);
  if (els.skipBtn) els.skipBtn.disabled = true;

  if (targetId === 'skip') {
    if (els.skipBtn) {
      els.skipBtn.className = 'skip-btn chosen';
      els.skipBtn.textContent = '✓ Skipped';
    }
  } else {
    const b = document.getElementById(`vbtn-${targetId}`);
    if (b) { b.classList.add('chosen'); b.textContent = '✓ Voted'; }
  }
}

function updateTimer() {
  const els = getMeetingElements();
  if (!els.voteTimerEl) return;
  const m = Math.floor(meetingTimeLeft / 60);
  const s = meetingTimeLeft % 60;
  els.voteTimerEl.textContent = `${m}:${String(s).padStart(2,'0')}`;
  els.voteTimerEl.style.color = meetingTimeLeft <= 10 ? '#e74c3c' : '#f1c40f';
}

function showResult(data) {
  try {
    clearInterval(meetingTimerInterval);
    document.querySelectorAll('.vote-btn').forEach(b => b.disabled = true);
    const els = getMeetingElements();
    if (els.skipBtn) els.skipBtn.disabled = true;

    for (let id in data.votes) {
      const el = document.getElementById(`vtl-${id}`);
      if (el && id !== 'skip') el.textContent = `×${data.votes[id]}`;
    }

    if (els.voteResultEl) {
      els.voteResultEl.style.display = 'block';
      if (data.eliminated) {
        els.voteResultEl.textContent = `🚀 ${data.eliminatedName} was killed!`;
        els.voteResultEl.style.color = '#e74c3c';
        const row = document.getElementById(`vrow-${data.eliminated}`);
        if (row) row.classList.add('ejected');
        
        if (window.players && window.players[data.eliminated]) {
          window.players[data.eliminated].isDead = true;
          const p = window.players[data.eliminated];
          if (window.bodies && !window.bodies.some(b => b.name === p.name && Math.hypot(b.x-p.x, b.y-p.y) < 5)) {
            window.bodies.push({ x: p.x, y: p.y, color: p.color, name: p.name, role: p.role, ejected: true });
          }
        }
      } else {
        els.voteResultEl.textContent = 'No one was killed. (Tie or skip)';
        els.voteResultEl.style.color = '#95a5a6';
      }
    }

    if (data.spawnPositions && window.players) {
      for (const id in data.spawnPositions) {
        if (window.players[id]) {
          window.players[id].x = data.spawnPositions[id].x;
          window.players[id].y = data.spawnPositions[id].y;
        }
      }
    }
  } catch (err) {
    console.error("MEETING SYSTEM: Critical error in showResult:", err);
  }

  setTimeout(() => {
    closeMeeting();
    if (typeof checkWinCondition === 'function') checkWinCondition();
  }, 4000);
}

function closeMeeting() {
  const els = getMeetingElements();
  window.meetingActive = false;
  window.meetingStartTime = 0;
  myVote = null;
  if (els.voteScreen) els.voteScreen.style.display = 'none';
  window.taskModalActive = false;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const els = getMeetingElements();
    if (els.skipBtn) els.skipBtn.addEventListener('click', () => castVote('skip'));
    if (els.chatToggleBtn && els.chatPanel) {
        els.chatToggleBtn.addEventListener('click', () => {
            const open = els.chatPanel.classList.toggle('open');
            els.chatToggleBtn.textContent = open ? '💬 Close Chat ▲' : '💬 Open Chat ▼';
            if (open && els.chatInput) els.chatInput.focus();
        });
    }
    if (els.chatInput) {
        els.chatInput.addEventListener('keydown', e => { if (e.code === 'Enter') sendChat(); });
    }
    if (els.chatSendBtn) {
        els.chatSendBtn.addEventListener('click', sendChat);
    }
});

function sendChat() {
  const els = getMeetingElements();
  if (!els.chatInput || !window.socket) return;
  const t = els.chatInput.value.trim();
  if (!t || !window.meetingActive) return;
  els.chatInput.value = '';
  window.socket.emit('meetingChat', t);
}

function appendChat(name, color, text, isDead) {
  const els = getMeetingElements();
  if (!window.players || !els.chatMessages) return;
  const iAmDead = window.players[window.myId] && window.players[window.myId].isDead;
  if (isDead && !iAmDead) return;

  const d = document.createElement('div');
  d.className = 'chat-msg' + (isDead ? ' ghost-msg' : '');
  d.innerHTML = `<span class="chat-name" style="color:${color}">${isDead ? '👻 ' : ''}${name}:</span> ${text}`;
  els.chatMessages.appendChild(d);
  els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
}
