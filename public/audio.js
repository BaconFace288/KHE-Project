let audioCtx = null;
let masterGain = null;
let musicActive = false;

// Oscillators for the drone
let droneOsc1, droneOsc2;
let windSource, windFilter;

// Persistent ping interval
setInterval(() => {
  if (!musicActive) return;
  if (Math.random() > 0.5) playShimmerPing();
  else playNaturePing();
}, 5000 + Math.random() * 5000);

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.connect(audioCtx.destination);
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
}

function createNoiseBuffer() {
  const bufferSize = audioCtx.sampleRate * 2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (lastOut + (0.02 * white)) / 1.02; // soft brownian noise
    lastOut = data[i];
    data[i] *= 3.5; // boost volume
  }
  return buffer;
}

function startAmbientMusic() {
  initAudio();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  // 1. CREATE DEEP DRONE (55Hz and 57Hz)
  droneOsc1 = audioCtx.createOscillator();
  droneOsc1.type = 'sine';
  droneOsc1.frequency.setValueAtTime(55, audioCtx.currentTime);
  
  droneOsc2 = audioCtx.createOscillator();
  droneOsc2.type = 'sine';
  droneOsc2.frequency.setValueAtTime(57, audioCtx.currentTime);

  const droneGain = audioCtx.createGain();
  droneGain.gain.setValueAtTime(0.12, audioCtx.currentTime);

  droneOsc1.connect(droneGain);
  droneOsc2.connect(droneGain);
  droneGain.connect(masterGain);

  droneOsc1.start();
  droneOsc2.start();

  // 2. CREATE WIND (Filtered Brownian Noise)
  windSource = audioCtx.createBufferSource();
  windSource.buffer = createNoiseBuffer();
  windSource.loop = true;
  
  windFilter = audioCtx.createBiquadFilter();
  windFilter.type = 'lowpass';
  windFilter.frequency.setValueAtTime(400, audioCtx.currentTime);
  windFilter.Q.setValueAtTime(1, audioCtx.currentTime);
  
  const windGain = audioCtx.createGain();
  windGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  
  windSource.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(masterGain);
  windSource.start();

  // LFO for wind movement
  const windLfo = audioCtx.createOscillator();
  windLfo.frequency.setValueAtTime(0.12, audioCtx.currentTime);
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.setValueAtTime(250, audioCtx.currentTime);
  windLfo.connect(lfoGain);
  lfoGain.connect(windFilter.frequency);
  windLfo.start();


  // Fade In
  masterGain.gain.linearRampToValueAtTime(0.45, audioCtx.currentTime + 2.5);
  musicActive = true;
}

function playShimmerPing() {
  if (!audioCtx) return;
  const pingOsc = audioCtx.createOscillator();
  const pingGain = audioCtx.createGain();
  
  pingOsc.type = 'sine';
  pingOsc.frequency.setValueAtTime(800 + Math.random() * 1200, audioCtx.currentTime);
  
  pingGain.gain.setValueAtTime(0, audioCtx.currentTime);
  pingGain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.5);
  pingGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.0);
  
  pingOsc.connect(pingGain);
  pingGain.connect(masterGain);
  pingOsc.start();
  pingOsc.stop(audioCtx.currentTime + 3.1);
}

function playNaturePing() {
  if (!audioCtx) return;
  const pingOsc = audioCtx.createOscillator();
  const pingGain = audioCtx.createGain();
  
  // Bird chirp or Water drip
  const type = Math.random() > 0.5 ? 'chirp' : 'drip';
  
  if (type === 'chirp') {
    pingOsc.type = 'triangle';
    pingOsc.frequency.setValueAtTime(1500 + Math.random() * 2000, audioCtx.currentTime);
    pingOsc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.2);
    pingGain.gain.setValueAtTime(0, audioCtx.currentTime);
    pingGain.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 0.05);
    pingGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
  } else {
    pingOsc.type = 'sine';
    pingOsc.frequency.setValueAtTime(600 + Math.random() * 400, audioCtx.currentTime);
    pingGain.gain.setValueAtTime(0, audioCtx.currentTime);
    pingGain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.02);
    pingGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
  }
  
  pingOsc.connect(pingGain);
  pingGain.connect(masterGain);
  pingOsc.start();
  pingOsc.stop(audioCtx.currentTime + 1.6);
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

function playSubtleRadarPing() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.3);
  
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
  
  // Connect directly to destination to bypass music mute
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.6);
}

