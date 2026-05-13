const fs = require('fs');
let css = fs.readFileSync('public/style.css', 'utf8');

// ── Replace the broken mobile @media block ──────────────────────────────────
const oldBlock = `/* Override the canvas so it fills the window on mobile;
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
}`;

const newBlock = `/* ── Canvas: sits beneath the UI layer.
   resizeCanvas() in game.js sets the pixel dimensions via .width/.height.
   CSS just positions it at (0,0) without stealing stacking context. */
#gameCanvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;         /* below #ui-layer (z-index 2) */
  border: none;
  border-radius: 0;
  box-shadow: none;
}

/* The UI layer must sit above the canvas at all times */
#ui-layer {
  z-index: 2;
}

@media (max-width: 1024px) {
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
    width: 110px;
    height: 110px;
  }

  #minimap-canvas {
    width: 110px !important;
    height: 110px !important;
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
}`;

if (css.includes(oldBlock)) {
  css = css.replace(oldBlock, newBlock);
  console.log('Mobile canvas block replaced OK');
} else {
  // Try to find the section by a unique sub-string
  const marker = 'JS resizeCanvas() will set its internal pixel dimensions.';
  if (css.includes(marker)) {
    // Manually splice: find start of the comment before the marker
    const startIdx = css.indexOf('/* Override the canvas');
    const endMarker = '  /* Action/radar/ability buttons in game-ui */\n  #action-btn, #radar-btn, #ability-btn {\n    font-size: 13px;\n    padding: 8px 12px;\n  }\n}';
    const endIdx = css.indexOf(endMarker) + endMarker.length;
    css = css.slice(0, startIdx) + newBlock + css.slice(endIdx);
    console.log('Mobile canvas block replaced via index splice');
  } else {
    console.error('ERROR: Could not find old block!');
    process.exit(1);
  }
}

fs.writeFileSync('public/style.css', css);
console.log('style.css saved');
