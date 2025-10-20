// helpers/audio.js
// IMMERSIVE VERSION — enhanced intensity + L/R compression peaks
// Comments show tweakable intensity parameters throughout.

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
  console.log("✅ IRs loaded:", {
    small: !!small,
    large: !!large,
    medium: !!medium,
  });
  return { small, large, medium };
}

// ----------------------------------------------------
// Build Graph
// ----------------------------------------------------
function ensureGraphBuilt(irBuffers) {
  if (mix) return;

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
  delayNode.delayTime.value = 0.5;
  delayFeedback = audioContext.createGain();
  delayFeedback.gain.value = 0.55;
  delayWet = audioContext.createGain();
  delayWet.gain.value = 0.4;
  delayTone = audioContext.createBiquadFilter();
  delayTone.type = "lowpass";
  delayTone.frequency.value = 7000;
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

  convWetSmall.gain.value = 0.4;
  convWetLarge.gain.value = 0.0;
  convWetMedium.gain.value = 0.0;

  reverbBus = audioContext.createGain();
  reverbPreDelay = audioContext.createDelay();
  reverbPreDelay.delayTime.value = 0.04;
  reverbTone = audioContext.createBiquadFilter();
  reverbTone.type = "lowpass";
  reverbTone.frequency.value = 9000;

  // === COMPRESSION (parallel) ===
  mix = audioContext.createGain();
  compPreEQ = audioContext.createBiquadFilter();
  compPreEQ.type = "lowshelf";
  compPreEQ.frequency.value = 120;
  compPreEQ.gain.value = 0;

  compressor = audioContext.createDynamicsCompressor();
  compressor.threshold.value = -28;
  compressor.ratio.value = 6;
  compressor.attack.value = 0.015;
  compressor.release.value = 0.12;

  compMakeup = audioContext.createGain();
  compMakeup.gain.value = 1.2;
  compWet = audioContext.createGain();
  compWet.gain.value = 0.6;

  // === WIRING ===
  merger.connect(dryGain).connect(mix);

  merger.connect(delayNode);
  delayNode.connect(delayTone).connect(delayWet).connect(mix);

  merger.connect(reverbPreDelay);
  reverbPreDelay.connect(convolverSmall);
  reverbPreDelay.connect(convolverLarge);
  reverbPreDelay.connect(convolverMedium);
  convolverSmall.connect(convWetSmall).connect(reverbBus);
  convolverLarge.connect(convWetLarge).connect(reverbBus);
  convolverMedium.connect(convWetMedium).connect(reverbBus);
  reverbBus.connect(reverbTone).connect(mix);

  merger.connect(compPreEQ).connect(compressor).connect(compMakeup).connect(compWet).connect(mix);

  mix.connect(audioContext.destination);
  console.log("✅ Audio graph built successfully");
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
  console.log("▶️ Audio playing");
}

export function stopAudio() {
  if (source) {
    try {
      source.stop();
      source.disconnect();
    } catch {}
    console.log("⏹️ Audio stopped");
    source = null;
  }
}

// ----------------------------------------------------
// Update FX envelopes (called each frame)
// ----------------------------------------------------
export function updatePan() {
  if (!leftGain || !rightGain) return;
  const x = clamp(camera.position.x, 0, 60);
  const now = audioContext.currentTime;

  // ===== 1) HARD L/R PAN =====
  const period = 30;
  const t = (x % period) / period;
  let pan = 1 - 4 * Math.abs(t - 0.5);
  pan = clamp(pan, -1, 1);
  let L = pan <= 0 ? 1 : 1 - pan;
  let R = pan >= 0 ? 1 :
