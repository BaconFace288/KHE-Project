// =====================================================
//  MINIGAME SYSTEM — The Primitive Peer
//  Loaded after game.js. Uses globals: TASKS, players,
//  myId, socket, completedTasks defined in game.js
// =====================================================

// ---------- Task → Minigame mapping ----------
const TASK_MINIGAME = {
  t1:  't1_relay',      // Fix Relay
  t2:  't2_battery',    // Charge Battery
  t3:  't3_dish',       // Align Dish
  t4:  't4_mix',        // Mix Solution
  t5:  't5_power',      // Restore Power
  t6:  't6_upload',     // Upload Data
  t7:  't7_reactor',    // Cool Reactor
  t8:  't8_crack',      // Seal Pit Crack
  t9:  't9_samples',    // Collect Samples
  t10: 't10_survey',    // Survey Zone
  t11: 't11_boundary',  // Mark Boundary
  t12: 't12_drop',      // Drop Supply
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
  // clear any global listeners from valve/dish/etc
  window.onmousemove = null;
  window.onmouseup = null;
  // re-enable game keys
  window.taskModalActive = false;
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

  const type = TASK_MINIGAME[currentTask.id] || 't4_mix'; 
  switch(type) {
    case 't1_relay':    startRelayGame();    break;
    case 't2_battery':  startBatteryGame();  break;
    case 't3_dish':     startDishGame();     break;
    case 't4_mix':      startMixGame();      break;
    case 't5_power':    startPowerGame();    break;
    case 't6_upload':   startUploadGame();   break;
    case 't7_reactor':  startReactorGame();  break;
    case 't8_crack':    startCrackGame();    break;
    case 't9_samples':  startSamplesGame();  break;
    case 't10_survey':  startSurveyGame();   break;
    case 't11_boundary': startBoundaryGame(); break;
    case 't12_drop':    startDropGame();     break;
    default: startMixGame(); break;
  }
}

// -------- t1: RELAY CONNECT minigame --------
function startRelayGame() {
  document.getElementById('minigame-instructions').textContent =
    'Connect the matching colored relay nodes to stabilize the circuit.';

  const C = ['#3498db','#2ecc71','#f39c12','#e74c3c'];
  const rights = shuffle([...C]);

  const canvas = document.createElement('canvas');
  canvas.width = 340; canvas.height = 220;
  canvas.id = 'minigame-canvas';
  mgWrap.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const leftPegs  = C.map((c,i)   => ({ x: 40,  y: 35 + i*50, c }));
  const rightPegs = rights.map((c,i) => ({ x: 300, y: 35 + i*50, c }));
  let connections = {}; 
  let dragging = null;

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // Draw Nodes
    [...leftPegs, ...rightPegs].forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 14, 0, Math.PI*2);
      ctx.fillStyle = '#1a1a2e'; ctx.fill();
      ctx.strokeStyle = p.c; ctx.lineWidth = 3; ctx.stroke();
      // Inner dot
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
      ctx.fillStyle = p.c; ctx.fill();
    });
    // Connections
    for (let li in connections) {
      const ri = connections[li];
      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.moveTo(leftPegs[li].x, leftPegs[li].y);
      ctx.lineTo(rightPegs[ri].x, rightPegs[ri].y);
      ctx.strokeStyle = leftPegs[li].c;
      ctx.lineWidth = 5; ctx.stroke();
    }
    if (dragging !== null) {
      const lp = leftPegs[dragging.idx];
      ctx.beginPath(); ctx.moveTo(lp.x, lp.y);
      ctx.lineTo(dragging.x, dragging.y);
      ctx.strokeStyle = lp.c; ctx.lineWidth = 4;
      ctx.setLineDash([8,4]); ctx.stroke();
    }
  }
  draw();

  let active = true;
  canvas.onmousedown = e => {
    if (!active) return;
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    leftPegs.forEach((p,i) => {
      if (Math.hypot(mx-p.x, my-p.y) < 20) {
        delete connections[i];
        dragging = { idx: i, x: mx, y: my };
      }
    });
  };
  canvas.onmousemove = e => {
    if (!dragging || !active) return;
    const r = canvas.getBoundingClientRect();
    dragging.x = e.clientX - r.left; dragging.y = e.clientY - r.top;
    draw();
  };
  canvas.onmouseup = e => {
    if (!dragging || !active) return;
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    rightPegs.forEach((p,ri) => {
      if (Math.hypot(mx-p.x, my-p.y) < 20) connections[dragging.idx] = ri;
    });
    dragging = null; draw();
    if (Object.keys(connections).length === C.length) {
      if (C.every((c,i) => c === rightPegs[connections[i]].c)) {
        active = false;
        onMinigameComplete();
      } else {
        mgFeedback.textContent = 'Circuit mismatch! Rewire correctly.';
      }
    }
  };
}

// -------- t2: BATTERY PULSE minigame --------
function startBatteryGame() {
  document.getElementById('minigame-instructions').textContent =
    'Click the pulse button to keep the charge needle in the GREEN zone.';

  const wrap = document.createElement('div');
  wrap.className = 'battery-game';
  
  const meter = document.createElement('div');
  meter.className = 'battery-meter';
  const needle = document.createElement('div');
  needle.className = 'battery-needle';
  const zone = document.createElement('div');
  zone.className = 'battery-safe-zone';
  
  meter.appendChild(zone);
  meter.appendChild(needle);
  wrap.appendChild(meter);

  const btn = document.createElement('button');
  btn.className = 'mg-btn pulse-btn';
  btn.textContent = 'PULSE';
  wrap.appendChild(btn);
  mgWrap.appendChild(wrap);

  let charge = 0; // 0 to 100
  let targetTime = 3000; // hold for 3s
  let heldTime = 0;
  let lastTime = Date.now();
  let active = true;

  btn.onclick = () => { if(active) charge = Math.min(100, charge + 15); };

  function loop() {
    if (!active) return;
    const now = Date.now();
    const dt = now - lastTime;
    lastTime = now;

    charge = Math.max(0, charge - 0.2 * (dt/10)); 
    needle.style.left = charge + '%';

    if (charge >= 60 && charge <= 85) {
      heldTime += dt;
      zone.style.background = 'rgba(46, 204, 113, 0.6)';
    } else {
      heldTime = Math.max(0, heldTime - dt);
      zone.style.background = 'rgba(231, 76, 60, 0.3)';
    }

    progressFill.style.width = (heldTime / targetTime * 100) + '%';

    if (heldTime >= targetTime) {
      active = false;
      onMinigameComplete();
    } else {
      requestAnimationFrame(loop);
    }
  }
  loop();
}

// -------- t3: SIGNAL MATCH minigame --------
function startDishGame() {
  document.getElementById('minigame-instructions').textContent =
    'Adjust the sliders to match the wavelength of the target signal.';

  const canvas = document.createElement('canvas');
  canvas.width = 340; canvas.height = 160;
  canvas.className = 'signal-canvas';
  mgWrap.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const controls = document.createElement('div');
  controls.className = 'signal-controls';
  
  let freq = 0.5, amp = 0.5;
  const targetFreq = 0.2 + Math.random() * 0.6;
  const targetAmp = 0.3 + Math.random() * 0.6;

  [ {n:'Freq', v:f=>freq=f}, {n:'Amp', v:a=>amp=a} ].forEach(cfg => {
    const row = document.createElement('div');
    row.innerHTML = `<label style="font-size:12px;color:#f39c12">${cfg.n}</label>`;
    const s = document.createElement('input');
    s.type='range'; s.min=0; s.max=1; s.step=0.01; s.value=0.5;
    s.oninput = e => cfg.v(parseFloat(e.target.value));
    row.appendChild(s);
    controls.appendChild(row);
  });
  mgWrap.appendChild(controls);

  let active = true;
  function draw() {
    if (mgWrap.innerHTML === '' || !active) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // Draw Target
    ctx.beginPath(); ctx.strokeStyle = 'rgba(243, 156, 18, 0.3)'; ctx.lineWidth = 3;
    for(let x=0; x<canvas.width; x++) {
      const y = 80 + Math.sin(x * targetFreq * 0.2) * (targetAmp * 60);
      x === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.stroke();
    // Draw Player
    ctx.beginPath(); ctx.strokeStyle = '#3498db'; ctx.lineWidth = 3;
    for(let x=0; x<canvas.width; x++) {
      const y = 80 + Math.sin(x * freq * 0.2) * (amp * 60);
      x === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.stroke();

    const diff = Math.abs(freq - targetFreq) + Math.abs(amp - targetAmp);
    if (diff < 0.08) {
      active = false;
      ctx.strokeStyle = '#2ecc71'; ctx.lineWidth = 5; ctx.stroke();
      setTimeout(onMinigameComplete, 600);
      return;
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// -------- t4: CHEMISTRY MIX minigame --------
function startMixGame() {
  document.getElementById('minigame-instructions').textContent =
    'Follow the recipe! Click the flasks in the correct color order.';

  const COLORS = [
    { name: 'Red', val: '#e74c3c' },
    { name: 'Blue', val: '#3498db' },
    { name: 'Green', val: '#2ecc71' },
    { name: 'Yellow', val: '#f1c40f' }
  ];
  const recipe = shuffle([...COLORS]).slice(0, 3);
  let step = 0;

  const paper = document.createElement('div');
  paper.className = 'recipe-paper';
  paper.innerHTML = '<strong>RECIPE:</strong><br>' + recipe.map(c => `<span style="color:${c.val}">${c.name}</span>`).join(' → ');
  mgWrap.appendChild(paper);

  let active = true;
  const rack = document.createElement('div');
  rack.className = 'flask-rack';
  COLORS.forEach(c => {
    const f = document.createElement('div');
    f.className = 'flask';
    f.style.background = c.val;
    f.onclick = () => {
      if (!active) return;
      if (c.name === recipe[step].name) {
        f.style.filter = 'brightness(1.5) drop-shadow(0 0 10px white)';
        f.style.pointerEvents = 'none';
        step++;
        if (step === recipe.length) {
          active = false;
          onMinigameComplete();
        }
      } else {
        active = false;
        mgFeedback.textContent = 'Contaminated! Restarting recipe...';
        setTimeout(startMixGame, 800);
      }
    };
    rack.appendChild(f);
  });
  mgWrap.appendChild(rack);
}

// -------- t5: FUSE FLIP minigame --------
function startPowerGame() {
  document.getElementById('minigame-instructions').textContent =
    'Flip the fuses until all four are in the UP (green) position.';

  const grid = document.createElement('div');
  grid.className = 'fuse-grid';
  
  let state = [false, false, false, false];
  const items = [];

  let active = true;
  for(let i=0; i<4; i++) {
    const fuse = document.createElement('div');
    fuse.className = 'fuse-item';
    fuse.innerHTML = '<div class="fuse-knob"></div>';
    fuse.onclick = () => {
      if (!active) return;
      state[i] = !state[i];
      fuse.classList.toggle('on', state[i]);
      if (state.every(s => s)) {
        active = false;
        setTimeout(onMinigameComplete, 400);
      }
    };
    grid.appendChild(fuse);
    items.push(fuse);
  }
  mgWrap.appendChild(grid);
}

// -------- t6: PACKET GRAB minigame --------
function startUploadGame() {
  document.getElementById('minigame-instructions').textContent =
    'Intercept the moving data packets! Click 5 packets to complete the upload.';

  const area = document.createElement('div');
  area.className = 'packet-area';
  mgWrap.appendChild(area);

  let caught = 0;
  const total = 5;

  function spawn() {
    if (caught >= total || mgWrap.innerHTML === '') return;
    const p = document.createElement('div');
    p.className = 'data-packet';
    p.textContent = '💾';
    const x = Math.random() * 300;
    const y = Math.random() * 160;
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    
    p.onclick = () => {
      if (!active) return;
      caught++;
      progressFill.style.width = (caught / total * 100) + '%';
      p.remove();
      if (caught >= total) {
        active = false;
        onMinigameComplete();
      } else {
        spawn();
      }
    };
    area.appendChild(p);

    // Fade and move slightly
    setTimeout(() => {
      if (p.parentElement) {
        p.style.transform = `translate(${(Math.random()-0.5)*40}px, ${(Math.random()-0.5)*40}px)`;
        p.style.opacity = '0.4';
      }
    }, 1000);
    setTimeout(() => { if (p.parentElement) { p.remove(); spawn(); } }, 2000);
  }
  spawn();
}

// -------- t7: VALVE COOLING minigame --------
function startReactorGame() {
  document.getElementById('minigame-instructions').textContent =
    'Click and drag the valve wheel in a full circle to release pressure.';

  const container = document.createElement('div');
  container.className = 'valve-container';
  const wheel = document.createElement('div');
  wheel.className = 'valve-wheel';
  wheel.innerHTML = '<div class="valve-spoke"></div><div class="valve-spoke" style="transform:rotate(90deg)"></div><div class="valve-handle"></div>';
  container.appendChild(wheel);
  mgWrap.appendChild(container);

  let angle = 0;
  let lastAngle = null;
  let totalRotation = 0;
  let dragging = false;

  wheel.onmousedown = () => { if(active) dragging = true; };
  window.onmousemove = e => {
    if (!dragging || !active) return;
    const r = wheel.getBoundingClientRect();
    const cx = r.left + r.width/2;
    const cy = r.top + r.height/2;
    const curAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
    
    if (lastAngle !== null) {
      let delta = curAngle - lastAngle;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      totalRotation += delta;
      wheel.style.transform = `rotate(${totalRotation}deg)`;
    }
    lastAngle = curAngle;
    progressFill.style.width = Math.min(100, Math.abs(totalRotation)/360 * 100) + '%';
    if (Math.abs(totalRotation) >= 350) {
      active = false;
      dragging = false; 
      window.onmousemove = null;
      onMinigameComplete();
    }
  };
  window.onmouseup = () => { dragging = false; lastAngle = null; };
}

// -------- t8: CRACK WELD minigame --------
function startCrackGame() {
  document.getElementById('minigame-instructions').textContent =
    'Trace the jagged crack with your welder to seal it shut.';

  const canvas = document.createElement('canvas');
  canvas.width = 340; canvas.height = 200;
  canvas.style.background = '#1a1a2e';
  canvas.style.border = '2px solid #444';
  mgWrap.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const pts = [];
  for(let i=0; i<8; i++) pts.push({ x: 20 + i*45, y: 100 + (Math.random()-0.5)*80 });
  
  let progress = 0;
  let active = true;

  function draw() {
    ctx.clearRect(0,0,340,200);
    // Draw Crack
    ctx.beginPath(); ctx.strokeStyle = '#555'; ctx.lineWidth = 10; ctx.lineCap = 'round';
    pts.forEach((p,i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();
    // Draw Welded
    ctx.beginPath(); ctx.strokeStyle = '#f39c12'; ctx.lineWidth = 8;
    ctx.setLineDash([progress * 400, 400]); // cheap way to show progress along path
    pts.forEach((p,i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke(); ctx.setLineDash([]);
    // Spark
    if (progress > 0 && progress < 1) {
      const pIdx = Math.floor(progress * (pts.length-1));
      const p = pts[pIdx];
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2); ctx.fill();
    }
  }

  canvas.onmousemove = e => {
    if (!active) return;
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    const pIdx = Math.floor(progress * (pts.length-1));
    const target = pts[pIdx];
    if (Math.hypot(mx - target.x, my - target.y) < 30) {
      progress += 0.01;
      progressFill.style.width = (progress * 100) + '%';
      if (progress >= 1) { active = false; onMinigameComplete(); }
      draw();
    }
  };
  draw();
}

// -------- t9: SPECIMEN SORT minigame --------
function startSamplesGame() {
  document.getElementById('minigame-instructions').textContent =
    'Drag each specimen into its matching container (Organic vs Mineral).';

  const wrap = document.createElement('div');
  wrap.className = 'specimen-sort';
  
  const specs = [
    { n: '🌿', t: 'org' }, { n: '🪨', t: 'min' }, { n: '🍄', t: 'org' }, { n: '💎', t: 'min' }
  ];
  const items = shuffle([...specs]);

  const binOrg = document.createElement('div');
  binOrg.className = 'sort-bin'; binOrg.innerHTML = '<span>ORGANIC bin</span>';
  const binMin = document.createElement('div');
  binMin.className = 'sort-bin'; binMin.innerHTML = '<span>MINERAL bin</span>';
  
  const itemRow = document.createElement('div');
  itemRow.className = 'item-row';

  let doneCount = 0;

  items.forEach(it => {
    const el = document.createElement('div');
    el.className = 'specimen-item';
    el.textContent = it.n;
    el.draggable = true;
    el.dataset.type = it.t; 
    el.onmousedown = () => el.style.opacity = '0.5';
    el.onmouseup   = () => el.style.opacity = '1';
    el.ondragstart = (e) => { e.dataTransfer.setData('type', it.t); };
    itemRow.appendChild(el);
  });

  let active = true;
  [binOrg, binMin].forEach(bin => {
    const binType = bin === binOrg ? 'org' : 'min';
    bin.ondragover = e => e.preventDefault();
    bin.ondrop = e => {
      e.preventDefault();
      if (!active) return;
      const droppedType = e.dataTransfer.getData('type');
      if (droppedType === binType) {
        bin.style.borderColor = '#2ecc71';
        setTimeout(() => bin.style.borderColor = '', 300);
        // Find one matching item that isn't already hidden
        const list = itemRow.querySelectorAll('.specimen-item');
        for(let el of list) {
          if (el.style.display !== 'none' && el.dataset.type === binType) {
            el.style.display = 'none';
            break;
          }
        }
        doneCount++;
        progressFill.style.width = (doneCount / items.length * 100) + '%';
        if (doneCount >= items.length) {
          active = false;
          onMinigameComplete();
        }
      } else {
        bin.style.borderColor = '#e74c3c';
        setTimeout(() => bin.style.borderColor = '', 300);
      }
    };
  });

  mgWrap.appendChild(itemRow);
  mgWrap.appendChild(binOrg);
  mgWrap.appendChild(binMin);
}

// -------- t10: SURVEY RADAR minigame --------
function startSurveyGame() {
  document.getElementById('minigame-instructions').textContent =
    'Calibrate the survey by clicking the 3 red signal spikes on the radar.';

  const canvas = document.createElement('canvas');
  canvas.width = 340; canvas.height = 200;
  canvas.style.background = '#0d1117';
  canvas.style.border = '2px solid #2ecc71';
  mgWrap.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const spikes = [];
  for(let i=0; i<3; i++) spikes.push({ x: 40 + Math.random()*260, y: 30 + Math.random()*130, hit: false });

  function draw() {
    if (mgWrap.innerHTML === '') return;
    ctx.clearRect(0,0,340,200);
    // Grid
    ctx.strokeStyle = 'rgba(46, 204, 113, 0.2)'; ctx.lineWidth = 1;
    for(let i=0; i<9; i++) {
       ctx.beginPath(); ctx.moveTo(i*40, 0); ctx.lineTo(i*40, 200); ctx.stroke();
       ctx.beginPath(); ctx.moveTo(0, i*40); ctx.lineTo(340, i*40); ctx.stroke();
    }
    // Spikes
    spikes.forEach(s => {
      ctx.beginPath();
      ctx.moveTo(s.x, s.y); ctx.lineTo(s.x-10, s.y+20); ctx.lineTo(s.x+10, s.y+20);
      ctx.fillStyle = s.hit ? '#2ecc71' : '#e74c3c';
      ctx.fill();
    });
    if (!spikes.every(s => s.hit)) requestAnimationFrame(draw);
  }

  let active = true;
  canvas.onclick = e => {
    if (!active) return;
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    spikes.forEach(s => {
      if (Math.hypot(mx - s.x, my - (s.y+10)) < 25) s.hit = true;
    });
    if (spikes.every(s => s.hit)) {
      active = false;
      setTimeout(onMinigameComplete, 400);
    }
  };
  draw();
}

// -------- t11: STAKE HAMMER minigame --------
function startBoundaryGame() {
  document.getElementById('minigame-instructions').textContent =
    'Time your strikes! Click when the hammer bar passes over the green marker.';

  const lane = document.createElement('div');
  lane.className = 'stake-lane'; mgWrap.appendChild(lane);
  const marker = document.createElement('div');
  marker.className = 'stake-marker'; lane.appendChild(marker);
  const hammer = document.createElement('div');
  hammer.className = 'stake-hammer'; lane.appendChild(hammer);

  let pos = 0, dir = 1, active = true, hits = 0;
  const targetHits = 3;

  function loop() {
    if (!active || mgWrap.innerHTML === '') return;
    pos += 4.5 * dir;
    if (pos > 320 || pos < 0) dir *= -1;
    hammer.style.left = pos + 'px';
    requestAnimationFrame(loop);
  }

  lane.onclick = () => {
    if (pos > 135 && pos < 185) { 
      hits++;
      marker.style.background = 'rgba(46, 204, 113, 0.6)';
      setTimeout(() => marker.style.background = '', 200);
      progressFill.style.width = (hits / targetHits * 100) + '%';
      if (hits >= targetHits) { active = false; onMinigameComplete(); }
    } else {
       mgFeedback.textContent = 'Missed! Keep going.';
    }
  };
  loop();
}

// -------- t12: CARGO DROP minigame --------
function startDropGame() {
  document.getElementById('minigame-instructions').textContent =
    'Precision Drop! Click the zone to release the supply crate onto the RED target.';

  const zone = document.createElement('div');
  zone.className = 'drop-zone'; mgWrap.appendChild(zone);
  const target = document.createElement('div');
  target.className = 'drop-target'; zone.appendChild(target);
  const cross = document.createElement('div');
  cross.className = 'drop-crosshair'; zone.appendChild(cross);

  let pos = 0, dir = 1, active = true;

  function loop() {
    if (!active || mgWrap.innerHTML === '') return;
    pos += 5.5 * dir;
    if (pos > 290 || pos < 0) dir *= -1;
    target.style.left = pos + 'px';
    requestAnimationFrame(loop);
  }

  zone.onclick = () => {
    // Crosshair is fixed at 160px (left edge of 20px span centers at 170)
    const diff = Math.abs(pos - 145); // target is 50px, cross centers at 170
    if (diff < 30) {
      active = false;
      target.style.background = '#2ecc71';
      onMinigameComplete();
    } else {
      mgFeedback.textContent = 'Adjusting trajectory...';
    }
  };
  loop();
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
    if (!me || me.role !== 'crewmate') return;
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
