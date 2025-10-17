import { camera } from "../core/threeSetup.js";

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer;
let source = null;
export let pannerNode = null;

// ✅ Load audio into buffer
export async function loadAudio(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
}

// ✅ Play audio with 3D panning
export function playAudio() {
    if (!audioBuffer) {
        console.error("Audio not loaded yet!");
        return;
    }

    // Stop old source
    if (source) {
        source.stop();
        source.disconnect();
        source = null;
    }

    // Create new buffer source
    source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    // Only create pannerNode once
    if (!pannerNode) {
        pannerNode = audioContext.createPanner();
        pannerNode.panningModel = "HRTF"; // realistic 3D sound
        pannerNode.distanceModel = "linear"; // fade based on distance
        pannerNode.refDistance = 1;           // full volume at 1 unit
        pannerNode.maxDistance = 5;           // volume = 0 at 5 units
        pannerNode.rolloffFactor = 1.5;       // fade speed
        pannerNode.connect(audioContext.destination);
    }

    source.connect(pannerNode);
    source.start();

    source.onended = () => {
        source.disconnect();
        source = null;
    };
}

// ✅ Update the 3D position and distance-based volume
export function updatePan() {
    if (!pannerNode) return;

    // Map camera.position.x (0 → 62) to angle 0 → 4π (2 full circles)
    const angle = (camera.position.x / 62) * (2 * Math.PI * 2);
    const radius = 2;

    // Sound orbits around the camera in XZ plane
    const soundX = Math.cos(angle) * radius;
    const soundZ = Math.sin(angle) * radius;
    const soundY = 0; // same height as camera

    pannerNode.positionX.value = soundX;
    pannerNode.positionY.value = soundY;
    pannerNode.positionZ.value = soundZ;

    // Optional: calculate distance manually for additional control
    const dx = camera.position.x - soundX;
    const dy = camera.position.y - soundY;
    const dz = camera.position.z - soundZ;
    const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);

    // Manual volume scaling (optional, if you want stronger fade)
    if (source) {
        const maxDist = 5; // same as pannerNode.maxDistance
        const volume = Math.max(0, 1 - distance / maxDist);
        //source.gain?.setValueAtTime(volume, audioContext.currentTime); 
    }

    // Debug
    console.log(`Sound pos: x=${soundX.toFixed(2)}, z=${soundZ.toFixed(2)}, distance=${distance.toFixed(2)}`);
}

// ✅ Initialize audio
export async function initAudio(url, playButtonId) {
    await loadAudio(url);

    const button = document.getElementById(playButtonId);
    button.disabled = false;

    button.addEventListener("click", async () => {
        if (audioContext.state === "suspended") await audioContext.resume();
        playAudio();

        if(button.innerText === "Enable Audio ♬"){
            button.innerText = "Disable Audio ♬";
        } else {
            button.innerText = "Enable Audio ♬";
        }
    });
}