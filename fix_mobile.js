const fs = require('fs');

// ===== FIX index.html =====
let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Fix viewport meta to prevent zoom/scale issues on rotation
html = html.replace(
  'content="width=device-width, initial-scale=1.0"',
  'content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"'
);

// 2. Add portrait-mode blocker overlay before </body>
if (!html.includes('rotate-overlay')) {
  const overlay = `
  <!-- PORTRAIT ORIENTATION BLOCKER (mobile only) -->
  <div id="rotate-overlay">
    <div class="rotate-content">
      <div class="rotate-icon">&#x21BB;</div>
      <div class="rotate-title">Rotate Your Device</div>
      <div class="rotate-subtitle">This game requires landscape mode.</div>
    </div>
  </div>
`;
  html = html.replace('</body>', overlay + '</body>');
}

fs.writeFileSync('public/index.html', html);
console.log('index.html done');

// ===== APPEND to style.css =====
let css = fs.readFileSync('public/style.css', 'utf8');

const mobileAdditions = `

/* =============================================
   MOBILE / LANDSCAPE FIXES
   ============================================= */

/* Make the page and canvas fill the full screen without scrollbars */
html, body {
  overflow: hidden;
  overscroll-behavior: none;
  touch-action: none;
  height: 100%;
  width: 100%;
}

/* Override the canvas so it fills the window on mobile;
   JS resizeCanvas() will set its internal pixel dimensions. */
@media (max-width: 1024px) {
  #gameCanvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw !important;
    height: 100vh !important;
    border: none;
    border-radius: 0;
    box-shadow: none;
    z-index: 0;
  }

  /* Game UI anchored to top-right, scaled down for small screens */
  #game-ui {
    position: fixed;
    top: 8px;
    right: 8px;
    bottom: auto;
    left: auto;
    z-index: 10;
    gap: 4px;
  }

  #minimap-container {
    width: 120px;
    height: 120px;
  }

  #minimap-canvas {
    width: 120px !important;
    height: 120px !important;
  }

  /* D-pad: bottom-left, smaller buttons */
  #mobile-dpad-container {
    bottom: 10px;
    left: 10px;
  }
  .dpad-btn {
    width: 52px;
    height: 52px;
    font-size: 20px;
  }

  /* Mobile action buttons: bottom-right */
  #mobile-actions {
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 10;
    gap: 6px;
  }
  .mobile-action-btn {
    padding: 10px 14px;
    font-size: 13px;
  }

  /* Action/radar/ability buttons in game-ui */
  #action-btn, #radar-btn, #ability-btn {
    font-size: 13px;
    padding: 8px 12px;
  }
}

/* Portrait-mode rotate overlay: only shown on touch devices in portrait */
#rotate-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: #0a0f19;
  z-index: 99999;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.rotate-content {
  text-align: center;
  color: #ecf0f1;
  padding: 30px;
}

.rotate-icon {
  font-size: 80px;
  animation: spin-hint 2s ease-in-out infinite;
  display: block;
  margin-bottom: 20px;
}

@keyframes spin-hint {
  0%   { transform: rotate(0deg); }
  40%  { transform: rotate(-90deg); }
  60%  { transform: rotate(-90deg); }
  100% { transform: rotate(0deg); }
}

.rotate-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #3498db;
}

.rotate-subtitle {
  font-size: 15px;
  color: #95a5a6;
}

/* Show overlay only on touch devices in portrait orientation */
@media (max-width: 1024px) and (orientation: portrait) {
  #rotate-overlay {
    display: flex;
  }
}
`;

if (!css.includes('MOBILE / LANDSCAPE FIXES')) {
  css += mobileAdditions;
  fs.writeFileSync('public/style.css', css);
  console.log('style.css done');
} else {
  console.log('style.css already has mobile fixes, skipping');
}
