let audioCtx = null;
let masterGain = null;
let musicActive = false;

// Oscillators for the drone
let droneOsc1, droneOsc2;
let shimmerOsc;

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.connect(audioCtx.destination);
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
}

function startAmbientMusic() {
  initAudio();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  // 1. CREATE DEEP DRONE (55Hz and 57Hz for beating)
  droneOsc1 = audioCtx.createOscillator();
  droneOsc1.type = 'sine';
  droneOsc1.frequency.setValueAtTime(55, audioCtx.currentTime);
  
  droneOsc2 = audioCtx.createOscillator();
  droneOsc2.type = 'sine';
  droneOsc2.frequency.setValueAtTime(57, audioCtx.currentTime);

  const droneGain = audioCtx.createGain();
  droneGain.gain.setValueAtTime(0.15, audioCtx.currentTime);

  droneOsc1.connect(droneGain);
  droneOsc2.connect(droneGain);
  droneGain.connect(masterGain);

  droneOsc1.start();
  droneOsc2.start();

  // 2. CREATE TECH SHIMMER (random high pings)
  setInterval(() => {
    if (!musicActive) return;
    playShimmerPing();
  }, 4000 + Math.random() * 8000);

  // Fade In
  masterGain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 2.0);
  musicActive = true;
}

function playShimmerPing() {
  if (!audioCtx) return;
  const pingOsc = audioCtx.createOscillator();
  const pingGain = audioCtx.createGain();
  
  pingOsc.type = 'sine';
  pingOsc.frequency.setValueAtTime(800 + Math.random() * 1200, audioCtx.currentTime);
  
  pingGain.gain.setValueAtTime(0, audioCtx.currentTime);
  pingGain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.5);
  pingGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 4.0);
  
  pingOsc.connect(pingGain);
  pingGain.connect(masterGain);
  
  pingOsc.start();
  pingOsc.stop(audioCtx.currentTime + 4.1);
}

function toggleAmbientMusic() {
  if (!musicActive) {
    startAmbientMusic();
    return true; // Music ON
  } else {
    // Fade Out
    if (masterGain) {
       masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
    }
    musicActive = false;
    return false; // Music OFF
  }
}
