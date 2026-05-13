const fs = require('fs');
let code = fs.readFileSync('public/game.js', 'utf8');

// Add resizeCanvas function right after canvas is set up (after line ~52)
const canvasSetupMarker = 'const ctx = canvas.getContext(\'2d\');';
const resizeFn = `const ctx = canvas.getContext('2d');

// --- RESPONSIVE CANVAS RESIZE ---
// Resizes the canvas drawing buffer to fill the browser window exactly.
// Called on load and on every resize/orientationchange so mobile landscape
// always fills the screen without letterboxing or OS-level zoom.
function resizeCanvas() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width  = w;
    canvas.height = h;
  }
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => {
  // orientationchange fires before the new dimensions are available;
  // a small delay lets the browser settle first.
  setTimeout(resizeCanvas, 150);
});
`;

code = code.replace(canvasSetupMarker, resizeFn);
fs.writeFileSync('public/game.js', code);
console.log('resizeCanvas added');

// Verify
const check = code.includes('function resizeCanvas()');
console.log('resizeCanvas present:', check);
