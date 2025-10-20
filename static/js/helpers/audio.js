// helpers/audio.js
// ULTRA IMMERSIVE — Intense spatial audio experience version
// Everything breathes and reacts dramatically to camera position,
// but still safe for speakers and comfortable for listening.

import { camera } from "../core/threeSetup.js";

export const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer = null;
let source = null;

// ==== PAN / DRY PATH ====
let splitter = null;
let leftGain = null;
let rightGain = null;
let merger = null;
let dryGain = null;

// ==== DELAY ====
let delayNode = null;
let delayFeedback = null;
let delayWet = null;
let delayTone = null;

// ==== CONVOLVER REVERB ====
let convolverSmall = null;
let convolverLarge = null;
let convolverMedium = null;
let convWetSmall = null;
let convWetLarge = null;
let convWetMedium = null;
let reverbBus = null;
let reverbPreDelay = null;
let reverbTone = null;

// ==== MASTER / PARALLEL COMPRESSION ====
let mix = null;
let compressor = null;
let compPreEQ = null;
let compWet = null;
let compMakeup = null;
let limiter = null; // final limiter to prevent overloads

// ----------------------------------------------------
// Utilities
// ----------------------------------------------------
async function decode(url) {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return await audioContext.decodeAudioData(buf);
}
function gauss(x, c, w) {
  const t = (x - c) / w;
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
  console.log("✅ IRs loaded:", { small: !!small, large: !!large, medium: !!medium });
  return { small, large, medium };
}

// ----------------------------------------------------
// Build Graph
// ----------------------------------------------------
function ensureGraphBuilt(irBuffers) {
  if (mix) return;

  // === PAN SPLITTER ===
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

  // === DELAY ===
  delayNode = audioContext.createDelay();
  delayNode.delayTime.value = 0.55;
  delayFeedback = audioContext.createGain();
  delayFeedback.gain.value = 0.65; // INTENSITY CONTROL
  delayWet = audioContext.createGain();
  delayWet.gain.value = 0.5; // Louder echoes
  delayTone = audioContext.createBiquadFilter();
  delayTone.type = "lowpass";
  delayTone.frequency.value = 8000;
  delayNode.connect(delayFeedback);
  delayFeedback.connect(delayNode);

  // === REVERB ===
  convolverSmall = audioContext.createConvolver();
  convolverLarge = audioContext.createConvolver();
  convolverMedium = audioContext.createConvolver();
  convolverSmall.buffer = irBuffers.small;
  convolverLarge.buffer = irBuffers.large;
  convolverMedium.buffer = irBuffers.medium;

  convWetSmall = audioContext.createGain();
  convWetLarge = audioContext.createGain();
  convWetMedium = audioContext.createGain();
  convWetSmall.gain.value = 0.5;
  convWetLarge.gain.value = 0.0;
  convWetMedium.gain.value = 0.0;

  reverbBus = audioContext.createGain();
  reverbPreDelay = audioContext.createDelay();
  reverbPreDelay.delayTime.value = 0.05;
  reverbTone = audioContext.createBiquadFilter();
  reverbTone.type = "lowpass";
  reverbTone.frequency.value = 10000;

  // === COMPRESSION (parallel) ===
  mix = audioContext.createGain();
  compPreEQ = audioContext.createBiquadFilter();
  compPreEQ.type = "lowshelf";
  compPreEQ.frequency.value = 120;
  compPreEQ.gain.value = 0;

  compressor = audioContext.createDynamicsCompressor();
  compressor.threshold.value = -30;
  compressor.ratio.value = 7;
  compressor.attack.value = 0.015;
  compressor.release.value = 0.15;

  compMakeup = audioContext.createGain();
  compMakeup.gain.value = 1.4;
  compWet = audioContext.createGain();
  compWet.gain.value = 0.7; // INTENSITY CONTROL

  // === SAFETY LIMITER ===
  limiter = audioContext.createDynamicsCompressor();
  limiter.threshold.value = -2;
  limiter.knee.value = 0;
  limiter.ratio.value = 20; // Hard limiting
  limiter.attack.value = 0.001;
  limiter.release.value = 0.1;

  // === WIRING ===
  merger.connect(dryGain).connect(mix);

  // Delay
  merger.connect(delayNode);
  delayNode.connect(delayTone).connect(delayWet).connect(mix);

  // Reverb
  merger.connect(reverbPreDelay);
  reverbPreDelay.connect(convolverSmall);
  reverbPreDelay.connect(convolverLarge);
  reverbPreDelay.connect(convolverMedium);
  convolverSmall.connect(convWetSmall).connect(reverbBus);
  convolverLarge.connect(convWetLarge).connect(reverbBus);
  convolverMedium.connect(convWetMedium).connect(reverbBus);
  reverbBus.connect(reverbTone).connect(mix);

  // Parallel compression
  merger.connect(compPreEQ).connect(compressor).connect(compMakeup).connect(compWet).connect(mix);

  // Final limiter
  mix.connect(limiter).connect(audioContext.destination);

  console.log("✅ Audio graph built successfully (Intense mode)");
}

// ----------------------------------------------------
// Playback
// ----------------------------------------------------
export function playAudio() {
  if (!audioBuffer) {
    console.error("⚠️ Audio not loaded yet!");
    return;
  }
  stopAudio();
  source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = true;
  source.connect(splitter);
  source.start();
  console.log("▶️ Audio playing (intense)");
}

export function stopAudio() {
  if (source) {
    try {
      source.stop();
      source.disconnect();
    } catch {}
    source = null;
  }
}

// ----------------------------------------------------
// Update FX envelopes — dramatic motion
// ----------------------------------------------------
export function updatePan() {
  console.log("updatePan called");
  if (!leftGain || !rightGain) return;
  const x = clamp(camera.position.x, 0, 60);
  const now = audioContext.currentTime;

  // ===== 1) HARD PAN =====
  const period = 30;
  const t = (x % period) / period;
  let pan = 1 - 4 * Math.abs(t - 0.5);
  pan = clamp(pan, -1, 1);
  let L = pan <= 0 ? 1 : 1 - pan;
  let R = pan >= 0 ? 1 : 1 + pan;
  leftGain.gain.setTargetAtTime(L, now, 0.02);
  rightGain.gain.setTargetAtTime(R, now, 0.02);

  // ===== 2) DELAY =====
  const delayPeak = gauss(x, 27.5, 6.0);
  const wetDelay = lerp(0.3, 1.0, delayPeak);
  delayWet.gain.setTargetAtTime(wetDelay, now, 0.05);
  const fb = lerp(0.5, 0.85, delayPeak);
  delayFeedback.gain.setTargetAtTime(fb, now, 0.05);
  const toneCut = lerp(9000, 3500, delayPeak);
  delayTone.frequency.setTargetAtTime(toneCut, now, 0.05);

  // ===== 3) REVERB CROSSFADE =====
  let wSmall = 0, wLarge = 0, wMedium = 0;
  if (x <= 15) {
    const k = x / 15;
    wSmall = lerp(0.4, 1.0, k);
  } else if (x <= 45) {
    const k = (x - 15) / 30;
    wSmall = lerp(1.0, 0.0, k);
    wLarge = lerp(0.0, 1.5, k); // INTENSE reverb zone
  } else {
    const k = (x - 45) / 15;
    wLarge = lerp(1.5, 0.0, k);
    wMedium = lerp(0.0, 1.0, k);
  }
  convWetSmall.gain.setTargetAtTime(wSmall, now, 0.08);
  convWetLarge.gain.setTargetAtTime(wLarge, now, 0.08);
  convWetMedium.gain.setTargetAtTime(wMedium, now, 0.08);

  const pd = lerp(0.03, 0.09, delayPeak);
  reverbPreDelay.delayTime.setTargetAtTime(pd, now, 0.05);
  reverbTone.frequency.setTargetAtTime(lerp(10000, 5000, delayPeak), now, 0.05);

  // ===== 4) COMPRESSION =====
  const compStrength = Math.max(gauss(x, 30, 5.0), gauss(x, 60, 5.0));
  const shelfGain = lerp(0, 14, compStrength);
  compPreEQ.gain.setTargetAtTime(shelfGain, now, 0.05);
  let thr = lerp(-22, -40, compStrength);
  let rat = lerp(5, 14, compStrength);
  let makeup = lerp(1.2, 2.2, compStrength);
  let wetAmt = lerp(0.4, 1.0, compStrength);

  // ---- PAN PEAK BOOST ----
  const panPeak = Math.abs(pan);
  const peakBoost = gauss(panPeak, 1.0, 0.25);
  thr -= peakBoost * 10;
  rat += peakBoost * 8;
  makeup += peakBoost * 1.4;
  wetAmt += peakBoost * 0.5;

  compressor.threshold.setTargetAtTime(thr, now, 0.05);
  compressor.ratio.setTargetAtTime(rat, now, 0.05);
  compWet.gain.setTargetAtTime(wetAmt, now, 0.05);
  compMakeup.gain.setTargetAtTime(makeup, now, 0.05);
}

// ----------------------------------------------------
// Init
// ----------------------------------------------------
export async function initAudio(url, playButtonId) {
  console.log("initAudio called");
  try {
    console.log("🎧 Initializing audio system...");

    const [_, irs] = await Promise.all([
      loadAudio(url),
      loadImpulseResponses(),
    ]);

    if (!irs || !irs.small || !irs.large || !irs.medium) {
      console.error("⚠️ One or more impulse responses failed to load:", irs);
      return;
    }

    ensureGraphBuilt(irs);

    const button = document.getElementById(playButtonId);
    if (!button) {
      console.warn(`⚠️ Button #${playButtonId} not found`);
      return;
    }

    button.disabled = false;
    const setLabel = () =>
      (button.textContent = source ? "Disable Audio ♬" : "Enable Audio ♬");
    setLabel();

    button.addEventListener("click", async () => {
      if (audioContext.state === "suspended") await audioContext.resume();
      if (source) stopAudio();
      else playAudio();
      setLabel();
    });

    console.log("✅ Audio initialized successfully");
  } catch (err) {
    console.error("❌ Audio init failed:", err);
  }
}



