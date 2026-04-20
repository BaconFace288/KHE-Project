// =====================================================
//  MINIGAME SYSTEM — The Primitive Peer
//  Loaded after game.js. Uses globals: TASKS, players,
//  myId, socket, completedTasks defined in game.js
// =====================================================

// ---------- Task → Minigame mapping ----------
const TASK_MINIGAME = {
  t1:  'wire',      // Fix Relay        → Wire Connect
  t2:  'power',     // Charge Battery   → Power Slider
  t3:  'dial',      // Align Dish       → Dial Tune
  t4:  'color',     // Mix Solution     → Color Mixer
  t5:  'switches',  // Restore Power    → Flip Switches
  t6:  'memory',    // Upload Data      → Memory Match
  t7:  'pipe',      // Cool Reactor     → Pipe Connector
  t8:  'rhythm',    // Seal Crack       → Tap Rhythm
  t9:  'sort',      // Collect Samples  → Bin Sort
  t10: 'grid',      // Survey Zone      → Grid Scan
  t11: 'pattern',   // Mark Boundary    → Pattern Trace
  t12: 'scale',     // Drop Supply      → Weight Scale
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

  const type = TASK_MINIGAME[currentTask.id] || 'wire';
  switch(type) {
    case 'wire':     startWireGame();     break;
    case 'power':    startPowerGame();    break;
    case 'dial':     startDialGame();     break;
    case 'color':    startColorGame();    break;
    case 'switches': startSwitchGame();   break;
    case 'memory':   startMemoryGame();   break;
    case 'pipe':     startPipeGame();     break;
    case 'rhythm':   startRhythmGame();   break;
    case 'sort':     startSortGame();     break;
    case 'grid':     startGridGame();     break;
    case 'pattern':  startPatternGame();  break;
    case 'scale':    startScaleGame();    break;
  }
}

// ============================================================
// t1 — FIX RELAY: Wire Connect
// Drag each left peg to its matching colour on the right.
// ============================================================
function startWireGame() {
  document.getElementById('minigame-instructions').textContent =
    'Connect each wire on the left to its matching colour on the right.';

  const C = ['#e74c3c','#3498db','#2ecc71','#f39c12'];
  const rights = shuffle([...C]);

  const canvas = document.createElement('canvas');
  canvas.width = 340; canvas.height = 200;
  canvas.id = 'minigame-canvas';
  mgWrap.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const leftPegs  = C.map((c,i)  => ({ x: 40,  y: 40+i*40, c }));
  const rightPegs = rights.map((c,i) => ({ x: 300, y: 40+i*40, c }));
  let connections = {};
  let dragging = null;

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    [...leftPegs,...rightPegs].forEach(p => {
      ctx.beginPath(); ctx.arc(p.x,p.y,12,0,Math.PI*2);
      ctx.fillStyle=p.c; ctx.fill();
      ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.stroke();
    });
    for (let li in connections) {
      const ri=connections[li];
      ctx.beginPath(); ctx.moveTo(leftPegs[li].x,leftPegs[li].y);
      ctx.lineTo(rightPegs[ri].x,rightPegs[ri].y);
      ctx.strokeStyle=leftPegs[li].c; ctx.lineWidth=4; ctx.stroke();
    }
    if (dragging!==null) {
      const lp=leftPegs[dragging.idx];
      ctx.beginPath(); ctx.moveTo(lp.x,lp.y);
      ctx.lineTo(dragging.x,dragging.y);
      ctx.strokeStyle=lp.c; ctx.lineWidth=3;
      ctx.setLineDash([6,4]); ctx.stroke(); ctx.setLineDash([]);
    }
  }
  draw();

  canvas.addEventListener('mousedown',e=>{
    const r=canvas.getBoundingClientRect();
    const mx=e.clientX-r.left,my=e.clientY-r.top;
    leftPegs.forEach((p,i)=>{
      if(Math.hypot(mx-p.x,my-p.y)<16){ delete connections[i]; dragging={idx:i,x:mx,y:my}; }
    });
  });
  canvas.addEventListener('mousemove',e=>{
    if(dragging===null)return;
    const r=canvas.getBoundingClientRect();
    dragging.x=e.clientX-r.left; dragging.y=e.clientY-r.top; draw();
  });
  canvas.addEventListener('mouseup',e=>{
    if(dragging===null)return;
    const r=canvas.getBoundingClientRect();
    const mx=e.clientX-r.left,my=e.clientY-r.top;
    rightPegs.forEach((p,ri)=>{
      if(Math.hypot(mx-p.x,my-p.y)<16) connections[dragging.idx]=ri;
    });
    dragging=null; draw();
    if(Object.keys(connections).length===C.length){
      let ok=true;
      for(let li in connections) if(leftPegs[li].c!==rightPegs[connections[li]].c){ok=false;break;}
      if(ok) onMinigameComplete();
      else mgFeedback.textContent='Some wires don\'t match — try again!';
    }
  });
}

// ============================================================
// t2 — CHARGE BATTERY: Power Slider
// A bar bounces back-and-forth; click STOP when it hits the
// green target zone.
// ============================================================
function startPowerGame() {
  document.getElementById('minigame-instructions').textContent =
    'Press STOP when the moving bar lands inside the green zone!';

  const TRACK_W = 380;
  const zoneStart = 0.3 + Math.random() * 0.3;
  const zoneWidth = 0.14;
  let pos = 0, dir = 1, speed = 0.012, stopped = false;

  const wrap = document.createElement('div');
  wrap.style.cssText = 'width:100%;text-align:center;';

  const track = document.createElement('div');
  track.className = 'mg-dial-track';
  track.style.width = TRACK_W + 'px';
  track.style.display = 'inline-block';

  const zone = document.createElement('div');
  zone.className = 'mg-dial-zone';
  zone.style.left = (zoneStart*100)+'%';
  zone.style.width = (zoneWidth*100)+'%';
  track.appendChild(zone);

  const bar = document.createElement('div');
  bar.style.cssText = `position:absolute;top:4px;height:32px;width:14px;background:#e74c3c;
    border-radius:4px;left:0%;transform:translateX(-50%);transition:background .2s;`;
  track.appendChild(bar);

  wrap.appendChild(track);

  const stopBtn = document.createElement('button');
  stopBtn.className = 'modal-submit-btn';
  stopBtn.style.marginTop = '16px';
  stopBtn.textContent = '⏹ STOP';
  wrap.appendChild(document.createElement('br'));
  wrap.appendChild(stopBtn);
  mgWrap.appendChild(wrap);

  let raf;
  function animate() {
    if(stopped) return;
    pos += dir * speed;
    if(pos >= 1){ pos=1; dir=-1; } else if(pos <= 0){ pos=0; dir=1; }
    bar.style.left = (pos*100)+'%';
    raf = requestAnimationFrame(animate);
  }
  animate();

  stopBtn.addEventListener('click', () => {
    if(stopped) return;
    stopped = true;
    cancelAnimationFrame(raf);
    if(pos >= zoneStart && pos <= zoneStart+zoneWidth){
      bar.style.background = '#2ecc71';
      setTimeout(onMinigameComplete, 500);
    } else {
      bar.style.background = '#e74c3c';
      mgFeedback.textContent = 'Missed! Try again.';
      setTimeout(() => { stopped=false; bar.style.background='#e74c3c'; animate(); }, 800);
    }
  });
}

// ============================================================
// t3 — ALIGN DISH: Dial Tune
// Drag the handle into the precise green target zone.
// ============================================================
function startDialGame() {
  document.getElementById('minigame-instructions').textContent =
    'Drag the handle into the green target zone and release.';

  const TRACK_W = 380;
  const zoneStart = 0.3 + Math.random() * 0.35;
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
}

// ============================================================
// t4 — MIX SOLUTION: Color Mixer
// Adjust 3 RGB sliders until your color matches the target.
// ============================================================
function startColorGame() {
  document.getElementById('minigame-instructions').textContent =
    'Adjust the sliders until your color matches the target swatch!';

  const tr = Math.floor(Math.random()*200)+30;
  const tg = Math.floor(Math.random()*200)+30;
  const tb = Math.floor(Math.random()*200)+30;

  const wrap = document.createElement('div');
  wrap.style.cssText='display:flex;flex-direction:column;align-items:center;gap:12px;width:100%;';

  const swatches = document.createElement('div');
  swatches.style.cssText='display:flex;gap:20px;align-items:center;margin-bottom:4px;';

  const targetSwatch = document.createElement('div');
  targetSwatch.style.cssText=`width:70px;height:70px;border-radius:10px;border:2px solid #fff;
    background:rgb(${tr},${tg},${tb});`;
  const targetLabel = document.createElement('div');
  targetLabel.style.cssText='color:#95a5a6;font-size:11px;text-align:center;';
  targetLabel.textContent='TARGET';

  const arrow = document.createElement('div');
  arrow.style.cssText='font-size:24px;color:#f39c12;';
  arrow.textContent='→';

  const yourSwatch = document.createElement('div');
  yourSwatch.style.cssText='width:70px;height:70px;border-radius:10px;border:2px solid #fff;background:rgb(0,0,0);';
  const yourLabel = document.createElement('div');
  yourLabel.style.cssText='color:#95a5a6;font-size:11px;text-align:center;';
  yourLabel.textContent='YOURS';

  const leftCol = document.createElement('div');
  leftCol.style.cssText='display:flex;flex-direction:column;align-items:center;gap:4px;';
  leftCol.appendChild(targetSwatch); leftCol.appendChild(targetLabel);
  const rightCol = document.createElement('div');
  rightCol.style.cssText='display:flex;flex-direction:column;align-items:center;gap:4px;';
  rightCol.appendChild(yourSwatch); rightCol.appendChild(yourLabel);

  swatches.appendChild(leftCol); swatches.appendChild(arrow); swatches.appendChild(rightCol);
  wrap.appendChild(swatches);

  let vals = { r:0, g:0, b:0 };
  const channels = [
    {key:'r', label:'R', color:'#e74c3c'},
    {key:'g', label:'G', color:'#2ecc71'},
    {key:'b', label:'B', color:'#3498db'},
  ];
  channels.forEach(ch => {
    const row = document.createElement('div');
    row.style.cssText='display:flex;align-items:center;gap:10px;width:340px;';
    const lbl = document.createElement('span');
    lbl.textContent=ch.label;
    lbl.style.cssText=`color:${ch.color};font-weight:bold;width:16px;`;
    const slider = document.createElement('input');
    slider.type='range'; slider.min=0; slider.max=255; slider.value=0;
    slider.style.cssText=`flex:1;accent-color:${ch.color};`;
    const num = document.createElement('span');
    num.textContent='0';
    num.style.cssText='color:#ecf0f1;font-size:12px;width:30px;text-align:right;';
    slider.addEventListener('input', () => {
      vals[ch.key] = parseInt(slider.value);
      num.textContent = slider.value;
      yourSwatch.style.background=`rgb(${vals.r},${vals.g},${vals.b})`;
      const dr=Math.abs(vals.r-tr),dg=Math.abs(vals.g-tg),db=Math.abs(vals.b-tb);
      if(dr+dg+db <= 30) { setTimeout(onMinigameComplete, 300); }
    });
    row.appendChild(lbl); row.appendChild(slider); row.appendChild(num);
    wrap.appendChild(row);
  });
  mgWrap.appendChild(wrap);
}

// ============================================================
// t5 — RESTORE POWER: Flip Switches
// 5 switches are randomly set. Match them to a displayed
// ON/OFF pattern to restore power.
// ============================================================
function startSwitchGame() {
  document.getElementById('minigame-instructions').textContent =
    'Flip the switches to match the TARGET pattern shown above.';

  const COUNT = 5;
  const target = Array.from({length:COUNT}, () => Math.random() > 0.5);
  const current = Array.from({length:COUNT}, () => false);

  const wrap = document.createElement('div');
  wrap.style.cssText='display:flex;flex-direction:column;align-items:center;gap:18px;';

  // Target row
  const targetLabel = document.createElement('div');
  targetLabel.style.cssText='color:#f39c12;font-size:13px;font-weight:bold;letter-spacing:1px;';
  targetLabel.textContent='TARGET';
  const targetRow = document.createElement('div');
  targetRow.style.cssText='display:flex;gap:12px;';
  target.forEach(on => {
    const sw = document.createElement('div');
    sw.style.cssText=`width:38px;height:68px;border-radius:20px;border:2px solid ${on?'#2ecc71':'#7f8c8d'};
      background:${on?'rgba(46,204,113,0.2)':'rgba(127,140,141,0.1)'};display:flex;flex-direction:column;
      align-items:center;justify-content:${on?'flex-start':'flex-end'};padding:4px;`;
    const pip = document.createElement('div');
    pip.style.cssText=`width:26px;height:26px;border-radius:50%;background:${on?'#2ecc71':'#95a5a6'};`;
    sw.appendChild(pip);
    targetRow.appendChild(sw);
  });

  // Player row
  const playerLabel = document.createElement('div');
  playerLabel.style.cssText='color:#3498db;font-size:13px;font-weight:bold;letter-spacing:1px;';
  playerLabel.textContent='YOUR SWITCHES';
  const playerRow = document.createElement('div');
  playerRow.style.cssText='display:flex;gap:12px;';
  const switches = [];
  current.forEach((on, i) => {
    const sw = document.createElement('div');
    sw.style.cssText=`width:38px;height:68px;border-radius:20px;border:2px solid #7f8c8d;
      background:rgba(127,140,141,0.1);display:flex;flex-direction:column;
      align-items:center;justify-content:flex-end;padding:4px;cursor:pointer;transition:all .2s;`;
    const pip = document.createElement('div');
    pip.style.cssText=`width:26px;height:26px;border-radius:50%;background:#95a5a6;transition:all .2s;`;
    sw.appendChild(pip);
    switches.push({ el:sw, pip, state:false });

    sw.addEventListener('click', () => {
      const s = switches[i];
      s.state = !s.state;
      current[i] = s.state;
      if(s.state){
        s.el.style.borderColor='#2ecc71'; s.el.style.background='rgba(46,204,113,0.2)';
        s.el.style.justifyContent='flex-start'; s.pip.style.background='#2ecc71';
      } else {
        s.el.style.borderColor='#7f8c8d'; s.el.style.background='rgba(127,140,141,0.1)';
        s.el.style.justifyContent='flex-end'; s.pip.style.background='#95a5a6';
      }
      const allMatch = current.every((v,j) => v===target[j]);
      if(allMatch) setTimeout(onMinigameComplete, 400);
    });
    playerRow.appendChild(sw);
  });

  wrap.appendChild(targetLabel); wrap.appendChild(targetRow);
  wrap.appendChild(playerLabel); wrap.appendChild(playerRow);
  mgWrap.appendChild(wrap);
}

// ============================================================
// t6 — UPLOAD DATA: Memory Match
// Flip pairs of "data packet" cards to find all 4 matches.
// ============================================================
function startMemoryGame() {
  document.getElementById('minigame-instructions').textContent =
    'Flip cards to find all matching data packet pairs!';

  const symbols = ['⚡','🔑','📡','🛰️'];
  const deck = shuffle([...symbols,...symbols]);
  let flipped = [], locked = false, matched = 0;

  const grid = document.createElement('div');
  grid.style.cssText='display:grid;grid-template-columns:repeat(4,68px);gap:10px;justify-content:center;';

  deck.forEach((sym, i) => {
    const card = document.createElement('div');
    card.style.cssText=`width:68px;height:68px;border-radius:10px;border:2px solid #2c2c4a;
      background:#0f0f23;display:flex;align-items:center;justify-content:center;
      font-size:28px;cursor:pointer;transition:background .2s;user-select:none;`;
    card.dataset.val = sym;
    card.dataset.revealed = 'false';
    card.textContent='';

    card.addEventListener('click', () => {
      if(locked || card.dataset.revealed==='true' || flipped.length===2) return;
      card.textContent = sym;
      card.style.background = '#16213e';
      card.style.borderColor = '#f39c12';
      card.dataset.revealed = 'true';
      flipped.push(card);

      if(flipped.length===2){
        locked=true;
        if(flipped[0].dataset.val === flipped[1].dataset.val){
          flipped[0].style.borderColor='#2ecc71'; flipped[1].style.borderColor='#2ecc71';
          flipped[0].style.background='rgba(46,204,113,0.15)'; flipped[1].style.background='rgba(46,204,113,0.15)';
          matched++;
          flipped=[];
          locked=false;
          if(matched===symbols.length) setTimeout(onMinigameComplete,400);
        } else {
          setTimeout(() => {
            flipped.forEach(c => {
              c.textContent=''; c.style.background='#0f0f23';
              c.style.borderColor='#2c2c4a'; c.dataset.revealed='false';
            });
            flipped=[]; locked=false;
          }, 900);
        }
      }
    });
    grid.appendChild(card);
  });
  mgWrap.appendChild(grid);
}

// ============================================================
// t7 — COOL REACTOR: Pipe Connector
// Rotate pipe tiles on a 3×3 grid to connect source (left) to
// drain (right) through a continuous path.
// ============================================================
function startPipeGame() {
  document.getElementById('minigame-instructions').textContent =
    'Click pipes to rotate them. Connect the LEFT source ▶ to the RIGHT drain ◀!';

  // Pipe types: each entry is [left, right, up, down] openings
  // Pre-solved layout: source(0,1) → (1,1) → (2,1) → drain(2,1)
  // We define a fixed solveable puzzle
  const PIPE_TYPES = {
    'lr':  [1,1,0,0], // ─
    'ud':  [0,0,1,1], // │
    'rd':  [0,1,0,1], // ┌
    'ld':  [1,0,0,1], // ┐
    'ru':  [0,1,1,0], // └
    'lu':  [1,0,1,0], // ┘
    'lrd': [1,1,0,1], // ┬ (T down)
    'src': [0,1,0,0], // source (only opens right)
    'drn': [1,0,0,0], // drain (only opens left)
  };
  const PIPE_CHARS = { lr:'─', ud:'│', rd:'┌', ld:'┐', ru:'└', lu:'┘', lrd:'┬', src:'▶', drn:'◀' };

  // Fixed solveable 3x3 grid (row, col): solved path is row 1 all the way across
  const initGrid = [
    ['ud','lu','ud'],
    ['src','lr','drn'],
    ['rd','lu','ld'],
  ];
  // Each cell has a type and current rotation (0-3). We shuffle the non-source/drain pipes
  const ROTATABLE = ['lr','ud','rd','ld','ru','lu','lrd'];
  const grid = initGrid.map(row => row.map(t => ({
    type:t,
    // randomize rotation for non-src/drn
    rot: (t==='src'||t==='drn') ? 0 : Math.floor(Math.random()*4)
  })));

  function getOpenings(cell) {
    const base = PIPE_TYPES[cell.type];
    if(!base) return [0,0,0,0];
    let [l,r,u,d] = base;
    for(let i=0;i<cell.rot%4;i++) { [l,r,u,d] = [d,u,l,r]; }
    return [l,r,u,d];
  }

  function isConnected() {
    // BFS from (1,0) source opening right
    const visited = Array.from({length:3},()=>Array(3).fill(false));
    const queue = [[1,0]];
    visited[1][0]=true;
    while(queue.length){
      const [row,col]=queue.shift();
      if(row===1 && col===2) return true;
      const [l,r,u,d]=getOpenings(grid[row][col]);
      // Right
      if(r&&col+1<3&&!visited[row][col+1]&&getOpenings(grid[row][col+1])[0]){
        visited[row][col+1]=true; queue.push([row,col+1]);
      }
      // Left
      if(l&&col-1>=0&&!visited[row][col-1]&&getOpenings(grid[row][col-1])[1]){
        visited[row][col-1]=true; queue.push([row,col-1]);
      }
      // Down
      if(d&&row+1<3&&!visited[row+1][col]&&getOpenings(grid[row+1][col])[2]){
        visited[row+1][col]=true; queue.push([row+1,col]);
      }
      // Up
      if(u&&row-1>=0&&!visited[row-1][col]&&getOpenings(grid[row-1][col])[3]){
        visited[row-1][col]=true; queue.push([row-1,col]);
      }
    }
    return false;
  }

  const wrapper = document.createElement('div');
  wrapper.style.cssText='display:grid;grid-template-columns:repeat(3,70px);gap:6px;justify-content:center;';
  const cellEls = [];

  for(let r=0;r<3;r++){
    cellEls.push([]);
    for(let c=0;c<3;c++){
      const cell=document.createElement('div');
      cell.style.cssText=`width:70px;height:70px;border-radius:8px;border:2px solid #2c2c4a;
        background:#0f0f23;display:flex;align-items:center;justify-content:center;
        font-size:28px;cursor:${(grid[r][c].type==='src'||grid[r][c].type==='drn')?'default':'pointer'};
        color:#f39c12;font-family:monospace;transition:background .15s;`;
      cell.textContent = PIPE_CHARS[grid[r][c].type] || '?';
      cell.style.transform=`rotate(${grid[r][c].rot*90}deg)`;
      if(grid[r][c].type!=='src'&&grid[r][c].type!=='drn'){
        cell.addEventListener('click',()=>{
          grid[r][c].rot=(grid[r][c].rot+1)%4;
          cell.style.transform=`rotate(${grid[r][c].rot*90}deg)`;
          if(isConnected()){
            cellEls.flat().forEach(el=>{ el.style.borderColor='#2ecc71'; el.style.background='rgba(46,204,113,0.1)'; });
            setTimeout(onMinigameComplete,600);
          }
        });
      } else {
        cell.style.color=(grid[r][c].type==='src')?'#3498db':'#e74c3c';
      }
      cellEls[r].push(cell);
      wrapper.appendChild(cell);
    }
  }
  mgWrap.appendChild(wrapper);
}

// ============================================================
// t8 — SEAL CRACK: Tap Rhythm
// A cursor pulses green every ~800ms. Press the button WHILE
// it is green 3 times in a row to seal the crack.
// ============================================================
function startRhythmGame() {
  document.getElementById('minigame-instructions').textContent =
    'Press TAP while the circle is GREEN — 3 times in a row!';

  let hits=0, windowOpen=false, intervalId=null;
  const BEAT=900, WINDOW=280;

  const canvas=document.createElement('canvas');
  canvas.width=200; canvas.height=200; canvas.id='minigame-canvas';
  mgWrap.appendChild(canvas);
  const ctx=canvas.getContext('2d');

  const tapBtn=document.createElement('button');
  tapBtn.className='modal-submit-btn';
  tapBtn.style.cssText='display:block;margin:12px auto 0;font-size:18px;padding:12px 32px;';
  tapBtn.textContent='TAP';
  mgWrap.appendChild(tapBtn);

  const hitEl=document.createElement('div');
  hitEl.style.cssText='text-align:center;color:#f39c12;font-weight:bold;margin-top:8px;font-size:16px;';
  hitEl.textContent='Hits: 0 / 3';
  mgWrap.appendChild(hitEl);

  let isGreen=false;
  function pulse(){
    isGreen=true; windowOpen=true;
    setTimeout(()=>{ isGreen=false; windowOpen=false; }, WINDOW);
  }
  function draw(){
    ctx.clearRect(0,0,200,200);
    ctx.beginPath(); ctx.arc(100,100,70,0,Math.PI*2);
    ctx.fillStyle=isGreen?'#2ecc71':'#2c2c4a';
    ctx.fill();
    ctx.strokeStyle=isGreen?'#27ae60':'#444'; ctx.lineWidth=5; ctx.stroke();
    const s=hits===0?'●●●':hits===1?'🟢●●':'🟢🟢●';
    ctx.fillStyle='#fff'; ctx.font='bold 26px sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(s,100,100);
    requestAnimationFrame(draw);
  }
  draw();
  intervalId=setInterval(pulse, BEAT);

  tapBtn.addEventListener('click',()=>{
    if(windowOpen){
      hits++;
      hitEl.textContent=`Hits: ${hits} / 3`;
      mgFeedback.textContent='✓ Hit!'; mgFeedback.style.color='#2ecc71';
      if(hits>=3){ clearInterval(intervalId); setTimeout(onMinigameComplete,400); }
    } else {
      hits=0; hitEl.textContent='Hits: 0 / 3';
      mgFeedback.textContent='Missed the beat! Start over.'; mgFeedback.style.color='#e74c3c';
    }
  });

  // cleanup on modal close
  const origClose=window._rhythmCleanup;
  window._rhythmCleanup=()=>{ clearInterval(intervalId); if(origClose)origClose(); };
}

// ============================================================
// t9 — COLLECT SAMPLES: Bin Sort
// Items fall from the top; drag/click the right bin button
// to sort each one. 5 items total.
// ============================================================
function startSortGame() {
  document.getElementById('minigame-instructions').textContent =
    'Sort each item into the correct bin — Organic or Synthetic!';

  const ITEMS = shuffle([
    {label:'🌿 Fern Leaf', bin:'Organic'},
    {label:'🔩 Metal Bolt', bin:'Synthetic'},
    {label:'🍄 Mushroom',   bin:'Organic'},
    {label:'💾 Data Chip',  bin:'Synthetic'},
    {label:'🦴 Bone Sample',bin:'Organic'},
    {label:'⚗️ Beaker',     bin:'Synthetic'},
  ]).slice(0,5);

  let idx=0;
  const wrap=document.createElement('div');
  wrap.style.cssText='display:flex;flex-direction:column;align-items:center;gap:16px;';

  const counter=document.createElement('div');
  counter.style.cssText='color:#95a5a6;font-size:12px;';
  counter.textContent=`Item 1 of ${ITEMS.length}`;

  const itemDisplay=document.createElement('div');
  itemDisplay.style.cssText=`width:180px;height:60px;border-radius:10px;border:2px solid #f39c12;
    background:#0f0f23;display:flex;align-items:center;justify-content:center;
    font-size:18px;color:#ecf0f1;font-weight:bold;`;
  itemDisplay.textContent=ITEMS[0].label;

  const btnRow=document.createElement('div');
  btnRow.style.cssText='display:flex;gap:20px;';

  ['Organic','Synthetic'].forEach(binName=>{
    const btn=document.createElement('button');
    btn.className='modal-submit-btn';
    btn.style.background=binName==='Organic'?'#27ae60':'#2980b9';
    btn.textContent=binName==='Organic'?'🌿 Organic':'⚙️ Synthetic';
    btn.addEventListener('click',()=>{
      if(ITEMS[idx].bin===binName){
        mgFeedback.textContent='✓ Correct!'; mgFeedback.style.color='#2ecc71';
        idx++;
        if(idx>=ITEMS.length){ setTimeout(onMinigameComplete,400); return; }
        counter.textContent=`Item ${idx+1} of ${ITEMS.length}`;
        itemDisplay.textContent=ITEMS[idx].label;
      } else {
        mgFeedback.textContent='Wrong bin!'; mgFeedback.style.color='#e74c3c';
        itemDisplay.style.borderColor='#e74c3c';
        setTimeout(()=>itemDisplay.style.borderColor='#f39c12',500);
      }
    });
    btnRow.appendChild(btn);
  });

  wrap.appendChild(counter); wrap.appendChild(itemDisplay); wrap.appendChild(btnRow);
  mgWrap.appendChild(wrap);
}

// ============================================================
// t10 — SURVEY ZONE: Grid Scan
// A 5×5 grid with 8 lit cells. Click all of them before
// the 15-second timer runs out.
// ============================================================
function startGridGame() {
  document.getElementById('minigame-instructions').textContent =
    'Click all the GLOWING cells before time runs out!';

  const ROWS=5, COLS=5, LIT_COUNT=8, TIME=15;
  const litSet = new Set();
  while(litSet.size<LIT_COUNT) litSet.add(Math.floor(Math.random()*ROWS*COLS));

  let found=0, timeLeft=TIME, timerId=null;

  const wrap=document.createElement('div');
  wrap.style.cssText='display:flex;flex-direction:column;align-items:center;gap:10px;';

  const timerEl=document.createElement('div');
  timerEl.style.cssText='color:#f39c12;font-weight:bold;font-size:15px;';
  timerEl.textContent=`⏱ ${TIME}s`;

  const gridEl=document.createElement('div');
  gridEl.style.cssText=`display:grid;grid-template-columns:repeat(${COLS},46px);gap:6px;`;

  let cells=[];
  for(let i=0;i<ROWS*COLS;i++){
    const cell=document.createElement('div');
    const isLit=litSet.has(i);
    cell.style.cssText=`width:46px;height:46px;border-radius:8px;cursor:${isLit?'pointer':'default'};
      border:2px solid ${isLit?'#f39c12':'#2c2c4a'};
      background:${isLit?'rgba(243,156,18,0.25)':'#0f0f23'};
      box-shadow:${isLit?'0 0 8px rgba(243,156,18,0.5)':'none'};transition:all .15s;`;
    cell.dataset.lit=isLit?'1':'0';
    cell.dataset.clicked='0';
    cell.addEventListener('click',()=>{
      if(cell.dataset.lit!=='1'||cell.dataset.clicked==='1') return;
      cell.dataset.clicked='1';
      cell.style.background='rgba(46,204,113,0.35)';
      cell.style.borderColor='#2ecc71';
      cell.style.boxShadow='0 0 10px #2ecc71';
      found++;
      if(found>=LIT_COUNT){ clearInterval(timerId); setTimeout(onMinigameComplete,300); }
    });
    cells.push(cell);
    gridEl.appendChild(cell);
  }

  timerId=setInterval(()=>{
    timeLeft--;
    timerEl.textContent=`⏱ ${timeLeft}s`;
    if(timeLeft<=0){
      clearInterval(timerId);
      mgFeedback.textContent=`Time's up! (${found}/${LIT_COUNT} found). Try again.`;
      mgFeedback.style.color='#e74c3c';
      // reset
      found=0; timeLeft=TIME;
      cells.forEach((c,i)=>{
        const isLit=litSet.has(i);
        c.dataset.clicked='0';
        c.style.background=isLit?'rgba(243,156,18,0.25)':'#0f0f23';
        c.style.borderColor=isLit?'#f39c12':'#2c2c4a';
        c.style.boxShadow=isLit?'0 0 8px rgba(243,156,18,0.5)':'none';
      });
      timerId=setInterval(arguments.callee,1000);
    }
  },1000);

  wrap.appendChild(timerEl); wrap.appendChild(gridEl);
  mgWrap.appendChild(wrap);
}

// ============================================================
// t11 — MARK BOUNDARY: Pattern Trace
// A random sequence of colored dots is shown briefly, then
// hidden. Click them back in the same order.
// ============================================================
function startPatternGame() {
  document.getElementById('minigame-instructions').textContent =
    'Memorize the order the dots light up, then click them in the same order!';

  const DOTS=6;
  const COLORS=['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c'];
  const positions=[];
  // Place dots in a circle
  for(let i=0;i<DOTS;i++){
    const ang=(i/DOTS)*Math.PI*2-Math.PI/2;
    positions.push({ x:Math.round(100+80*Math.cos(ang)), y:Math.round(100+80*Math.sin(ang)), c:COLORS[i] });
  }
  const sequence=shuffle(Array.from({length:DOTS},(_,i)=>i));
  let phase='showing', playerSeq=[], showIdx=0;

  const canvas=document.createElement('canvas');
  canvas.width=200; canvas.height=200; canvas.id='minigame-canvas';
  mgWrap.appendChild(canvas);
  const ctx=canvas.getContext('2d');

  function drawBase(highlight=-1){
    ctx.clearRect(0,0,200,200);
    positions.forEach((p,i)=>{
      ctx.beginPath(); ctx.arc(p.x,p.y,18,0,Math.PI*2);
      ctx.fillStyle=(i===highlight)?p.c:'rgba(255,255,255,0.1)';
      ctx.fill();
      ctx.strokeStyle=p.c; ctx.lineWidth=2; ctx.stroke();
    });
  }

  function showSequence(){
    drawBase();
    if(showIdx>=sequence.length){ phase='input'; mgFeedback.textContent='Your turn! Click in order.'; mgFeedback.style.color='#f39c12'; return; }
    const dotIdx=sequence[showIdx];
    drawBase(dotIdx);
    showIdx++;
    setTimeout(()=>{ drawBase(); setTimeout(showSequence,400); },500);
  }
  setTimeout(showSequence,600);

  canvas.addEventListener('click',e=>{
    if(phase!=='input') return;
    const r=canvas.getBoundingClientRect();
    const mx=e.clientX-r.left, my=e.clientY-r.top;
    let hit=-1;
    positions.forEach((p,i)=>{ if(Math.hypot(mx-p.x,my-p.y)<20) hit=i; });
    if(hit===-1) return;
    const expected=sequence[playerSeq.length];
    if(hit===expected){
      drawBase(hit);
      setTimeout(()=>drawBase(),200);
      playerSeq.push(hit);
      if(playerSeq.length===DOTS) setTimeout(onMinigameComplete,400);
    } else {
      mgFeedback.textContent='Wrong dot! Starting over…'; mgFeedback.style.color='#e74c3c';
      playerSeq=[]; phase='showing'; showIdx=0;
      setTimeout(()=>{ mgFeedback.textContent=''; showSequence(); },800);
    }
  });
}

// ============================================================
// t12 — DROP SUPPLY: Weight Scale
// Drag numbered weights (1-5) onto a balance pan to total
// exactly the shown target value.
// ============================================================
function startScaleGame() {
  document.getElementById('minigame-instructions').textContent =
    'Drag weights onto the pan to reach the EXACT target weight!';

  const target=Math.floor(Math.random()*7)+5; // 5–11
  const weights=[1,2,3,4,5];
  let onScale=[];

  const wrap=document.createElement('div');
  wrap.style.cssText='display:flex;flex-direction:column;align-items:center;gap:14px;';

  const targetEl=document.createElement('div');
  targetEl.style.cssText='color:#f39c12;font-size:18px;font-weight:bold;';
  targetEl.textContent=`Target: ${target} kg`;

  const scaleEl=document.createElement('div');
  scaleEl.style.cssText=`width:200px;height:50px;border-radius:10px;border:2px solid #2c2c4a;
    background:#0f0f23;display:flex;align-items:center;justify-content:center;
    font-size:16px;color:#ecf0f1;gap:8px;`;
  scaleEl.innerHTML='<span>⚖️</span><span id="scale-total">0 kg</span>';

  const weightRow=document.createElement('div');
  weightRow.style.cssText='display:flex;gap:10px;flex-wrap:wrap;justify-content:center;';

  function updateScale(){
    const total=onScale.reduce((s,w)=>s+w,0);
    document.getElementById('scale-total').textContent=total+' kg';
    scaleEl.style.borderColor=total===target?'#2ecc71':total>target?'#e74c3c':'#2c2c4a';
    if(total===target) setTimeout(onMinigameComplete,400);
    else if(total>target){ mgFeedback.textContent='Too heavy!'; mgFeedback.style.color='#e74c3c'; }
    else { mgFeedback.textContent=''; }
  }

  weights.forEach(w=>{
    const btn=document.createElement('button');
    btn.className='mg-crate';
    btn.style.cssText=`width:52px;height:52px;font-size:16px;font-weight:bold;
      background:#5d4037;border:2px solid #795548;color:#fff;border-radius:8px;cursor:pointer;
      display:flex;align-items:center;justify-content:center;`;
    btn.textContent=w+'kg';
    btn.dataset.w=w;
    btn.title=`Click to add/remove ${w}kg`;
    btn.addEventListener('click',()=>{
      const val=parseInt(btn.dataset.w);
      const idx=onScale.indexOf(val);
      if(idx===-1){
        onScale.push(val);
        btn.style.background='#27ae60'; btn.style.borderColor='#2ecc71';
      } else {
        onScale.splice(idx,1);
        btn.style.background='#5d4037'; btn.style.borderColor='#795548';
      }
      updateScale();
    });
    weightRow.appendChild(btn);
  });

  const hint=document.createElement('div');
  hint.style.cssText='color:#7f8c8d;font-size:11px;';
  hint.textContent='Click a weight to add or remove it from the pan.';

  wrap.appendChild(targetEl); wrap.appendChild(scaleEl);
  wrap.appendChild(weightRow); wrap.appendChild(hint);
  mgWrap.appendChild(wrap);
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
