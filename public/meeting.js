// =====================================================
//  MEETING SYSTEM — Unified UI Stacking (UNFAILABLE SYNC)
//  Synchronized with: window.socket, window.players, window.myId, window.bodies
// =====================================================

let meetingTimerInterval = null;
let meetingTimeLeft = 60;
let myVote = null;
const votedPlayers = new Set(); 

function getMeetingElements() {
  return {
    uiLayer:       document.getElementById('ui-layer'),
    uiSection:     document.getElementById('meeting-ui-section'),
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
    chatSendBtn:   document.getElementById('chat-send-btn')
  };
}

// ===== Diagnostic Helper (Type DEV_TEST_MEETING() in console) =====
window.DEV_TEST_MEETING = function() {
    console.log("MEETING SYSTEM: Manual test triggered via DEV_TEST_MEETING()");
    openMeeting({
        type: 'emergency',
        callerName: 'DEVELOPER',
        callerColor: '#3498db'
    });
};

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
}

// ===== Open Meeting =====
function openMeeting(data) {
  const els = getMeetingElements();
  
  // Close any active task modal
  if (typeof closeModal === 'function') closeModal();
  
  window.meetingActive = true;
  window.meetingStartTime = Date.now(); 
  myVote = null;
  votedPlayers.clear();
  meetingTimeLeft = 60;
  window.taskModalActive = true; 

  if (!els.uiLayer || !els.uiSection) {
    console.error("MEETING SYSTEM: Primary UI Layer missing!");
    return;
  }

  // FORCE UI LAYER VISIBILITY (The layer that has worked for lobby/modals)
  els.uiLayer.classList.remove('hidden');
  els.uiSection.classList.remove('hidden');

  // Strobe/Flash initialization
  if (els.flashEl && els.flashText) {
      els.flashEl.style.setProperty('display', 'flex', 'important');
      const isReport = data.type === 'report';
      els.flashText.style.color = isReport ? '#e74c3c' : '#f39c12';
      els.flashText.innerHTML = isReport ? '💀 DEAD BODY<br>REPORTED!' : '⚠️ EMERGENCY<br>MEETING!';
  }

  console.log("MEETING SYSTEM: Meeting opened successfully.", data);
  
  setTimeout(() => {
    if (els.flashEl) els.flashEl.style.display = 'none';
    showVoteScreen(data);
  }, 2500);

  // Mark body reported
  if (data.type === 'report' && data.bodyName && window.bodies) {
    const b = window.bodies.find(bd => bd.name === data.bodyName && !bd.ejected);
    if (b) b.reported = true;
  }
}

function showVoteScreen(data) {
  const els = getMeetingElements();
  if (!els.voteScreen) return;
  
  els.voteScreen.style.setProperty('display', 'flex', 'important');

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

  buildPlayerList();
  if (els.skipBtn) {
    els.skipBtn.disabled = false;
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
  if (!els.playerListEl || !window.players) return;
  els.playerListEl.innerHTML = '';
  const amIDead = window.players[window.myId] && window.players[window.myId].isDead;

  for (let id in window.players) {
    const p = window.players[id];
    const row = document.createElement('div');
    row.className = 'vote-player-row' + (p.isDead ? ' dead' : '');
    row.id = `vrow-${id}`;
    row.innerHTML = `
        <span class="vote-color-dot" style="background:${p.color}"></span>
        <span class="vote-player-name">${(p.isDead ? '💀 ' : '') + p.name + (id === window.myId ? ' (You)' : '')}</span>
        <span class="vote-tally" id="vtl-${id}"></span>
        <span class="voted-check" id="vck-${id}"></span>
    `;

    if (!amIDead && !p.isDead && id !== window.myId) {
      const btn = document.createElement('button');
      btn.className = 'vote-btn';
      btn.textContent = 'Vote';
      btn.addEventListener('click', () => castVote(id));
      row.appendChild(btn);
    }
    els.playerListEl.appendChild(row);
  }
}

function castVote(targetId) {
  const els = getMeetingElements();
  if (myVote !== null || !window.socket) return;
  myVote = targetId;
  window.socket.emit('castVote', targetId);

  document.querySelectorAll('.vote-btn').forEach(b => b.disabled = true);
  if (els.skipBtn) {
      els.skipBtn.disabled = true;
      if (targetId === 'skip') els.skipBtn.textContent = '✓ Skipped';
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
    const els = getMeetingElements();
    
    document.querySelectorAll('.vote-btn').forEach(b => b.disabled = true);
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
        if (window.players && window.players[data.eliminated]) {
           window.players[data.eliminated].isDead = true;
        }
      } else {
        els.voteResultEl.textContent = 'No one was killed. (Tie or skip)';
        els.voteResultEl.style.color = '#95a5a6';
      }
    }
  } catch (err) {
    console.error("MEETING SYSTEM: Error in showResult:", err);
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
  window.radarStartTime = Date.now(); // Reset caveman radar
  myVote = null;
  if (els.uiSection) els.uiSection.classList.add('hidden');
  if (els.voteScreen) els.voteScreen.style.display = 'none';
  window.taskModalActive = false;
}

// Event Listeners (Immediate attachment for bottom-of-body scripts)
const e = getMeetingElements();
if (e.skipBtn) e.skipBtn.onclick = () => castVote('skip');
if (e.chatToggleBtn) e.chatToggleBtn.onclick = () => {
    const open = e.chatPanel.classList.toggle('open');
    e.chatToggleBtn.textContent = open ? '💬 Close Chat ▲' : '💬 Open Chat ▼';
    if (open && e.chatInput) e.chatInput.focus();
};
if (e.chatSendBtn) e.chatSendBtn.onclick = sendChat;
if (e.chatInput) e.chatInput.onkeydown = (ev) => { if (ev.code === 'Enter') sendChat(); };

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
