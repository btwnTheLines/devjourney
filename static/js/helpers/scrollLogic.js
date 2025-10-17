import { toruses } from '../scenes/torusScene.js';

// ------------------------
// SCROLL HANDLING
// ------------------------
export let scrollX = {};       // raw scroll value
export let cameraX = {};       // smoothed camera position

scrollX.position = 0; 
cameraX.position = 0;    

window.addEventListener('wheel', (e) => {
    scrollX.position += e.deltaY * 0.5; // adjust sensitivity
    scrollX.position = Math.max(0, Math.min(scrollX.position, 15*(toruses.length - 1))); // clamp to avoid overscroll
});