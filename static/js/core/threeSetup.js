// Import three.js and helper
import * as threeModule from '../node_modules/three/build/three.module.js';

// ------------------------
// CLOCK
// ------------------------
let clock = new threeModule.Clock(); // for animations

// ------------------------
// SCENE
// ------------------------
const scene = new threeModule.Scene();
scene.background = new threeModule.Color(0x202020);

// ------------------------
// LIGHT
// ------------------------
const light = new threeModule.DirectionalLight(0xfff1ff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

// ------------------------
// CAMERA
// ------------------------
const camera = new threeModule.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;
camera.position.y = 0.8;

// ------------------------
// RENDERER (as background)
// ------------------------
const renderer = new threeModule.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // transparent background
document.getElementById('three-background').appendChild(renderer.domElement);

// ------------------------
// HANDLE RESIZE
// ------------------------
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ------------------------
// EXPORTS
// ------------------------

export{ threeModule, clock, scene, camera, renderer };