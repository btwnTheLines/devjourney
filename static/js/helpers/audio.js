// helpers/audio.js
// - HARD stereo panning with exact zeros at extremes (twice across x=0..60).
// - Delay: very noticeable around x≈27.5 (wet & feedback rise, slight time wobble, toned repeats).
// - Convolver Reverb: small -> LARGE (peaks at 45) -> medium, with predelay + tone shaping.
// - Parallel "Punchy Bass" Compression: strong at x=30 and x=60 (low-shelf boosted comp bus).
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
let delayTone = null; // tone after delay (keeps repeats clear)

// ==== CONVOLVER REVERB (small/large/medium crossfade) ====
let convolverSmall = null;
let convolverLarge = null;
let convolverMedium = null;
let convWetSmall = null;
let convWetLarge = null;
let convWetMedium = null;

// Shared reverb bus for tone shaping
let reverbBus = null;
let reverbPreDelay = null;
let reverbTone = null;

// ==== MASTER / PARALLEL COMPRESSION (punch) ====
let mix = null;               // sums dry + effects
let compressor = null;        // compressor node (on parallel bus)
let compPreEQ = null;         // low-shelf boost before comp
let compWet = null;           // how much compressed signal is added back (parallel)
let compMakeup = null;        // makeup gain after compressor

// ----------------------------------------------------
// Utilities
// ----------------------------------------------------
async function decode(url) {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return await audioContext.decodeAudioData(buf);
}

function gauss(x, center, width) {
  const t = (x - center) / width;
  return Math.exp(-0.5 * t * t);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

// ----------------------------------------------------
// Loading
// ----------------------------------------------------
export async function loadAudio(url) {
  audioBuffer = await decode(url);
}

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
  if (mix) return;

  // --- Split / hard-pan / merge ---
  splitter = audioContext.createChannelSplitter(2);
  leftGain = audioContext.createGain();
  rightGain = audioContext.createGain();
  merger = audioContext.createChannelMerger(2);

  dryGain = audioContext.createGain();
  dryGain.gain.value = 1;

  splitter.connect(leftGain, 0);
  splitter.connect(rightGain, 1);

  leftGain.connect(merger, 0, 0);
  rightGain.connect(merger, 0, 1);

  // --- Delay (parallel) ---
  delayNode = audioContext.createDelay();
  delayNode.delayTime.value = 0.45; // a bit longer base time for clarity

  delayFeedback = audioContext.createGain();
  delayFeedback.gain.value = 0.45;  // stronger base feedback

  delayWet = audioContext.createGain();
  delayWet.gain.value = 0.0;        // modulated per frame

  delayTone = audioContext.createBiquadFilter();
  delayTone.type = "lowpass";
  delayTone.frequency.value = 6500; // cut a little top so repeats feel thicker
  delayTone.Q.value = 0.7;

  // feedback loop
  delayNode.connect(delayFeedback);
  delayFeedback.connect(delayNode);

  // --- Reverb (3 convolvers) ---
  convolverSmall = audioContext.createConvolver();
  convolverLarge = audioContext.createConvolver();
  convolverMedium = audioContext.createConvolver();

  convolverSmall.buffer = irBuffers.small;
  convolverLarge.buffer = irBuffers.large;
  convolverMedium.buffer = irBuffers.medium;

  convWetSmall = audioContext.createGain();
  convWetLarge = audioContext.createGain();
  convWetMedium = audioContext.createGain();

  convWetSmall.gain.value = 0.3;  // higher base than before
  convWetLarge.gain.value = 0.0;
  convWetMedium.gain.value = 0.0;

  // Shared reverb bus for predelay + tone shaping
  reverbBus = audioContext.createGain();
  reverbPreDelay = audioContext.createDelay();
  reverbPreDelay.delayTime.value = 0.03; // 30ms predelay default

  reverbTone = audioContext.createBiquadFilter();
  reverbTone.type = "lowpass";
  reverbTone.frequency.value = 8000; // smooth highs so the big verb is lush, not harsh
  reverbTone.Q.value = 0.7;

  // --- Master mix & PARALLEL compression ---
  mix = audioContext.createGain();

  // Parallel comp path: merger -> lowshelf boost -> compressor -> makeup gain -> compWet -> mix
  compPreEQ = audioContext.createBiquadFilter();
  compPreEQ.type = "lowshelf";
  compPreEQ.frequency.value = 120;  // focus the low end
  compPreEQ.gain.value = 0;         // modulated per frame

  compressor = audioContext.createDynamicsCompressor();
  compressor.threshold.value = -24;
  compressor.knee.value = 6;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.02;   // slightly slower than very fast to let transients pop
  compressor.release.value = 0.10;

  compMakeup = audioContext.createGain();
  compMakeup.gain.value = 1.0;      // modulated per frame
  compWet = audioContext.createGain();
  compWet.gain.value = 0.0;         // blended amount (parallel)

  // --- Wiring ---

  // Dry to mix
  merger.connect(dryGain).connect(mix);

  // Delay send: merger -> delay -> tone -> wet -> mix
  merger.connect(delayNode);
  delayNode.connect(delayTone).connect(delayWet).connect(mix);

  // Reverb sends: merger -> predelay -> each convolver -> their wet gains -> reverbBus -> reverbTone -> mix
  merger.connect(reverbPreDelay);

  reverbPreDelay.connect(convolverSmall);
  reverbPreDelay.connect(convolverLarge);
  reverbPreDelay.connect(convolverMedium);

  convolverSmall.connect(convWetSmall).connect(reverbBus);
  convolverLarge.connect(convWetLarge).connect(reverbBus);
  convolverMedium.connect(convWetMedium).connect(reverbBus);

  reverbBus.connect(reverbTone).connect(mix);

  // Parallel compression chain
  merger.connect(compPreEQ).connect(compressor).connect(compMakeup).connect(compWet).connect(mix);

  // Final out
  mix.connect(audioContext.destination);
}

// ----------------------------------------------------
// Playback
// ----------------------------------------------------
export function playAudio() {
  if (!audioBuffer) {
    console.error("Audio not loaded yet!");
    return;
  }

  stopAudio();

  source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = true;

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
// ----------------------------------------------------
export function updatePan() {
  if (!leftGain || !rightGain) return;

  const x = clamp(camera.position.x, 0, 60);
  const now = audioContext.currentTime;

  // ===== 1) HARD L/R PAN — two full sweeps across 0..60 =====
  const period = 30;
  const t = (x % period) / period;
  let pan = 1 - 4 * Math.abs(t - 0.5); // -1..+1
  pan = clamp(pan, -1, 1);

  let L = pan <= 0 ? 1 : 1 - pan;
  let R = pan >= 0 ? 1 : 1 + pan;

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

  // ===== 2) DELAY — big + obvious at x≈27.5 =====
  const delayPeak = gauss(x, 27.5, 6.0);         // 0..~1
  const wetDelay  = lerp(0.0, 0.9, delayPeak);   // up to 0.9 wet
  delayWet.gain.setTargetAtTime(wetDelay, now, 0.05);

  const baseDelay = 0.45;
  const mod = (delayPeak - 0.5) * 0.12;          // ±0.06s wobble near the peak
  delayNode.delayTime.setTargetAtTime(clamp(baseDelay + mod, 0.08, 0.8), now, 0.05);

  const fb = lerp(0.35, 0.65, delayPeak);        // more repeats at peak
  delayFeedback.gain.setTargetAtTime(fb, now, 0.08);

  // Slightly darken repeats as intensity grows (musical)
  const toneCut = lerp(9000, 4500, delayPeak);
  delayTone.frequency.setTargetAtTime(toneCut, now, 0.1);

  // ===== 3) REVERB — small -> LARGE (peak at 45) -> medium, with predelay & tone =====
  let wSmall = 0, wLarge = 0, wMedium = 0;

  if (x <= 15) {
    const k = x / 15;                // 0..1
    wSmall = lerp(0.25, 0.7, k);     // noticeably wet even early
    wLarge = 0.0;
    wMedium = 0.0;
  } else if (x <= 45) {
    const k = (x - 15) / 30;         // 0..1
    wSmall = lerp(0.7, 0.0, k);
    wLarge = lerp(0.0, 1.0, k);      // LARGE up to 1.0 at 45
    wMedium = 0.0;
  } else {
    const k = (x - 45) / 15;         // 0..1
    wLarge  = lerp(1.0, 0.0, k);
    wMedium = lerp(0.0, 0.8, k);     // medium strong at 60
    wSmall  = 0.0;
  }

  convWetSmall.gain.setTargetAtTime(wSmall, now, 0.08);
  convWetLarge.gain.setTargetAtTime(wLarge, now, 0.08);
  convWetMedium.gain.setTargetAtTime(wMedium, now, 0.08);

  // Reverb predelay grows a bit toward the big space, then eases
  const pd = (x <= 45)
    ? lerp(0.02, 0.06, (x - 0) / 45)   // up to 60ms around the big hall
    : lerp(0.06, 0.03, (x - 45) / 15); // back down toward 30ms
  reverbPreDelay.delayTime.setTargetAtTime(clamp(pd, 0.01, 0.08), now, 0.05);

  // Reverb tone: darker as spaces get larger (keeps it lush, not harsh)
  const revCut = (x <= 45)
    ? lerp(9000, 6000, (x - 0) / 45)
    : lerp(6000, 7500, (x - 45) / 15);
  reverbTone.frequency.setTargetAtTime(revCut, now, 0.1);

  // ===== 4) PARALLEL COMP — "punchy bass" at x=30 & x=60 =====
  const compStrength = Math.max(gauss(x, 30, 5.0), gauss(x, 60, 5.0)); // 0..1

  // Low-shelf boost (into comp) enhances bass impact when strong
  const shelfGain = lerp(0, 10, compStrength); // up to +10 dB
  compPreEQ.gain.setTargetAtTime(shelfGain, now, 0.05);

  // Stronger compression at peaks, but keep attack a touch slower for punch
  const thr = lerp(-20, -36, compStrength);
  const rat = lerp(3.0, 10.0, compStrength);
  const atk = lerp(0.015, 0.028, compStrength); // slower when strong => more punch
  const rel = lerp(0.14, 0.09, compStrength);

  compressor.threshold.setTargetAtTime(thr, now, 0.05);
  compressor.ratio.setTargetAtTime(rat, now, 0.05);
  compressor.attack.setTargetAtTime(atk, now, 0.05);
  compressor.release.setTargetAtTime(rel, now, 0.05);

  // Parallel blend & makeup gain
  const wetAmt = lerp(0.0, 0.75, compStrength); // add a lot at peaks
  const makeup = lerp(1.0, 1.8, compStrength);  // compensate gain reduction
  compWet.gain.setTargetAtTime(wetAmt, now, 0.05);
  compMakeup.gain.setTargetAtTime(makeup, now, 0.05);
}

// ----------------------------------------------------
// Init (loads audio + IRs, builds graph, wires button)
// ----------------------------------------------------
export async function initAudio(url, playButtonId) {
  const [_, irs] = await Promise.all([
    loadAudio(url),
    loadImpulseResponses()
  ]);

  ensureGraphBuilt(irs);

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
