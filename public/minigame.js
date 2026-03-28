// =====================================================
//  MINIGAME SYSTEM — The Primitive Peer
//  Loaded after game.js. Uses globals: TASKS, players,
//  myId, socket, completedTasks defined in game.js
// =====================================================

// ---------- Task → Minigame mapping ----------
const TASK_MINIGAME = {
  t1:  'wire',    // Fix Relay
  t2:  'simon',   // Charge Battery
  t3:  'dial',    // Align Dish
  t4:  'crates',  // Mix Solution
  t5:  'wire',    // Restore Power
  t6:  'simon',   // Upload Data
  t7:  'simon',   // Cool Reactor
  t8:  'crates',  // Seal Pit Crack
  t9:  'crates',  // Collect Samples
  t10: 'dial',    // Survey Zone
  t11: 'crates',  // Mark Boundary
  t12: 'crates',  // Drop Supply
};

// ---------- Coding Question Pool — ALL multiple choice ----------
const CODING_QUESTIONS = [
  // ---- JavaScript ----
  {
    lang: 'JavaScript',
    prompt: 'Find the error in this code:',
    code: 'for (let i = 0; i < 10; i--) {\n  console.log(i);\n}',
    options: ['i-- should be i++', 'Missing semicolon after i--', 'console.log is not valid', 'let should be const'],
    answer: 0
  },
  {
    lang: 'JavaScript',
    prompt: 'What is wrong with this code?',
    code: 'console.log("Hello World);',
    options: ['Missing closing quote "', 'console.log needs square brackets', 'Semicolon is misplaced', 'Nothing — it runs fine'],
    answer: 0
  },
  {
    lang: 'JavaScript',
    prompt: 'Which method adds an item to the END of an array?',
    code: 'const fruits = ["apple", "banana"];\nfruits.___("cherry");',
    options: ['push()', 'pop()', 'shift()', 'append()'],
    answer: 0
  },
  {
    lang: 'JavaScript',
    prompt: 'Which is the correct way to log to the console?',
    code: '// Print the value of x',
    options: ['console.log(x)', 'print(x)', 'log.console(x)', 'Console.log(x)'],
    answer: 0
  },
  {
    lang: 'JavaScript',
    prompt: 'What will this code output?',
    code: 'let x = "5" + 3;\nconsole.log(x);',
    options: ['"53" (string concat)', '8 (number addition)', 'Error — type mismatch', '5.3'],
    answer: 0
  },
  {
    lang: 'JavaScript',
    prompt: 'What goes in the blank to make the loop work correctly?',
    code: 'for (let i = 0; i < arr.length; ___) {\n  console.log(arr[i]);\n}',
    options: ['i++', 'i--', 'i+1', 'i += 0'],
    answer: 0
  },
  {
    lang: 'JavaScript',
    prompt: 'Find the bug in this function:',
    code: 'function add(a, b) {\n  return a - b;\n}',
    options: ['Should be a + b', 'Missing semicolon after return', 'Parameters need type declarations', 'Function name is invalid'],
    answer: 0
  },
  {
    lang: 'JavaScript',
    prompt: 'Which fills the blank to get the square root of 25?',
    code: 'const result = Math.___(25);',
    options: ['sqrt', 'squareRoot', 'root', 'pow'],
    answer: 0
  },
  {
    lang: 'JavaScript',
    prompt: 'What does this code do?',
    code: 'const arr = [3, 1, 2];\narr.sort();',
    options: ['Sorts arr alphabetically in place', 'Returns a new sorted array', 'Sorts arr numerically', 'Throws an error'],
    answer: 0
  },
  {
    lang: 'JavaScript',
    prompt: 'Which keyword declares a variable that CANNOT be reassigned?',
    code: '___ PI = 3.14;',
    options: ['const', 'let', 'var', 'static'],
    answer: 0
  },

  // ---- Python ----
  {
    lang: 'Python',
    prompt: 'Find the error in this Python code:',
    code: 'for i in range(10)\n    print(i)',
    options: ['Missing colon : after range(10)', 'range() takes no arguments', 'print needs parentheses in Python 2 only', 'Indentation is wrong'],
    answer: 0
  },
  {
    lang: 'Python',
    prompt: 'Which is the correct way to print in Python 3?',
    code: '# Output: Hello',
    options: ['print("Hello")', 'echo("Hello")', 'console.log("Hello")', 'puts("Hello")'],
    answer: 0
  },
  {
    lang: 'Python',
    prompt: 'What is wrong with this comparison?',
    code: 'x = 10\nif x = 10:\n    print("yes")',
    options: ['Should be == not =', 'Missing parentheses around condition', 'print needs double quotes', 'x must be declared first'],
    answer: 0
  },
  {
    lang: 'Python',
    prompt: 'Which keyword defines a function in Python?',
    code: '___ greet(name):\n    print("Hello, " + name)',
    options: ['def', 'func', 'function', 'define'],
    answer: 0
  },
  {
    lang: 'Python',
    prompt: 'What does this code output?',
    code: 'x = [1, 2, 3]\nprint(len(x))',
    options: ['3', '[1,2,3]', '1', 'Error'],
    answer: 0
  },
  {
    lang: 'Python',
    prompt: 'Which correctly creates a list in Python?',
    code: '# A list of numbers 1 to 3',
    options: ['[1, 2, 3]', '{1, 2, 3}', '(1, 2, 3)', '<1, 2, 3>'],
    answer: 0
  },
  {
    lang: 'Python',
    prompt: 'What is the result of 10 // 3 in Python?',
    code: 'print(10 // 3)',
    options: ['3 (integer division)', '3.33', '1 (remainder)', 'Error'],
    answer: 0
  },
  {
    lang: 'Python',
    prompt: 'Which method adds an item to a Python list?',
    code: 'numbers = [1, 2, 3]\nnumbers.___( 4)',
    options: ['append()', 'push()', 'add()', 'insert()'],
    answer: 0
  },

  // ---- HTML ----
  {
    lang: 'HTML',
    prompt: 'Find the error in this HTML:',
    code: '<p>Hello World<p>',
    options: ['Should be </p> not <p> at the end', '<p> is not a valid tag', 'Text must be inside quotes', 'Missing a semicolon'],
    answer: 0
  },
  {
    lang: 'HTML',
    prompt: 'Which tag creates a clickable button?',
    code: '<___ id="myBtn">Click Me</___ >',
    options: ['<button>', '<click>', '<input>', '<a>'],
    answer: 0
  },
  {
    lang: 'HTML',
    prompt: 'Which attribute links an external CSS file?',
    code: '<link rel="stylesheet" ___="style.css">',
    options: ['href', 'src', 'link', 'url'],
    answer: 0
  },
  {
    lang: 'HTML',
    prompt: 'What tag is used for the largest heading?',
    code: '<!-- Page title -->',
    options: ['<h1>', '<h6>', '<title>', '<header>'],
    answer: 0
  },
  {
    lang: 'HTML',
    prompt: 'Which tag creates an unordered list?',
    code: '<___>\n  <li>Item 1</li>\n</___>',
    options: ['<ul>', '<ol>', '<list>', '<dl>'],
    answer: 0
  },

  // ---- CSS ----
  {
    lang: 'CSS',
    prompt: 'Find the error in this CSS:',
    code: 'p {\n  color = red;\n}',
    options: ['Should use colon : not equals =', 'Missing semicolon after red', 'p {} selector is invalid', 'color is not a valid property'],
    answer: 0
  },
  {
    lang: 'CSS',
    prompt: 'Which value centers text horizontally?',
    code: 'p {\n  text-align: ___;\n}',
    options: ['center', 'middle', 'align', 'justify-center'],
    answer: 0
  },
  {
    lang: 'CSS',
    prompt: 'What does display: none do?',
    code: '.box {\n  display: none;\n}',
    options: ['Hides element, removes it from layout', 'Makes it invisible but keeps space', 'Deletes the element from DOM', 'Turns it into a flex container'],
    answer: 0
  },
  {
    lang: 'CSS',
    prompt: 'Which property changes the font size?',
    code: 'h1 {\n  ___: 24px;\n}',
    options: ['font-size', 'text-size', 'font-scale', 'size'],
    answer: 0
  },
  {
    lang: 'CSS',
    prompt: 'Which selector targets elements with class "box"?',
    code: '___ {\n  background: blue;\n}',
    options: ['.box', '#box', 'box', '*box'],
    answer: 0
  },

  // ---- Java ----
  {
    lang: 'Java',
    prompt: 'Find the error in this Java code:',
    code: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello"\n  }\n}',
    options: ['Missing closing parenthesis )', 'println needs double braces', 'Missing public on main', 'String[] should be string[]'],
    answer: 0
  },
  {
    lang: 'Java',
    prompt: 'Which is the correct way to print in Java?',
    code: '// Print Hello World',
    options: ['System.out.println("Hi")', 'print("Hi")', 'console.log("Hi")', 'echo "Hi"'],
    answer: 0
  },
  {
    lang: 'Java',
    prompt: 'What is wrong with this Java code?',
    code: 'int x = "hello";',
    options: ['Cannot assign a String to an int', 'Missing semicolon', 'int is not a valid type', 'hello needs to be capitalised'],
    answer: 0
  },
  {
    lang: 'Java',
    prompt: 'Which keyword creates a constant in Java?',
    code: '___ int MAX = 100;',
    options: ['final', 'const', 'static', 'fixed'],
    answer: 0
  },
  {
    lang: 'Java',
    prompt: 'What type stores true/false in Java?',
    code: '___ isAlive = true;',
    options: ['boolean', 'bool', 'bit', 'flag'],
    answer: 0
  },
];

// ---------- Modal State ----------
let currentTask = null;
let currentQuestion = null;
let codingAttempts = 0;
const MAX_ATTEMPTS = 2;

const modal       = document.getElementById('task-modal');
const mgStage     = document.getElementById('minigame-stage');
const codingStage = document.getElementById('coding-stage');
const progressFill= document.getElementById('modal-progress-fill');
const modalIcon   = document.getElementById('modal-icon');
const modalTitle  = document.getElementById('modal-title');
const modalStageLabel = document.getElementById('modal-stage-label');
const mgFeedback  = document.getElementById('mg-feedback');
const mgWrap      = document.getElementById('minigame-canvas-wrap');
const closeBtn    = document.getElementById('modal-close-btn');
const cancelBtn2  = document.getElementById('coding-cancel-btn');
const submitBtn   = document.getElementById('coding-submit-btn');
const attemptIndicator = document.getElementById('attempt-indicator');
const codingFeedback   = document.getElementById('coding-feedback');

closeBtn.addEventListener('click', closeModal);
cancelBtn2.addEventListener('click', closeModal);

function closeModal() {
  modal.classList.remove('active');
  currentTask = null;
  currentQuestion = null;
  codingAttempts = 0;
  // Clean up any minigame timers
  if (simonTimeout) { clearTimeout(simonTimeout); simonTimeout = null; }
  // re-enable game keys
  if (typeof taskModalActive !== 'undefined') window.taskModalActive = false;
}

// Called from game.js keydown [F]
window.openTaskModal = function(task) {
  if (!task || task.done || completedTasks.has(task.id)) return;
  currentTask = task;
  codingAttempts = 0;

  // Configure header
  const icon = task.label.split(' ')[0];
  modalIcon.textContent = icon;
  modalTitle.textContent = task.label.replace(icon, '').trim();

  // Show Stage 1
  showMinigameStage();
  modal.classList.add('active');
  window.taskModalActive = true;
};

// ===========================
//  STAGE 1 — MINIGAME
// ===========================
function showMinigameStage() {
  mgStage.classList.remove('hidden');
  codingStage.classList.remove('active');
  mgStage.style.display = '';
  codingStage.style.display = 'none';
  modalStageLabel.textContent = 'Stage 1 / 2 — Minigame';
  progressFill.style.width = '0%';
  mgFeedback.textContent = '';
  mgWrap.innerHTML = '';

  const type = TASK_MINIGAME[currentTask.id] || 'crates';
  switch(type) {
    case 'wire':   startWireGame();   break;
    case 'simon':  startSimonGame();  break;
    case 'dial':   startDialGame();   break;
    case 'crates': startCratesGame(); break;
  }
}

// -------- WIRE CONNECT minigame --------
function startWireGame() {
  document.getElementById('minigame-instructions').textContent =
    'Connect each wire on the left to its matching colour on the right.';

  const C = ['#e74c3c','#3498db','#2ecc71','#f39c12'];
  const labels = [...C];
  const rights = shuffle([...C]);

  const canvas = document.createElement('canvas');
  canvas.width = 340; canvas.height = 200;
  canvas.id = 'minigame-canvas';
  mgWrap.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const leftPegs  = C.map((c,i)   => ({ x: 40,  y: 40 + i*40, c }));
  const rightPegs = rights.map((c,i) => ({ x: 300, y: 40 + i*40, c }));
  let connections = {}; // leftIndex → rightIndex
  let dragging = null;  // { fromLeft: idx, curX, curY }

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // pegs
    [...leftPegs, ...rightPegs].forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI*2);
      ctx.fillStyle = p.c; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    });
    // completed connections
    for (let li in connections) {
      const ri = connections[li];
      ctx.beginPath();
      ctx.moveTo(leftPegs[li].x, leftPegs[li].y);
      ctx.lineTo(rightPegs[ri].x, rightPegs[ri].y);
      ctx.strokeStyle = leftPegs[li].c;
      ctx.lineWidth = 4; ctx.stroke();
    }
    // drag line
    if (dragging !== null) {
      const lp = leftPegs[dragging.idx];
      ctx.beginPath(); ctx.moveTo(lp.x, lp.y);
      ctx.lineTo(dragging.x, dragging.y);
      ctx.strokeStyle = lp.c; ctx.lineWidth = 3;
      ctx.setLineDash([6,4]); ctx.stroke(); ctx.setLineDash([]);
    }
  }
  draw();

  canvas.addEventListener('mousedown', e => {
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    leftPegs.forEach((p,i) => {
      if (Math.hypot(mx-p.x, my-p.y) < 16) {
        delete connections[i]; // allow rewire
        dragging = { idx: i, x: mx, y: my };
      }
    });
  });
  canvas.addEventListener('mousemove', e => {
    if (dragging === null) return;
    const r = canvas.getBoundingClientRect();
    dragging.x = e.clientX - r.left;
    dragging.y = e.clientY - r.top;
    draw();
  });
  canvas.addEventListener('mouseup', e => {
    if (dragging === null) return;
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    rightPegs.forEach((p,ri) => {
      if (Math.hypot(mx-p.x, my-p.y) < 16) {
        connections[dragging.idx] = ri;
      }
    });
    dragging = null;
    draw();
    // Check win
    if (Object.keys(connections).length === C.length) {
      let ok = true;
      for (let li in connections) {
        if (leftPegs[li].c !== rightPegs[connections[li]].c) { ok = false; break; }
      }
      if (ok) { onMinigameComplete(); }
      else { mgFeedback.textContent = 'Some wires don\'t match — try again!'; }
    }
  });
}

// -------- SIMON SAYS minigame --------
let simonTimeout = null;
function startSimonGame() {
  document.getElementById('minigame-instructions').textContent =
    'Watch the sequence, then repeat it by clicking the same buttons in order.';

  const COLORS = [
    { id: 'sg-r', color: '#e74c3c', shadow: '#c0392b' },
    { id: 'sg-b', color: '#3498db', shadow: '#2980b9' },
    { id: 'sg-g', color: '#2ecc71', shadow: '#27ae60' },
    { id: 'sg-y', color: '#f1c40f', shadow: '#f39c12' },
  ];
  const SEQ_LEN = 4;
  const sequence = Array.from({length: SEQ_LEN}, () => Math.floor(Math.random() * 4));
  let playerSeq = [];
  let showing = true;

  const grid = document.createElement('div');
  grid.className = 'mg-grid';
  grid.style.gridTemplateColumns = '1fr 1fr';
  COLORS.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'mg-btn'; btn.id = c.id;
    btn.style.background = c.color;
    btn.style.boxShadow = `0 0 0px ${c.shadow}`;
    btn.disabled = true;
    btn.textContent = '';
    btn.addEventListener('click', () => {
      if (showing) return;
      playerSeq.push(i);
      flash(i, true);
      if (playerSeq[playerSeq.length-1] !== sequence[playerSeq.length-1]) {
        mgFeedback.textContent = 'Wrong order! Watch again...';
        playerSeq = [];
        showing = true;
        setTimeout(() => playSequence(), 1000);
        return;
      }
      if (playerSeq.length === SEQ_LEN) {
        onMinigameComplete();
      }
    });
    grid.appendChild(btn);
  });
  mgWrap.appendChild(grid);

  function flash(idx, isPlayer = false) {
    const btn = document.getElementById(COLORS[idx].id);
    btn.classList.add('lit');
    setTimeout(() => btn.classList.remove('lit'), isPlayer ? 200 : 400);
  }

  function playSequence() {
    mgFeedback.textContent = 'Memorize the sequence...';
    COLORS.forEach(c => document.getElementById(c.id).disabled = true);
    let i = 0;
    function step() {
      if (i >= sequence.length) {
        showing = false;
        mgFeedback.textContent = 'Now repeat the sequence!';
        COLORS.forEach(c => document.getElementById(c.id).disabled = false);
        return;
      }
      flash(sequence[i]);
      i++;
      simonTimeout = setTimeout(step, 700);
    }
    simonTimeout = setTimeout(step, 500);
  }
  playSequence();
}

// -------- DIAL TUNE minigame --------
function startDialGame() {
  document.getElementById('minigame-instructions').textContent =
    'Drag the handle into the green target zone and release.';

  const TRACK_W = 380;
  const zoneStart = 0.3 + Math.random() * 0.35; // 30–65%
  const zoneWidth = 0.13;

  const wrap = document.createElement('div');
  wrap.className = 'mg-dial-wrap';
  wrap.style.width = TRACK_W + 'px';

  const track = document.createElement('div');
  track.className = 'mg-dial-track';
  track.style.width = TRACK_W + 'px';

  const zone = document.createElement('div');
  zone.className = 'mg-dial-zone';
  zone.style.left   = (zoneStart * 100) + '%';
  zone.style.width  = (zoneWidth * 100) + '%';
  track.appendChild(zone);

  let handlePos = 0.05;
  const handle = document.createElement('div');
  handle.className = 'mg-dial-handle';
  handle.style.left = (handlePos * 100) + '%';
  handle.textContent = '⇔';
  track.appendChild(handle);

  wrap.appendChild(track);
  const label = document.createElement('p');
  label.style.cssText = 'color:#95a5a6;font-size:12px;text-align:center;margin-top:8px;';
  label.textContent = `Target: ${Math.round(zoneStart*100)}%–${Math.round((zoneStart+zoneWidth)*100)}%`;
  wrap.appendChild(label);
  mgWrap.appendChild(wrap);

  let dragging = false;
  handle.addEventListener('mousedown', () => dragging = true);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  function onMouseMove(e) {
    if (!dragging) return;
    const r = track.getBoundingClientRect();
    let t = (e.clientX - r.left) / r.width;
    t = Math.max(0, Math.min(1, t));
    handlePos = t;
    handle.style.left = (t * 100) + '%';
  }
  function onMouseUp() {
    if (!dragging) return;
    dragging = false;
    if (handlePos >= zoneStart && handlePos <= zoneStart + zoneWidth) {
      handle.style.background = '#2ecc71';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      setTimeout(onMinigameComplete, 400);
    } else {
      mgFeedback.textContent = 'Not quite — try again!';
      handle.style.background = '#e74c3c';
      setTimeout(() => handle.style.background = '#f39c12', 600);
    }
  }
  // Cleanup on modal close
  const origClose = window._dialCleanup;
  window._dialCleanup = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    if (origClose) origClose();
  };
}

// -------- SORT CRATES minigame --------
function startCratesGame() {
  document.getElementById('minigame-instructions').textContent =
    'Click the crates in ascending order (smallest to largest).';

  const count = 5;
  const nums = shuffle(Array.from({length: count}, (_,i) => i+1));
  let nextExpected = 1;

  const row = document.createElement('div');
  row.className = 'mg-crates';

  nums.forEach(n => {
    const crate = document.createElement('div');
    crate.className = 'mg-crate';
    crate.textContent = n;
    crate.dataset.num = n;
    crate.addEventListener('click', () => {
      if (parseInt(crate.dataset.num) === nextExpected) {
        crate.classList.add('done');
        crate.style.pointerEvents = 'none';
        nextExpected++;
        mgFeedback.textContent = '';
        if (nextExpected > count) onMinigameComplete();
      } else {
        crate.classList.add('wrong');
        mgFeedback.textContent = `Wrong! Click ${nextExpected} next.`;
        setTimeout(() => crate.classList.remove('wrong'), 400);
      }
    });
    row.appendChild(crate);
  });
  mgWrap.appendChild(row);
}

// ===========================
//  Minigame complete → Stage 2
// ===========================
function onMinigameComplete() {
  mgFeedback.textContent = '';
  progressFill.style.width = '50%';
  // Transition to coding stage after a brief hold
  setTimeout(showCodingStage, 500);
}

// ===========================
//  STAGE 2 — CODING QUESTION
// ===========================
function showCodingStage() {
  mgStage.style.display = 'none';
  codingStage.style.display = 'block';
  modalStageLabel.textContent = 'Stage 2 / 2 — Coding Question';
  codingAttempts = 0;
  codingFeedback.textContent = '';
  attemptIndicator.textContent = '';

  // Pick a random question
  currentQuestion = CODING_QUESTIONS[Math.floor(Math.random() * CODING_QUESTIONS.length)];
  renderCodingQuestion(currentQuestion);
}

function renderCodingQuestion(q) {
  document.getElementById('coding-lang').textContent = q.lang;
  document.getElementById('coding-prompt').textContent = q.prompt;
  document.getElementById('coding-code').textContent = q.code;
  codingFeedback.textContent = '';

  const answerArea = document.getElementById('coding-answer-area');
  answerArea.innerHTML = '';
  submitBtn.style.display = 'none'; // all questions are MC, no submit button needed

  // Shuffle the options but track the correct answer text
  const correctText = q.options[q.answer];
  const shuffled = shuffle([...q.options]);
  const newAnswerIdx = shuffled.indexOf(correctText);

  const grid = document.createElement('div');
  grid.className = 'mc-options';
  shuffled.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'mc-opt';
    btn.textContent = opt;
    btn.addEventListener('click', () => checkMCAnswer(i, { ...q, options: shuffled, answer: newAnswerIdx }, grid));
    grid.appendChild(btn);
  });
  answerArea.appendChild(grid);
}

function checkMCAnswer(chosen, q, grid) {
  const btns = grid.querySelectorAll('.mc-opt');
  if (chosen === q.answer) {
    btns[chosen].classList.add('correct');
    onTaskFullyComplete();
  } else {
    btns[chosen].classList.add('wrong');
    codingAttempts++;
    updateAttemptUI();
    if (codingAttempts >= MAX_ATTEMPTS) {
      codingFeedback.textContent = `Out of attempts! The answer was: "${q.options[q.answer]}". Task reset.`;
      btns[q.answer].classList.add('correct');
      btns.forEach(b => b.disabled = true);
      setTimeout(closeModal, 2500);
    } else {
      codingFeedback.textContent = `Incorrect! ${MAX_ATTEMPTS - codingAttempts} attempt(s) left.`;
    }
  }
}

function checkBlankAnswer(ans, q) {
  if (ans.toLowerCase() === q.answer.toLowerCase()) {
    codingFeedback.style.color = '#2ecc71';
    codingFeedback.textContent = '✓ Correct!';
    submitBtn.disabled = true;
    setTimeout(onTaskFullyComplete, 600);
  } else {
    codingAttempts++;
    codingFeedback.style.color = '#e74c3c';
    updateAttemptUI();
    if (codingAttempts >= MAX_ATTEMPTS) {
      codingFeedback.textContent = `Out of attempts! The answer was: "${q.answer}". Task reset.`;
      submitBtn.disabled = true;
      setTimeout(closeModal, 2500);
    } else {
      codingFeedback.textContent = `Incorrect! ${MAX_ATTEMPTS - codingAttempts} attempt(s) left.`;
    }
  }
}

function updateAttemptUI() {
  const left = MAX_ATTEMPTS - codingAttempts;
  attemptIndicator.textContent = left > 0 ? `⚠️ ${left} attempt${left!==1?'s':''} left` : '';
}

// ===========================
//  Task complete!
// ===========================
function onTaskFullyComplete() {
  progressFill.style.width = '100%';
  codingFeedback.style.color = '#2ecc71';
  codingFeedback.textContent = '✅ Task Complete!';

  const task = currentTask;
  setTimeout(() => {
    completedTasks.add(task.id);
    socket.emit('taskComplete', task.id);
    // Check if this player finished all 7 assigned tasks
    if (typeof checkTaskWinCondition === 'function') checkTaskWinCondition();
    closeModal();

  }, 700);
}

// ===========================
//  Hook into game.js
// ===========================
// Override the showTaskPrompt so pressing F opens the modal
window.taskModalActive = false;

// Patch into game.js key handler
document.addEventListener('keydown', e => {
  // Block movement keys while modal open
  if (window.taskModalActive && ['w','a','s','d',' '].includes(e.key.toLowerCase())) {
    e.stopImmediatePropagation();
  }
});

// Replace the game.js [F] handler with our modal opener
// Only fire for tasks assigned to this player (myTaskIds)
document.addEventListener('keydown', e => {
  if (e.code === 'KeyF' && !window.taskModalActive) {
    const me = players && myId && players[myId];
    if (!me || me.isDead) return;
    const assignedTasks = window.myTaskIds; // set by game.js
    for (let task of TASKS) {
      if (assignedTasks && !assignedTasks.has(task.id)) continue; // skip unassigned
      if (completedTasks.has(task.id)) continue;
      if (Math.hypot(me.x - task.x, me.y - task.y) < 50) {
        window.openTaskModal(task);
        break;
      }
    }
  }
}, true); // capture phase so it fires before game.js bubbling handler

// ===========================
//  Utility
// ===========================
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
