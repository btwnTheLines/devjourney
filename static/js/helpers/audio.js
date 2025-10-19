// helpers/audio.js
// - HARD stereo panning with exact zeros at extremes (twice across x=0..60).
// - Delay (peak wet at x=27.5).
// - Convolver Reverb (small -> large -> medium across 0..60, with large peaking at 45).
// - Master Compressor (peaks at x=30 and x=60).
//
// Works with your existing torusScene.js which calls `updatePan()` each frame.

import { camera } from "../core/threeSetup.js";

export const audioContext = new (window.AudioContext || window.webkitAudioContext)();

let audioBuffer = null;
let source = null;

// ==== PAN / DRY PATH NODES (hard L/R) ====
let splitter = null;
let leftGain = null;
let rightGain = null;
let merger = null;

// We'll tap the panned stereo here for effects & dry mix
let dryGain = null;

// ==== DELAY (echo) ====
let delayNode = null;
let delayFeedback = null;
let delayWet = null;

// ==== CONVOLVER REVERB (small/large/medium crossfade) ====
let convolverSmall = null;
let convolverLarge = null;
let convolverMedium = null;
let convWetSmall = null;
let convWetLarge = null;
let convWetMedium = null;

// ==== MASTER MIX / COMPRESSOR ====
let mix = null;
let compressor = null;

// ----------------------------------------------------
// Utilities
// ----------------------------------------------------
async function decode(url) {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return await audioContext.decodeAudioData(buf);
}

// Gaussian-shaped peak (smooth)
function gauss(x, center, width) {
  const t = (x - center) / width;
  return Math.exp(-0.5 * t * t);
}

// Linear interpolation helper
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Clamp
function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

// ----------------------------------------------------
// Loading
// ----------------------------------------------------
export async function loadAudio(url) {
  audioBuffer = await decode(url);
}

// Load three IRs (adjust paths if needed)
async function loadImpulseResponses() {
  const [small, large, medium] = await Promise.all([
    decode("../../ir/small.wav"),
    decode("../../ir/large.wav"),
    decode("../../ir/medium.wav"),
  ]);
  return { small, large, medium };
}

// ----------------------------------------------------
// Build Graph
// ----------------------------------------------------
function ensureGraphBuilt(irBuffers) {
  if (mix) return; // already built

  // --- Split/Pan/Merge (hard balance we control) ---
  splitter = audioContext.createChannelSplitter(2);
  leftGain = audioContext.createGain();
  rightGain = audioContext.createGain();
  merger = audioContext.createChannelMerger(2);
  dryGain = audioContext.createGain();
  dryGain.gain.value = 1;

  // Route: input L -> left path, input R -> right path
  splitter.connect(leftGain, 0);
  splitter.connect(rightGain, 1);

  leftGain.connect(merger, 0, 0);  // -> left out
  rightGain.connect(merger, 0, 1); // -> right out

  // --- Effects tap point is the panned stereo (merger) ---
  // We'll feed merger to dry, delay, and convolvers.

  // --- Delay with feedback (parallel send) ---
  delayNode = audioContext.createDelay();
  delayNode.delayTime.value = 0.35; // base delay

  delayFeedback = audioContext.createGain();
  delayFeedback.gain.value = 0.32;  // feedback amount

  delayWet = audioContext.createGain();
  delayWet.gain.value = 0.0;        // start dry, will modulate

  // feedback loop
  delayNode.connect(delayFeedback);
  delayFeedback.connect(delayNode);

  // --- Convolver Reverbs (3 sizes) with independent wet gains ---
  convolverSmall = audioContext.createConvolver();
  convolverLarge = audioContext.createConvolver();
  convolverMedium = audioContext.createConvolver();

  convolverSmall.buffer = irBuffers.small;
  convolverLarge.buffer = irBuffers.large;
  convolverMedium.buffer = irBuffers.medium;

  convWetSmall = audioContext.createGain();
  convWetLarge = audioContext.createGain();
  convWetMedium = audioContext.createGain();

  // Start with "small" predominance
  convWetSmall.gain.value = 0.25;
  convWetLarge.gain.value = 0.0;
  convWetMedium.gain.value = 0.0;

  // --- Mix & Master ---
  mix = audioContext.createGain();

  compressor = audioContext.createDynamicsCompressor();
  compressor.threshold.value = -18; // default; will modulate
  compressor.knee.value = 6;
  compressor.ratio.value = 3;
  compressor.attack.value = 0.01;
  compressor.release.value = 0.15;

  // --- Wiring ---

  // Dry to mix
  merger.connect(dryGain).connect(mix);

  // Delay send: tap merger -> delay -> wet -> mix
  merger.connect(delayNode);
  delayNode.connect(delayWet).connect(mix);

  // Convolver sends: tap merger -> convolverX -> wetX -> mix
  merger.connect(convolverSmall);
  merger.connect(convolverLarge);
  merger.connect(convolverMedium);

  convolverSmall.connect(convWetSmall).connect(mix);
  convolverLarge.connect(convWetLarge).connect(mix);
  convolverMedium.connect(convWetMedium).connect(mix);

  // Master
  mix.connect(compressor).connect(audioContext.destination);
}

// ----------------------------------------------------
// Playback
// ----------------------------------------------------
export function playAudio() {
  if (!audioBuffer) {
    console.error("Audio not loaded yet!");
    return;
  }

  stopAudio(); // clean up any previous

  source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = true; // optional

  // feed into pan splitter
  source.connect(splitter);

  source.start();
  source.onended = () => {
    try { source.disconnect(); } catch {}
    source = null;
  };
}

export function stopAudio() {
  if (source) {
    try { source.stop(); } catch {}
    try { source.disconnect(); } catch {}
    source = null;
  }
}

// ----------------------------------------------------
// Scroll-driven updates (Pan + FX envelopes)
// Call this every frame (you already do).
// ----------------------------------------------------
export function updatePan() {
  if (!leftGain || !rightGain) return;

  const x = clamp(camera.position.x, 0, 60);

  // ===== 1) HARD L/R PAN — two full sweeps across 0..60 =====
  // Triangle pan in [-1, +1] repeating every 30 units
  const period = 30;
  const t = (x % period) / period; // 0..1 within each half
  let pan = 1 - 4 * Math.abs(t - 0.5); // -1 -> +1 -> -1
  pan = clamp(pan, -1, 1);

  // Convert to hard channel gains with exact zeros at ends
  let L = pan <= 0 ? 1 : 1 - pan;   // pan=-1 => 1, pan=+1 => 0
  let R = pan >= 0 ? 1 : 1 + pan;   // pan=+1 => 1, pan=-1 => 0

  const now = audioContext.currentTime;

  // Snap extremes, smooth in-between
  if (pan <= -0.999999) {
    leftGain.gain.setValueAtTime(1, now);
    rightGain.gain.setValueAtTime(0, now);
  } else if (pan >= 0.999999) {
    leftGain.gain.setValueAtTime(0, now);
    rightGain.gain.setValueAtTime(1, now);
  } else {
    leftGain.gain.setTargetAtTime(L, now, 0.02);
    rightGain.gain.setTargetAtTime(R, now, 0.02);
  }

  // ===== 2) DELAY — peak at x = 27.5 =====
  // Gaussian envelope controlling wet (and a tiny delay time wobble)
  const delayPeak = gauss(x, 27.5, 6.0); // width=6 for smoothness
  const wetDelay = lerp(0.0, 0.6, delayPeak); // up to 0.6 wet at peak
  delayWet.gain.setTargetAtTime(wetDelay, now, 0.05);

  // Subtle time modulation near the peak (±40 ms)
  const baseDelay = 0.35;
  const mod = (delayPeak - 0.5) * 0.08; // -0.04..+0.04 approx
  delayNode.delayTime.setTargetAtTime(clamp(baseDelay + mod, 0.05, 0.7), now, 0.05);

  // Feedback gentle bias with the same envelope (0.2..0.4)
  const fb = lerp(0.2, 0.4, delayPeak);
  delayFeedback.gain.setTargetAtTime(fb, now, 0.05);

  // ===== 3) CONVOLVER REVERB — small -> large -> medium =====
  // Crossfade across the range:
  //   0..15: small dominant
  //   15..45: crossfade small -> large
  //   45..60: crossfade large -> medium, with large peaking at 45
  //
  // We'll also set an overall reverb wet level that grows slightly toward 45, then eases.

  let wSmall = 0, wLarge = 0, wMedium = 0;

  if (x <= 15) {
    // Small only (fade-in from 0..15)
    const k = x / 15;          // 0..1
    wSmall = lerp(0.15, 0.5, k);
    wLarge = 0.0;
    wMedium = 0.0;
  } else if (x <= 45) {
    // Crossfade small -> large between 15..45
    const k = (x - 15) / 30;   // 0..1
    wSmall = lerp(0.5, 0.0, k);
    wLarge = lerp(0.0, 0.7, k); // large peaks ~0.7 at 45
    wMedium = 0.0;
  } else {
    // Crossfade large -> medium between 45..60
    const k = (x - 45) / 15;   // 0..1
    wLarge  = lerp(0.7, 0.0, k);
    wMedium = lerp(0.0, 0.5, k); // medium ~0.5 at 60
    wSmall  = 0.0;
  }

  // Smooth the wet levels
  convWetSmall.gain.setTargetAtTime(wSmall, now, 0.08);
  convWetLarge.gain.setTargetAtTime(wLarge, now, 0.08);
  convWetMedium.gain.setTargetAtTime(wMedium, now, 0.08);

  // ===== 4) MASTER COMPRESSOR — peaks at x=30 and x=60 =====
  // Build a strength envelope from two Gaussians, then map to threshold/ratio.
  const compStrength = Math.max(gauss(x, 30, 5.5), gauss(x, 60, 5.5)); // 0..1-ish

  const thr = lerp(-16, -34, compStrength); // lower threshold when strong
  const rat = lerp(2.0, 7.0, compStrength); // higher ratio when strong
  const atk = lerp(0.015, 0.005, compStrength);
  const rel = lerp(0.18, 0.12, compStrength);

  compressor.threshold.setTargetAtTime(thr, now, 0.05);
  compressor.ratio.setTargetAtTime(rat, now, 0.05);
  compressor.attack.setTargetAtTime(atk, now, 0.05);
  compressor.release.setTargetAtTime(rel, now, 0.05);
}

// ----------------------------------------------------
// Init (loads audio + IRs, builds graph, wires button)
// ----------------------------------------------------
export async function initAudio(url, playButtonId) {
  // Load audio + IRs in parallel
  const [_, irs] = await Promise.all([
    loadAudio(url),
    loadImpulseResponses()
  ]);

  // Build the full graph now that IRs are available
  ensureGraphBuilt(irs);

  // Wire the UI button
  const button = document.getElementById(playButtonId);
  if (!button) {
    console.warn(`Button #${playButtonId} not found; audio toggle unavailable.`);
    return;
  }
  button.disabled = false;

  const setLabel = () => button.textContent = source ? "Disable Audio ♬" : "Enable Audio ♬";
  setLabel();

  button.addEventListener("click", async () => {
    if (audioContext.state === "suspended") await audioContext.resume();
    if (source) { stopAudio(); } else { playAudio(); }
    setLabel();
  });
}

