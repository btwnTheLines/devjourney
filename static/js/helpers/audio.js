// helpers/audio.js
// Smooth stereo panning that crosses left<->right twice as the camera x moves 0..60.
// Pan uses a StereoPannerNode (DAW-style). No 3D/HRTF here.

import { camera } from "../core/threeSetup.js";

export const audioContext = new (window.AudioContext || window.webkitAudioContext)();

let audioBuffer = null;
let source = null;

// Primary node: StereoPanner (simple stereo balance)
let stereo = null;

// Fallback (rare older browsers): manual L/R via gains
let splitter = null;
let leftGain = null;
let rightGain = null;
let merger = null;

function hasStereoPannerSupport() {
  try {
    return typeof window.StereoPannerNode === "function";
  } catch {
    return false;
  }
}

// ------------------------
// Load audio into a buffer
// ------------------------
export async function loadAudio(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
}

// ------------------------
// Create (or reuse) the output chain
// ------------------------
function ensureOutputChain() {
  if (hasStereoPannerSupport()) {
    if (!stereo) {
      stereo = new StereoPannerNode(audioContext, { pan: 0 });
      stereo.connect(audioContext.destination);
    }
  } else if (!splitter) {
    // Build a StereoPanner fallback: Source -> Split -> Gains -> Merge -> Destination
    splitter = audioContext.createChannelSplitter(2);
    leftGain = audioContext.createGain();
    rightGain = audioContext.createGain();
    merger = audioContext.createChannelMerger(2);

    // Route left input to both channels with gains we control (classic pan law not enforced here)
    splitter.connect(leftGain, 0);
    splitter.connect(rightGain, 1);

    // Rebuild stereo
    leftGain.connect(merger, 0, 0);   // to left
    rightGain.connect(merger, 0, 1);  // to right

    merger.connect(audioContext.destination);
  }
}

// ------------------------
// Start playback
// ------------------------
export function playAudio() {
  if (!audioBuffer) {
    console.error("Audio not loaded yet!");
    return;
  }

  // Stop old source if any
  if (source) {
    try { source.stop(); } catch {}
    try { source.disconnect(); } catch {}
    source = null;
  }

  // New source
  source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = true; // optional—remove if you don't want looping

  ensureOutputChain();

  if (stereo) {
    source.connect(stereo);
  } else {
    // Fallback: feed into splitter chain
    source.connect(splitter);
  }

  source.start();

  source.onended = () => {
    try { source.disconnect(); } catch {}
    source = null;
  };
}

// ------------------------
// Stop playback (helper)
// ------------------------
export function stopAudio() {
  if (source) {
    try { source.stop(); } catch {}
    try { source.disconnect(); } catch {}
    source = null;
  }
}

// ------------------------
// Update pan based on camera.position.x in [0, 60]
// Cross stereo field TWICE: period = 30 (0→30 one L↔R cycle, 30→60 second cycle)
// Triangle wave: pan = 1 - 4 * | frac(x/30) - 0.5 |
// Then clamp to [-1, 1] and smooth updates.
// ------------------------
export function updatePan() {
  if (!stereo && !leftGain) return; // not ready yet

  const x = camera.position.x;    // your camera x
  const minX = 0;
  const maxX = 60;

  // Clamp to domain just in case
  const xClamped = Math.min(maxX, Math.max(minX, x));

  // Normalize by triangle period (30)
  const period = 30;
  const t = (xClamped % period) / period; // 0..1 within each 30-unit span

  // Triangle wave in [-1, +1], with:
  // t=0   -> -1 (Left)
  // t=0.5 -> +1 (Right)
  // t=1   -> -1 (Left)
  let pan = 1 - 4 * Math.abs(t - 0.5);
  // Clamp (floating math safety)
  pan = Math.max(-1, Math.min(1, pan));

  const now = audioContext.currentTime;

  if (stereo) {
    // Smooth toward target to avoid zipper noise
    stereo.pan.setTargetAtTime(pan, now, 0.02);
  } else {
    // Fallback: emulate StereoPanner
    // Simple law: left = (1 - pan)/2, right = (1 + pan)/2  (pan ∈ [-1,1])
    const l = (1 - pan) * 0.5;
    const r = (1 + pan) * 0.5;

    leftGain.gain.setTargetAtTime(l, now, 0.02);
    rightGain.gain.setTargetAtTime(r, now, 0.02);
  }
}

// ------------------------
// Initialize + wire the UI button
// ------------------------
export async function initAudio(url, playButtonId) {
  await loadAudio(url);

  const button = document.getElementById(playButtonId);
  if (!button) {
    console.warn(`Button #${playButtonId} not found; audio will not be user-toggleable.`);
    return;
  }

  button.disabled = false;

  const updateLabel = () => {
    const enabled = !!source;
    button.innerText = enabled ? "Disable Audio ♬" : "Enable Audio ♬";
  };

  updateLabel();

  button.addEventListener("click", async () => {
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    if (source) {
      // Toggle OFF
      stopAudio();
    } else {
      // Toggle ON
      playAudio();
    }

    updateLabel();
  });
}
