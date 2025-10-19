// helpers/audio.js
// HARD stereo panning: fully left/right based on camera.x, two full sweeps (0..60)

import { camera } from "../core/threeSetup.js";

export const audioContext = new (window.AudioContext || window.webkitAudioContext)();

let audioBuffer = null;
let source = null;

// Manual L/R control
let splitter = null;
let leftGain = null;
let rightGain = null;
let merger = null;

// ------------------------
// Load audio
// ------------------------
export async function loadAudio(url) {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  audioBuffer = await audioContext.decodeAudioData(buf);
}

// ------------------------
// Create channel chain:  Mono/Stereo → Split → Gains → Merge → Destination
// ------------------------
function ensureOutputChain() {
  if (splitter) return;

  splitter = audioContext.createChannelSplitter(2);
  leftGain = audioContext.createGain();
  rightGain = audioContext.createGain();
  merger = audioContext.createChannelMerger(2);

  // Connect both input channels to both gain nodes (so mono works too)
  splitter.connect(leftGain, 0);
  splitter.connect(rightGain, 0);

  // Merge back to stereo
  leftGain.connect(merger, 0, 0);   // Left channel
  rightGain.connect(merger, 0, 1);  // Right channel

  merger.connect(audioContext.destination);
}

// ------------------------
// Start / stop
// ------------------------
export function playAudio() {
  if (!audioBuffer) {
    console.error("Audio not loaded yet!");
    return;
  }

  stopAudio(); // stop old one if any

  source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = true;

  ensureOutputChain();
  source.connect(splitter);
  source.start();
}

export function stopAudio() {
  if (source) {
    try { source.stop(); } catch {}
    try { source.disconnect(); } catch {}
    source = null;
  }
}

// ------------------------
// Hard L/R pan update: 2 sweeps over x ∈ [0,60]
// ------------------------
export function updatePan() {
  if (!leftGain || !rightGain) return;

  const x = camera.position.x;
  const period = 30;  // 0–30 = first sweep, 30–60 = second
  const t = ((x % period) / period); // 0..1 in each half
  // Triangle wave from -1..+1 (Left→Right→Left)
  let pan = 1 - 4 * Math.abs(t - 0.5);
  pan = Math.max(-1, Math.min(1, pan));

  // Hard-panned gains (not constant power):
  // pan=-1 → full left, none right
  // pan= 0 → equal
  // pan=+1 → full right, none left
  const left = pan <= 0 ? 1 : 1 - pan;   // simple linear fade
  const right = pan >= 0 ? 1 : 1 + pan;  // symmetrical

  const now = audioContext.currentTime;
  leftGain.gain.setTargetAtTime(left, now, 0.02);
  rightGain.gain.setTargetAtTime(right, now, 0.02);
}

// ------------------------
// Init with button
// ------------------------
export async function initAudio(url, playButtonId) {
  await loadAudio(url);

  const btn = document.getElementById(playButtonId);
  if (!btn) {
    console.warn(`Button #${playButtonId} not found.`);
    return;
  }
  btn.disabled = false;

  const updateLabel = () => {
    btn.textContent = source ? "Disable Audio ♬" : "Enable Audio ♬";
  };
  updateLabel();

  btn.addEventListener("click", async () => {
    if (audioContext.state === "suspended") await audioContext.resume();

    if (source) stopAudio();
    else playAudio();

    updateLabel();
  });
}
